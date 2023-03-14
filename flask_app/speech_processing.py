import matplotlib.pyplot as plt
import numpy as np
import parselmouth
from parselmouth.praat import call
import librosa
from google.cloud import speech_v1
from google.cloud import speech_v1p1beta1
from google.cloud.speech_v1 import enums
from flask import Flask, render_template, request, jsonify
import io
import base64


def process_speech(data, text_selection, sound_file_path):
    """
    Main speech processing function. 

    The function identifies type of processing required depending on text_selection.
    Specific speech analysis functions are called from this function. 

    Parameters: 
    data (wav file): user audio file
    text_selection (string): the word / phrase selected by the user  
    sound_file_path (string): file path for user audio (temp folder) 

    Returns: 
    results: the string result which is displayed to the user in the UI
    img_id: the image id for the word stress image (returns "0" if not word stress)
    png_b64: the pitch diagram (returns "0" if not intonation)

    """

    individual = ['sit', 'seat', 'sheet']
    stress = ["garden_1", "attack_2", "police_2", "happen_1"]

    if text_selection in individual:
        if str(text_selection) == 'sit':
            phrases = ['seat', 'sit', 'shit', 'Sid', 'sheet']
        elif text_selection == 'seat':
            phrases = ['sheet', 'sit', 'seed', 'seat']
        else:
            phrases = ['shit', 'seat', 'sit', 'sheet']
        results = recognise_speech(data, phrases, text_selection)
        img_id = "0"
        png_b64 = "0"

    elif text_selection in stress:
        try:
            trimmed = trim_silence(sound_file_path)
            results, img_id = get_stress(trimmed, text_selection)
            png_b64 = "0"
        except:
            results = "Results not available. Please go back and try again."
            img_id = "0"
            png_b64 = "0"

    else:
        snd = parselmouth.Sound(sound_file_path)
        pitch_fig(snd)
        file_buffer = io.BytesIO()
        plt.savefig(file_buffer, format='png')
        file_buffer.seek(0)
        png_b64 = base64.b64encode(file_buffer.read()).decode('ascii')
        results = "<p>Look at the pitch line on your graph and compare it with the model graph.</p><p>How similar are they?</p><p>Try again and see if you can get closer to the model.</p>"
        img_id = "0"

    return results, img_id, png_b64


def trim_silence(filename):
    """
    Trims silence from the beginning and end of the audio file. 

    Parameters: 
    filename (string): file path for user audio (temp folder) 

    Returns: 
    trimmed_snd: Parselmouth sound object of the trimmed audio


    """
    samples, sample_rate = librosa.load(filename)

    trimmed, _ = librosa.effects.trim(samples)

    trimmed_snd = parselmouth.Sound(trimmed)

    return trimmed_snd


def draw_pitch(pitch, snd):
    """
    Plots the pitch. 

    Parameters: 
    pitch (Parselmouth sound object): user audio pitch
    snd (Parselmouth sound object): user audio

    """
    # extract pitch contour
    pitch_values = pitch.selected_array['frequency']
    # when there is no pitch, frequency in Praat = 0. replace unvoiced samples by NaN to avoid plotting zeros.
    pitch_values[pitch_values == 0] = np.nan
    # time values are returned as an array when command pitch.xs() is run
    plt.plot(pitch.xs(), pitch_values, 'o',
             markersize=3, label="pitch", color="teal")
    plt.grid(False)
    plt.yticks([])
    plt.xlim([snd.xmin, snd.xmax])
    plt.ylim(0, pitch.ceiling)
    plt.legend()


def pitch_fig(snd):
    """
    Plots the pitch and amplitude

    Parameters: 
    snd (Parselmouth sound object): user audio

    """
    plt.figure()
    plt.plot(snd.xs(), snd.values.T, color="lightgrey", label="amplitude")
    plt.yticks([])
    plt.xlim([snd.xmin, snd.xmax])
    plt.twinx()
    pitch = snd.to_pitch()
    draw_pitch(pitch, snd)
    plt.xlabel("time [s]")
    plt.legend()


def get_stress(filename, text_selection):
    """
    Word stress prediction function. 

    The function predicts on which syllable the stress falls.

    This function is adapted from David R. Feinberg's function: 
    https://github.com/drfeinberg/PraatScripts/blob/master/syllable_nuclei.py


    Parameters: 
    filename (string): file path for user audio (temp folder) 
    text_selection (string): the word / phrase selected by the user  

    Returns: 
    stress_response: the string result which is displayed to the user in the UI
    img_id: the image id for the word stress image 

    """

    texts = {"garden_1": "garden", "attack_2": "attack",
             "police_2": "police", "happen_1": "happen"}

    silencedb = -25
    mindip = 2
    minpause = 0.3
    sound = parselmouth.Sound(filename)
    originaldur = sound.get_total_duration()
    intensity = sound.to_intensity()
    min_intensity = call(intensity, "Get minimum", 0, 0, "Parabolic")
    max_intensity = call(intensity, "Get maximum", 0, 0, "Parabolic")

    # get .99 quantile to get maximum (without influence of non-speech sound bursts)
    max_99_intensity = call(intensity, "Get quantile", 0, 0, 0.99)

    # estimate Intensity threshold
    threshold = max_99_intensity + silencedb
    threshold2 = max_intensity - max_99_intensity
    threshold3 = silencedb - threshold2
    if threshold < min_intensity:
        threshold = min_intensity

    intensity_matrix = call(intensity, "Down to Matrix")
    # sndintid = sound_from_intensity_matrix
    sound_from_intensity_matrix = call(intensity_matrix, "To Sound (slice)", 1)
    # use total duration, not end time, to find out duration of intdur (intensity_duration)
    # in order to allow nonzero starting times.
    intensity_duration = call(
        sound_from_intensity_matrix, "Get total duration")
    intensity_max = call(sound_from_intensity_matrix,
                         "Get maximum", 0, 0, "Parabolic")
    point_process = call(sound_from_intensity_matrix,
                         "To PointProcess (extrema)", "Left", "yes", "no", "Sinc70")
    # estimate peak positions (all peaks)
    numpeaks = call(point_process, "Get number of points")
    t = [call(point_process, "Get time from index", i + 1)
         for i in range(numpeaks)]

    # fill array with intensity values
    timepeaks = []
    peakcount = 0
    intensities = []
    for i in range(numpeaks):
        value = call(sound_from_intensity_matrix,
                     "Get value at time", t[i], "Cubic")
        if value > threshold:
            peakcount += 1
            intensities.append(value)
            timepeaks.append(t[i])

    syl1 = 0
    syl2 = 0

    peak_index = np.argmax(np.asarray(intensities))
    peak = timepeaks[peak_index]
    segment = originaldur / 2

    if peak < segment:
        syl1 += 1
    else:
        syl2 += 1

    for time_val in timepeaks:
        if time_val < segment:
            syl1 += 1
        else:
            syl2 += 1

    if syl1 >= syl2:
        stress = 1
    elif syl2 > syl1:
        stress = 2
    else:
        stress = 0

    img_id = str(texts[text_selection] + "_" + str(stress))

    if stress == 1 and img_id == text_selection:
        stress_response = "It sounds like you correctly stressed the first syllable - well done!"
    elif stress == 1 and img_id != text_selection:
        stress_response = "It sounds like you stressed the first syllable. Try again but this time with the stress on the second syllable."
    elif stress == 2 and img_id == text_selection:
        stress_response = "It sounds like you correctly stressed the second syllable - well done!"
    elif stress == 2 and img_id != text_selection:
        stress_response = "It sounds like you stressed the second syllable. Try again but this time with the stress on the first syllable."
    else:
        stress_response = "Results not available. Please go back and try again."

    return stress_response, img_id


def recognise_speech(data, phrases, text_selection):
    """
    Individual Sounds function. 

    The function uses Google Speech-to-Text.

    Parameters: 
    data (wav file): user audio file
    phrases (list): list of likely phrases (phrases are decided in process_speech function)
    text_selection (string): the word / phrase selected by the user  


    Returns: 
    indiv_response: the string result which is displayed to the user in the UI

    """

    client = speech_v1p1beta1.SpeechClient()
    language_code = "en-GB"

    encoding = enums.RecognitionConfig.AudioEncoding.LINEAR16
    config = {
        "language_code": language_code,
        "encoding": encoding,
        "audio_channel_count": 1,
        "max_alternatives": 3,
        "model": "command_and_search"
    }

    audio = {"content": data}

    boost = 20.0
    speech_contexts_element = {"phrases": phrases, "boost": boost}
    speech_contexts = [speech_contexts_element]

    recognised = client.recognize(config, audio)
    confidences = []
    transcripts = []

    for result in recognised.results:
        print(len(result.alternatives))
        for i in range(len(result.alternatives)):
            alternative = result.alternatives[i]
            text = str(alternative.transcript)
            transcripts.append(text)
            score = float(alternative.confidence)
            confidences.append(score)

    indiv_response = "Result unavailable. Please go back and try again."
    if transcripts:
        if text_selection in transcripts:
            if transcripts[0] == text_selection:
                if len(transcripts) == 1:
                    indiv_response = "Your pronunciation of <em>" + \
                        text_selection + "</em> is excellent! Well done!"

                elif confidences[0] >= 0.75:
                    indiv_response = "Your pronunciation of <em>" + \
                        text_selection + "</em> is excellent! Well done!"

                elif confidences[0] >= 0.5:
                    indiv_response = "Your pronunciation of <em>" + \
                        text_selection + "</em> is very good! Well done!"

                else:
                    indiv_response = "Your pronunciation of <em>" + \
                        text_selection + "</em> is good, but see if you can pronounce it a little more clearly."

            else:
                indiv_response = "Your pronunciation of <em>" + \
                    text_selection + "</em> is okay, but see if you can pronounce it a little more clearly."

        else:
            if str(text_selection) == 'sit':
                if 'seat' in transcripts:
                    indiv_response = "Good try. Keep practising the /ɪ/ sound."
                elif 'set' in transcripts:
                    indiv_response = "Good try. Keep practising the /ɪ/ sound."
                elif 'shit' in transcripts:
                    indiv_response = "Good try. Keep practising the /s/ sound."
                elif 'Sid' in transcripts:
                    indiv_response = "Good try. Keep practising the /t/ sound."
                else:
                    indiv_response = "Your pronunciation wasn't very clear. Please go back and try again."

            elif str(text_selection) == 'seat':
                if 'sheet' in transcripts:
                    indiv_response = "Good try. Keep practising the /s/ sound."
                elif 'sit' in transcripts:
                    indiv_response = "Good try. Keep practising the /i:/ sound."
                elif 'seed' in transcripts:
                    indiv_response = "Good try. Keep practising the /t/ sound."
                else:
                    indiv_response = "Your pronunciation wasn't very clear. Please go back and try again."

            else:
                if 'seat' in transcripts:
                    indiv_response = "Good try. Keep practising the /ʃ/ sound."
                elif 'shit' in transcripts:
                    indiv_response = "Good try. Keep practising the /i:/ sound."
                elif "she'd" in transcripts:
                    indiv_response = "Good try. Keep practising /t/ sound."
                else:
                    indiv_response = "Your pronunciation wasn't very clear. Please go back and try again."

    else:
        indiv_response = "Result unavailable. Please go back and try again."

    return indiv_response

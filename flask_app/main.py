from flask import Flask, render_template, request, jsonify
import random
import os
from google.cloud import speech_v1
from google.cloud.speech_v1 import enums
import io
import parselmouth
import matplotlib  # nopep8
matplotlib.use('Agg')  # nopep8
import matplotlib.pyplot as plt  # nopep8
import numpy as np
# import tkinter
import uuid
import base64
# pip install librosa
import librosa
from speech_processing import *



app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'


@app.route('/activate_ae', methods=['GET', 'POST'])
def activate_ae():
    message = "success"
    return message, 200


@app.route('/uploader', methods=['GET', 'POST'])
def recognise():

    ae_status = os.getenv('GAE_APPLICATION', 'local')
    tmp_folder = 'uploads' if ae_status == 'local' else '/tmp'

    text_selection = request.values['selectedValue']

    data = request.files['file'].read()

    unique_filename = str(uuid.uuid4())
    sound_file_path = f'{tmp_folder}/{unique_filename}.wav'
    f = open(sound_file_path, 'wb')
    f.write(data)
    f.close()

    final_result, img_id, pitch_img = process_speech(
        data, text_selection, sound_file_path)

    response_dict = {
        'response': final_result,
        'img_id': img_id,
        'pitch_image': pitch_img
    }
    response = jsonify(response_dict)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response, 200

# if __name__ == '__main__':
#     app.run(debug=True)

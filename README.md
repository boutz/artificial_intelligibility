# README for Artificial Intelligibility

Installation is not required as the Artificial Intelligibility web application can be accessed at [www.artificialintelligibility.com](https://www.artificialintelligibility.com/)

# /web_dev

This folder contains the required files for the front end application

## /audio

This folder contains all of the audio files used in the UI

## /css

This folder contains the CSS files.

- **style.css.CSS** is the CSS file for the project.
- The other files are part of the Semantic UI framework.

## /images

This folder contains the image files used in the UI.

## /js

This folder contains the JavaScript files used in the UI.

- **script.js** is the main file containing all of the functions for the application.
- **sounds.js** contains the file paths for images, audio, phonemic script for words etc.
- **polyfill.js** is the file used for the polyfill package used for ensuring audio is in WAV format
- **semantic.min.js**, **jquery-3.1.1.js** and **/UI-icon-master** are files required for the Semantic UI framework

# /flask_app

This folder contains the required files for the back end

- **main. py** is the main file is which handles the request and response from the front end

- **speech_processing.py** is the file which handles all of the speech analysis

- **requirements.txt** lists the requirements

- **app.yaml** specifies the configuration for google app engine

- **/uploads** is a folder used to store the user audio when the application is running locally

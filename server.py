from flask import Flask, request, jsonify, Response, send_file, make_response
from flask_cors import CORS
from Module1 import VocalExtraction
import os

app = Flask(__name__)
CORS(app)

try:
    uploads_dir = '/Users/bhavesh/Desktop/FYP/UploadedSongs'
    os.makedirs(uploads_dir)
except:
    print("Folder exixts")

@app.route('/api/v1/home',methods=['GET'])
def home():
    return jsonify({'response':'Flask Api setup working','status':'success'}) , 200

@app.route('/api/v1/extractVocal',methods=['POST'])
def extract():
    songName = request.form['songName']
    song = request.files['audio']
    songPath = os.path.join(uploads_dir, song.filename)

    try:
        song.save(songPath)
        print("Song saved")
    except:
        print('File exists')

    vocalObj = VocalExtraction(songPath, songName)
    vocalObj.extractVocal()
    vocalObj.trimExtractedVocal()
    path_to_file = vocalObj.destinationPath

    try:
        return make_response(
            send_file(
            path_to_file, 
            mimetype="audio/wav", 
            as_attachment=True, 
            attachment_filename='songName'+".wav"
            ), 
            200)
    except:
        return make_response(
            jsonify(
                {"message":"Could not be processed pleae try again later"}
            ), 
            400)


if __name__ == "__main__":
	app.run(debug=True)
from flask import Flask, request, jsonify, Response, send_file, make_response
from flask_cors import CORS
from Module1 import VocalExtraction
import os
import pyrebase
import requests
import json

firebaseConfig = {
    "apiKey": "AIzaSyAcbBkzH2YnTPVyDhKGjeA7EFAQf3wNTeE",
    "authDomain": "ainstrument-a03f0.firebaseapp.com",
    "databaseURL": "https://ainstrument-a03f0-default-rtdb.firebaseio.com",
    "storageBucket": "ainstrument-a03f0.appspot.com",
}
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

@app.route('/api/v1/getUsers',methods=['GET'])
def getUsers():
    db = firebase.database()
    users = db.child("users").get()
    print(users.val())
    return jsonify(users.val())

@app.route('/api/v1/signin-user',methods=['POST'])
def signInUser():
    dataReceived = request.get_json()
    email = dataReceived.get("email")
    password = dataReceived.get("password")

    auth = firebase.auth()

    try:
        user = auth.sign_in_with_email_and_password(email, password)
        res = auth.get_account_info(user.get("idToken"))
        print("Res ",res)
        if res.get("users")[0].get("emailVerified"):
            return make_response(
            jsonify(
                {
                    "message":"Logged In successfully",
                    "data":{
                        "userUID":user.get("localId"),
                        "token":user.get("idToken"),
                        "email":user.get("email")
                    },
                    "success":1
                }
            ), 200)
        else:
            return make_response(
            jsonify(
                {
                    "message":"Please Verify email Address to login",
                    "success":0
                }
            ), 400)

    except requests.exceptions.HTTPError as error:
            error = json.loads(error.args[1])
            errorMessage = error.get("error").get("message")
            statusCode = error.get("error").get("code")
            return make_response(
            jsonify(
                {
                    "message":errorMessage,
                    "success":0
                }
            ), statusCode
        )


@app.route('/api/v1/create-user',methods=['POST'])
def createUser():
    dataReceived = request.get_json()

    name = dataReceived.get("name")
    email = dataReceived.get("email")
    password = dataReceived.get("password")

    auth = firebase.auth()

    try:
        user = auth.create_user_with_email_and_password(email, password)
        print(user)
        try:
            db = firebase.database()
            auth.send_email_verification(user['idToken'])
            data = {
                "name": name,
                "email": email
            }
            _ = db.child("users").child(user["localId"]).set(data, user["idToken"])
            return jsonify(
                {
                    "message":"Verification Link has been sent to the above email",
                    "success":1
                }
            ), 200
        except requests.exceptions.HTTPError as error:
            error = json.loads(error.args[1])
            errorMessage = error.get("error").get("message")
            statusCode = error.get("error").get("code")
            return make_response(
            jsonify(
                {
                    "message":errorMessage,
                    "success":0
                }
            ), statusCode
            )

    except requests.exceptions.HTTPError as error:
        print("------------- ",type(error))
        error = json.loads(error.args[1])
        errorMessage = error.get("error").get("message")
        statusCode = error.get("error").get("code")
        return make_response(
            jsonify(
                {
                    "message":errorMessage,
                    "success":0
                }
            ), statusCode
        )
    # db = firebase.database()
    # data = {
    #     "name":name,
    #     "email":email
    # }

if __name__ == "__main__":
    firebase = pyrebase.initialize_app(firebaseConfig)
    app.run(debug=True)
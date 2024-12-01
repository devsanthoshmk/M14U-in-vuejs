from flask import Flask,request,send_from_directory,jsonify

import YoutubeMusicAPI as yt
from ytdlp import make_playable as audio

import requests

app=Flask(__name__,static_folder="assets",template_folder="")

@app.route('/skip_ngrok_warning',methods=['GET'])
def skip_ngrok_warning():
    # The ngrok URL you are trying to access
    ngrok_url = 'https://living-prawn-broadly.ngrok-free.app'
    
    # Make a GET request to ngrok URL with the required header
    headers = {
        'ngrok-skip-browser-warning': 'true'
    }
    
    try:
        # Send the request to ngrok URL with the header
        response = requests.get(ngrok_url, headers=headers)
        
        # Return the response content back to the client
        return response.text, response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

@app.route("/")
def index():
    return send_from_directory('.', 'index.html')

@app.route('/assets/<path:path>')
def send_asset(path):
    return send_from_directory('assets', path)

@app.route('/song_results',methods=['GET'])
def get_song_results():
    song_name=request.args.get('input')
    results=yt.search(song_name,5)
    # print(results)
    return jsonify(results)

@app.route('/playable_link',methods=['GET'])
def song_link():
    song_name=request.args.get('song_url')
    return jsonify(audio(song_name))

if __name__ == '__main__':
    app.run(debug=True)
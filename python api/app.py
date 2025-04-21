from flask import Flask,request,jsonify
from flask_cors import CORS

import YoutubeMusicAPI as yt
from ytdlp import make_playable as audio


app=Flask(__name__)
CORS(app)


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
    app.run(debug=True,port=1234)
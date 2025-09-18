import yt_dlp

# Update your options to include the cookiefile option
ydl_opts = {
    'noplaylist': True,
    'quiet': True,
    'no_warnings': True,
    'cookiefile': './cookies.txt'  # Path to your cookies.txt file
}

def make_playable(url):
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(url, download=False)
        best_audio = None
        best_audio_bitrate = 0
        dic = {}
        index = 0
        for j, i in enumerate(info_dict['formats']):
            if (i["audio_ext"] == "webm" and i["video_ext"] != "webm") or (i["audio_ext"] == "m4a" and i["video_ext"] != "m4a"):
                dic[index] = {
                    "quality": int(i['format'][:3]),
                    "url": i["url"],
                    "audio_ext": i["audio_ext"]
                }
                index += 1
        return next(reversed(dic.values()))["url"]

if __name__ == "__main__":
    print(make_playable('https://www.youtube.com/watch?v=UGB_Bsm5Unk'))

import yt_dlp
import json

ydl_opts = {
    'noplaylist': True,
    'quiet': True,  
    'no_warnings': True 
}
def make_playable(url):
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(url, download=False)
        best_audio = None
        best_audio_bitrate = 0
        dic=dict()
        index=0
        for j,i in enumerate(info_dict['formats']):
            if (i["audio_ext"]=="webm" and i["video_ext"]!="webm") or (i["audio_ext"]=="m4a" and i["video_ext"]!="m4a"):
                # if  dic!={} and int(i['format'][:3])>dic[0]["quality"]:
                    dic[index]={"quality":int(i['format'][:3]),"url":i["url"],"audio_ext":i["audio_ext"]}
                # if dic=={}:
                #     dic[0]={"quality":int(i['format'][:3]),"url":i["url"]}
                    index+=1
        json.dump(info_dict, open("del.json", "w"))
        json.dump(dic, open("dic.json", "w"))
        return  next(reversed(dic.values()))["url"]

if __name__=="__main__":
    print(make_playable('https://www.youtube.com/watch?v=UGB_Bsm5Unk'))
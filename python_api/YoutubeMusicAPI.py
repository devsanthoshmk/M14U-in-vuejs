import warnings
import httpx
import re

warnings.filterwarnings("ignore", category=DeprecationWarning)

def search(query: str,max : int=10) -> dict[str | None]:
    """_summary_ Returns the Youtube search results with song details 
    

    Args:
        query (str): _description_ search key word 
        max (int, optional): _description_ max number of results needed. Defaults to 10.

    Returns:
        dict[str | None]: _description_ returns something like {0:{song details},1:{song details},...}
    """
    headers: dict = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0"}

    page: str = httpx.get(f"https://music.youtube.com/search?q={query}", headers=headers,
                          timeout=None).content.decode("unicode_escape")

    vidId: str | None = re.finditer('"videoId":"(.*?)"', page)
    vidid=dict()
    for i in vidId:
        if len(vidid) == max:
            break
        vidid[i.group(1)]=None
    trackInfo=dict()  
    for i,j in enumerate(vidid.keys()):
        track_info: dict = httpx.get(f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={j}",
                                 headers=headers, timeout=None).json()
        track_info= {'url': "https://www.youtube.com/watch?v="+j,
                    'name': track_info['title'],
                    'artist': track_info['author_name'],
                    'cover':track_info['thumbnail_url']
                    }
        trackInfo[i]=track_info
    
    return trackInfo
if __name__=='__main__':
    print(search("tamilsongs",2))
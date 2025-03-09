 const { createApp } = Vue
 createApp({
  
        components: {
          draggable: window.vuedraggable,
         },
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks:  [],
      currentTrack: 0,
      currentTrackIndex: 0,
      transitionName: null,

      //used to create dynamic unique id for tracks
      gid:0,
      //offcanvas songs/songQueue

      songSearch : null,
      loading : false,
      showRes : false,
      searchtooltip : false,

      // for song_names
      song_list:[],

        // onclick fetch instead for song name click
      delTracks:[
        {
          name: "MODUS",
          artist: "Joji",
          cover: "https://raw.githubusercontent.com/akshzyx/playerzyx/master/img/nectar-joji.jpg",
          source: "https://raw.githubusercontent.com/akshzyx/playerzyx/master/mp3/MODUS.mp3",
          url: "https://www.youtube.com/watch?v=2Uxq-kIAMBM",
          favorited: true
        },
        {
          name: "Tick Tock",
          artist: "Joji",
          cover: "https://raw.githubusercontent.com/akshzyx/playerzyx/master/img/nectar-joji.jpg",
          source: "https://raw.githubusercontent.com/akshzyx/playerzyx/master/mp3/Tick Tock.mp3",
          url: "https://www.youtube.com/watch?v=2FCo7OxVoeY",
          favorited: false
        },
        {
          name: "Daylight",
          artist: "Joji, Diplo",
          cover: "https://raw.githubusercontent.com/akshzyx/playerzyx/master/img/Daylight-joji.jpg",
          source: "https://raw.githubusercontent.com/akshzyx/playerzyx/master/mp3/Daylight.mp3",
          url: "https://www.youtube.com/watch?v=v97FPN2US2o",
          favorited: false
        },
        {
          name: "Upgrade",
          artist: "Joji",
          cover: "https://raw.githubusercontent.com/akshzyx/playerzyx/master/img/nectar-joji.jpg",
          source: "https://raw.githubusercontent.com/akshzyx/playerzyx/master/mp3/Upgrade.mp3",
          url: "https://www.youtube.com/watch?v=DoE_le4Te9U",
          favorited: true
        },
        {
          name: "Gimme Love",
          artist: "Joji",
          cover: "https://raw.githubusercontent.com/akshzyx/playerzyx/master/img/nectar-joji.jpg",
          source: "https://raw.githubusercontent.com/akshzyx/playerzyx/master/mp3/Gimme Love.mp3",
          url: "https://www.youtube.com/watch?v=jPan651rVMs",
          favorited: false
        }
      ]
      ,

        //for draggable
        drag:false,
        
    };
  },
  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
      setTimeout(() => {
        this.isShowCover = true;
      }, 100);
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if(this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited;
    },
    
    //offcanvas songs/songQueue

    async search(){
      var query=this.songSearch;
      console.log(query);
      //needs more time lastla pathukalam
      // if (query.length < 5){

      // }
      this.loading=true;
      const response = await fetch(`/song_results?input=${encodeURIComponent(query)}`); 
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
      const data = await response.json();
      console.log(data);
      this.song_list=Object.values(data);
      console.log(this.song_list);
      this.loading=false;
      this.showRes=true;

    },
    async makePlayable(link){
      const response = await fetch(`/playable_link?song_url=${encodeURIComponent(link)}`); 
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
      const data = await response.json();
      console.log(data);
      console.log(data);
      return data
    },

    async directAddTrack(track){

      // in process --> //make this a onclick for li song name(<p>) click method before that add that song playable link to tracks and continuoue this

      const trg1=++this.gid;
      track={...track,id:trg1}
      if (trg1===1) this.tracks=[{id:track.id,name:"Loading..."}];
      else this.tracks.splice(0,0,{id:track.id,name:"Loading..."})
      const ind=this.tracks.length -1;
      // await new Promise(resolve => setTimeout(resolve,6000))
      let plink=await this.makePlayable(track.url);
      track={...track,source:plink};
      const index = this.tracks.findIndex(obj => obj.id === trg1);
      if (index !== -1) this.tracks[index] = track;
      let vm = this;
      this.currentTrack = track;
      this.audio = new Audio();
      this.audio.src = this.currentTrack.source;
      this.audio.ontimeupdate = function() {
        vm.generateTime();
      };
      this.audio.onloadedmetadata = function() {
        vm.generateTime();
      };
      this.audio.onended = function() {
        vm.nextTrack();
        this.isTimerPlaying = true;
      };
      // testing must del
      // this.audio.currentTime = 40;
      // this.generateTime();

      // add this in watchers property to preload queue covers
        // this is optional (for preload covers)
      // for (let index = 0; index < this.tracks.length; index++) {
      //   const element = this.tracks[index];
      //   let link = document.createElement('link');
      //   link.rel = "prefetch";
      //   link.href = element.cover;
      //   link.as = "image"
      //   document.head.appendChild(link)
      // }
    },
    async queue(track){
      if (this.tracks.length===0){
        this.directAddTrack(track)
      }
      else{
        const trg2=++this.gid;
        track={...track,id:trg2}
        this.tracks.push({id:track.id,name:"Loading..."});
        let plink=await this.makePlayable(track.url);
        track={...track,source:plink};
        const index = this.tracks.findIndex(obj => obj.id === trg2);
        if (index !== -1) this.tracks[index] = track;
        // let link = document.createElement('link');
        // link.rel = "prefetch";
        // link.href = track.cover;
        // link.as = "image"
        // document.head.appendChild(link)
      }
    },
    removeAt(index) {
      this.tracks.splice(index, 1);
    }
  },
  watch: {
      // for dev
    // gid(newValue){
    //   console.log(newValue);  // Logs the updated value of `myArray`
    // },
    tracks(newValue) {
      console.log(newValue);  // Logs the updated value of `myArray`
      console.log(this.currentTrackIndex,this.tracks[this.currentTrackIndex].id)
    }},
    // tracks[0](newValue,preValue){}
  computed: {
    dragOptions() {

      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
        
      };
    }
  }
  
  
  // created(){
  //     let vm = this;
  //     this.currentTrack = this.tracks[0];
  //     this.audio = new Audio();
  //     this.audio.src = this.currentTrack.source;
  //     this.audio.ontimeupdate = function() {
  //       vm.generateTime();
  //     };
  //     this.audio.onloadedmetadata = function() {
  //       vm.generateTime();
  //     };
  //     this.audio.onended = function() {
  //       vm.nextTrack();
  //       this.isTimerPlaying = true;
  //     };

  //     // add this in watchers property to preload queue covers
  //       // this is optional (for preload covers)
  //     for (let index = 0; index < this.tracks.length; index++) {
  //       const element = this.tracks[index];
  //       let link = document.createElement('link');
  //       link.rel = "prefetch";
  //       link.href = element.cover;
  //       link.as = "image"
  //       document.head.appendChild(link)
  // }

  // }
  }).mount("#app")

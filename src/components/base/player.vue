<template>
  <div>
    <div
      :class="[
        'lg-play',
        { slideup: lgFlag == true },
        { slidedown: lgFlag == false },
      ]"
    >
      <div class="lg-title">
        <div class="lg-down" @click="lgFlag = false">
          <i class="iconfont icon-down"></i>
        </div>
        <div class="lg-songname">
          <p class="songname">{{ this.songsDetail.name }}</p>
          <div class="artist-name">
            <span v-for="item in this.songsDetail.ar" :key="item.id">{{
              item.name
            }}</span>
          </div>
        </div>
      </div>
      <div class="lg-middle" @click="changView">
        <div :class="['lg-pic', 'play', { pause: iconplay }]" v-show="viewFlag">
          <img :src="this.songsDetail.al.picUrl" alt="" />
        </div>
        <div class="lyric" v-show="!viewFlag">
          <ul :style="{ top: lyricTop }">
            <li
              v-for="(item, index) in lyricList"
              :key="index"
              :class="{ con: currentRow == index }"
            >
              {{ item.text }}
            </li>
          </ul>
        </div>
      </div>
      <div class="lg-bottom">
        <div class="bottom-slider">
          <span class="time-start">{{ timeStart | standerTime }}</span>
          <van-slider
            active-color="#ee0a24"
            bar-height="4px"
            v-model="value"
            @input="lyricInput"
            @change="sliderChange"
          >
            <template #button>
              <div class="custom-button"></div>
            </template>
          </van-slider>
          <span class="time-end">{{ timeEnd | standerTime }}</span>
        </div>
        <div class="bottom-detail">
          <i
            :class="[
              'iconfont',
              { 'icon-liebiaoxunhuan1': playerType == 1 },
              { 'icon-suiji': playerType == 2 },
            ]"
            @click="changeType"
          ></i>
          <i class="iconfont icon-leftcut" @click="prevSongFun"></i>
          <i
            :class="['iconfont', iconplay ? 'icon-zanting1' : 'icon-zanting']"
            @click="togglePlay"
          ></i>
          <i class="iconfont icon-rightcut" @click="nextSongFun"></i>
          <i class="iconfont icon-shoucang1"></i>
        </div>
      </div>
    </div>

    <div class="mini-play" @click="lgFlag = true">
      <div class="song-mini">
        <div :class="['song-mini-pic', 'play', { pause: iconplay }]">
          <img :src="this.songsDetail.al.picUrl" alt="" />
        </div>
        <div class="song-mini-detail">
          <div class="mini-name">{{ this.songsDetail.name }}</div>
          <div class="mini-artist">
            <span v-for="item in this.songsDetail.ar" :key="item.id">{{
              item.name
            }}</span>
          </div>
        </div>
      </div>
      <div class="song-mini-btn">
        <i
          class="iconfont icon-iconplay"
          @click.stop="togglePlay"
          v-show="iconplay"
        ></i>
        <i
          class="iconfont icon-icon-stop"
          v-show="!iconplay"
          @click.stop="togglePlay"
        ></i>
        <i class="iconfont icon-list" @click.stop="musicListToggle"></i>
      </div>
    </div>
    <audio
      :src="musicUrl"
      ref="audio"
      controls
      @ended="endedFun"
      @loadeddata="canplayFun"
      hidden
    ></audio>

    <div class="musiclist" @click.self="musicListToggle" v-if="musicListFlag">
      <dl class="music-detail">
        <dt class="music-title">
          <div class="change-playstatus">
            <i class="iconfont icon-liebiaoxunhuan1"></i>
            <span>顺序播放</span>
            <span class="song-count">({{ songsList.tracks.length }})</span>
          </div>
          <div class="delete-all">
            <i class="iconfont icon-lajitong"></i>
          </div>
        </dt>
        <dd
          class="music-content"
          v-for="(item, index) in songsList.tracks"
          :key="index"
          @click="editPlayId(item.id)"
        >
          <div class="music-name">
            <i class="iconfont icon-shengyin" v-if="item.id == playerId"></i
            >{{ item.name }}
          </div>
          <div class="delete-music">
            <i class="iconfont icon-chushaixuanxiang"></i>
          </div>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { getPlaylistDetail } from "../../api/rank";
import { getSongUrl, getSongDetail, getLyric } from "../../api/play.js";
export default {
  props: ["player-id", "songs-id"],
  data() {
    return {
      lgFlag: null,
      songsDetail: {
        al: {
          picUrl: null,
        },
      },
      musicUrl: null,
      iconplay: true,
      value: 0,
      timeStart: 0,
      timeEnd: 0,
      timer: null,
      songsList: {
        tracks: [],
      },
      musicListFlag: false,
      playerType: 1,
      viewFlag: true,
      lyricList: [],
      lyricTop: "200px",
      currentRow: 0,
    };
  },
  methods: {
    getSongUrlFun() {
      getSongUrl({ id: this.playerId }).then((data) => {
        this.musicUrl = data.data[0].url;
      });
    },
    getSongDetailFun() {
      getSongDetail({ ids: this.playerId }).then((data) => {
        this.$set(this, "songsDetail", data.songs[0]);

        let index = this.songsList.tracks.findIndex(
          (item) => item.id == data.songs[0].id
        );
        if (index == -1) {
          this.songsList.tracks.push(this.songsDetail);
          this.iconplay = true;
        }
      });
    },
    getLyricFun() {
      getLyric({ id: this.playerId }).then((data) => {
        this.dealLyric(data.lrc.lyric);
      });
    },
    dealLyric(data) {
      this.lyricList = [];
      let arr = data.split("\n");
      for (let i = 0; i < arr.length - 1; i++) {
        let arrLyric = arr[i].split("]");
        let arrText = arrLyric.pop();
        arrLyric.forEach((val) => {
          let obj = {};
          let timeArr = val.substr(1, val.length - 1).split(":");
          let s = timeArr[0] * 60 + Math.ceil(timeArr[1]);
          obj.text = arrText;
          obj.time = s;
          if (arrText.length > 0) {
            this.lyricList.push(obj);
          }
        });
      }
    },
    togglePlay() {
      if (this.iconplay) {
        this.$refs.audio.play();
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          let currentTime = this.$refs.audio.currentTime;
          let duration = this.$refs.audio.duration;
          this.timeStart = currentTime;
          //   设置滚动条
          this.value = (currentTime / duration) * 100;
          if (this.value == 100) {
            clearInterval(this.timer);
            this.$refs.audio.pause();
            this.iconplay = true;
          }
        }, 10);
      } else {
        this.$refs.audio.pause();
        clearInterval(this.timer);
      }
      this.iconplay = !this.iconplay;
    },
    endedFun() {
      this.iconplay = true;
      clearInterval(this.timer);
      if (this.playerType == 1) {
        this.nextSongFun();
      } else {
        let index = parseInt(Math.random() * this.songsList.tracks.length);
        this.$emit("get-play-id", this.songsList.tracks[index].id);
      }
    },
    canplayFun() {
      this.togglePlay();
      let duration = this.$refs.audio.duration;
      this.timeEnd = duration;
    },
    sliderChange() {
      let changeTime = (this.$refs.audio.duration * this.value) / 100;
      this.timeStart = changeTime;
      this.$refs.audio.currentTime = changeTime;
    },
    lyricInput() {
      let changeTime = (this.$refs.audio.duration * this.value) / 100;
      for (let i = 0; i < this.lyricList.length; i++) {
        if (this.lyricList[i].time == parseInt(changeTime)) {
          this.lyricTop = 200 - i * 36 + "px";
          this.currentRow = i;
          break;
        }
      }
    },
    musicListToggle() {
      this.musicListFlag = !this.musicListFlag;
    },
    editPlayId(id) {
      this.$emit("get-play-id", id);
      this.iconplay = true;
    },
    nextSongFun() {
      let index = this.songsList.tracks.findIndex(
        (item) => item.id == this.playerId
      );
      index = index + 1 > this.songsList.tracks.length - 1 ? 0 : index + 1;
      this.$emit("get-play-id", this.songsList.tracks[index].id);
      this.iconplay = true;
    },
    prevSongFun() {
      let index = this.songsList.tracks.findIndex(
        (item) => item.id == this.playerId
      );
      index = index - 1 < 0 ? this.songsList.tracks.length - 1 : index - 1;
      this.$emit("get-play-id", this.songsList.tracks[index].id);
      this.iconplay = true;
    },
    changeType() {
      this.playerType = this.playerType == 1 ? 2 : 1;
    },
    changView() {
      this.viewFlag = !this.viewFlag;
    },
  },
  watch: {
    playerId() {
      this.getSongUrlFun();
      this.getSongDetailFun();
      this.getLyricFun();
    },
    songsId() {
      getPlaylistDetail({ id: this.songsId }).then((data) => {
        console.log(data);
        this.songsList = data.playlist;
      });
    },
    timeStart() {
      for (let i = 0; i < this.lyricList.length; i++) {
        if (this.lyricList[i].time == parseInt(this.timeStart)) {
          this.lyricTop = 200 - i * 36 + "px";
          this.currentRow = i;
          break;
        }
      }
    },
  },
  filters: {
    standerTime(val) {
      let m = parseInt(val / 60);
      let s = parseInt(val % 60);
      if (m == 0 && s == 0) {
        return "0:00";
      } else {
        return m + ":" + (s < 10 ? "0" + s : s);
      }
    },
  },
};
</script>

<style lang="less">
.musiclist {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 900;
  width: 100%;
  height: 100%;
  background-color: rgba(218, 218, 218, 0.5);
  .music-detail {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 15.4rem;
    background-color: #fff;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    overflow: scroll;
    .music-title {
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 2rem;
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
      .change-playstatus {
        margin-left: 0.85rem;
        font-size: 17px;
        color: #373838;
        i {
          margin-right: 9px;
          vertical-align: middle;
          font-size: 24px;
        }
      }
      .delete-all {
        margin-right: 1.4rem;
        i {
          font-size: 20px;
          color: #9a9a9a;
        }
      }
    }
    .music-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 2.2rem;
      padding: 0.5rem 1.4rem 0.5rem 0.85rem;
      box-sizing: border-box;
      font-size: 14px;
      .delete-music {
        color: #ee0a24;
      }
      .music-name {
        i {
          margin-right: 3px;
          color: #ee0a24;
          font-size: 12px;
        }
      }
    }
  }
}

.lg-play {
  position: fixed;
  left: 0;
  top: 100%;
  z-index: 900;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #7e7a78, #7e878d);
  .lg-title {
    height: 2.5rem;
    .lg-down {
      padding: 0.7rem;
      font-weight: bold;
      color: #fff;
      box-sizing: border-box;
    }
    .lg-songname {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      padding-top: 0.5rem;
      text-align: center;
      font-weight: bold;
      color: #fff;
      box-sizing: border-box;
      .songname {
        height: 1.2rem;
        margin-bottom: 5px;
        overflow: hidden;
      }
      .artist-name {
        margin-top: 3px;
        font-size: 12px;
      }
    }
  }
  .lg-middle {
    display: flex;
    justify-content: center;
    position: absolute;
    top: 7.15rem;
    width: 100%;
    height: 15rem;
    overflow: hidden;
    .lg-pic {
      width: 15rem;
      height: 15rem;
      border: 0.65rem solid #8b8986;
      border-radius: 50%;
      box-sizing: border-box;
      img {
        width: 100%;
        border-radius: 50%;
      }
      &.play {
        animation: rotate 20s linear infinite;
      }
      &.pause {
        animation-play-state: paused;
      }
    }
    .lyric {
      color: #bcbbbb;
      font-size: 12px;
      text-align: center;
      ul {
        position: absolute;
        left: 0;
        top: 10rem;
        width: 100%;
        height: 100%;
        li {
          line-height: 1.8rem;
          &.con {
            color: #fff;
          }
        }
      }
    }
  }
  .lg-bottom {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 1000;
    width: 100%;
    height: 7rem;
    padding: 0.75rem 1.5rem 2rem;
    box-sizing: border-box;
    .bottom-slider {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: bold;
      color: #fff;
      .time-start {
        margin-right: 12px;
      }
      .time-end {
        margin-left: 12px;
      }
      .custom-button {
        width: 0.75rem;
        height: 0.75rem;
        color: #fff;
        text-align: center;
        background-color: #ee0a24;
        border: 0.25rem solid #fff;
        border-radius: 100px;
        box-sizing: border-box;
      }
    }
    .bottom-detail {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 3.6rem;
      color: #fff;
      i {
        font-size: 30px;
      }
    }
  }
}

.slideup {
  animation: slideup linear 0.3s 1;
  top: 0;
}

@keyframes slideup {
  0% {
    top: 100%;
  }
  100% {
    top: 0;
  }
}

.slidedown {
  top: 100%;
  animation: slidedown linear 0.3s 1;
}

@keyframes slidedown {
  0% {
    top: 0;
  }
  100% {
    top: 100%;
  }
}

.mini-play {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  height: 2.65rem;
  padding: 7px 18px;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0px 0px 4px 0px #bfbfbf;
  .song-mini {
    display: flex;
    align-items: center;
    .song-mini-pic {
      flex: 0 0 1.85rem;
      height: 1.85rem;
      margin-right: 0.5rem;
      border: 1px solid #000;
      border-radius: 50%;
      animation: all 20s linear infinite;
      img {
        width: 100%;
        border-radius: 50%;
      }
      &.play {
        animation: rotate 20s linear infinite;
      }
      &.pause {
        animation-play-state: paused;
      }
    }
    .song-mini-detail {
      .mini-name {
        height: 1rem;
        margin-bottom: 4px;
        font-size: 16px;
        overflow: hidden;
      }
      .mini-artist {
        height: 0.7rem;
        font-size: 12px;
        overflow: hidden;
      }
    }
  }
  .song-mini-btn {
    i {
      font-size: 30px;
      letter-spacing: 5px;
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
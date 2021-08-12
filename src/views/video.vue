<template>
  <div>
    <div class="video-list" ref="video">
      <ul>
        <li v-for="(item, index) in videoList" :key="index">
          <div class="video-detail">
            <div
              class="video-btn"
              :style="{ 'background-image': 'url(' + item.cover + ')' }"
            >
              <i
                class="iconfont icon-play"
                @click="getVideoId(index, item.id)"
              ></i>
            </div>
            <div
              :class="[
                'video-play',
                { 'video-slideup': slideToggle == true },
                { 'video-slidedown': slideToggle == false },
              ]"
              v-show="playNum == index"
              @click="mvTogglePlay"
            >
              <div class="video-close">
                <i class="iconfont icon-down" @click="closeVideo"></i>
              </div>
              <video
                :src="item.myUrl"
                :ref="'video' + index"
                @loadeddata="loadeddataFun"
              ></video>
              <div class="mv-play" v-show="mvPlay == true">
                <i class="iconfont icon-play1"></i>
              </div>
              <div class="mv-items mv-liked">
                <i
                  :class="[
                    'iconfont',
                    'icon-icon_dianzan_16',
                    item.isLike == true ? 'like' : '',
                  ]"
                  @click.stop="likeToggle(index)"
                ></i>
                <p>{{ item.likedCount }}</p>
              </div>
              <div class="mv-items mv-comment">
                <i class="iconfont icon-pinglun"></i>
                <p>{{ commentCount }}</p>
              </div>
              <div class="mv-items mv-share">
                <i class="iconfont icon-Artboard"></i>
                <p>{{ shareCount }}</p>
              </div>
              <van-slider
                active-color="#ccc"
                bar-height="3px"
                v-model="value"
                @change="sliderChange"
              >
                <template #button>
                  <div class="custom-button"></div>
                </template>
              </van-slider>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  getMvExclusive,
  getMvUrl,
  getMvDetailInfo,
  getResourceLike,
} from "../api/video";

export default {
  data() {
    return {
      videoList: [],
      offset: 0,
      flag: true,
      playNum: null,
      slideToggle: null,
      commentCount: 0,
      shareCount: 0,
      value: 0,
      mvPlay: true,
      mvTimer: null,
      id: null,
      count: 0,
      t: null,
      jkFlag: false,
    };
  },
  methods: {
    getMvExclusiveFun() {
      getMvExclusive({ limit: 5, offset: this.offset }).then((data) => {
        if (data.code == 200) {
          this.videoList = data.data;
        }
      });
    },
    getVideoId(index, id) {
      this.slideToggle = true;
      if (this.playNum || this.playNum == 0) {
        this.$refs["video" + this.playNum][0].pause();
      }
      this.playNum = index;
      getMvUrl({ id }).then((data) => {
        if (data.code == 200) {
          this.$set(this.videoList[index], "myUrl", data.data.url);
          this.id = data.data.id;
          getMvDetailInfo({
            mvid: data.data.id,
          }).then((data) => {
            this.videoList[index].likedCount = data.likedCount;
            this.commentCount = data.commentCount;
            this.shareCount = data.shareCount;
          });
        }
      });
    },
    closeVideo() {
      this.mvPlay = false;
      clearInterval(this.mvTimer);
      this.slideToggle = false;
    },
    loadeddataFun() {
      this.mvTogglePlay();
    },
    addData() {
      if (this.flag) {
        this.flag = false;
        this.offset += 5;
        getMvExclusive({ limit: 5, offset: this.offset }).then((data) => {
          if (data.code == 200) {
            this.videoList = this.videoList.concat(data.data);
            this.flag = true;
          }
        });
      }
    },
    handleScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      let lis = this.$refs.video.querySelectorAll("li");
      let len = lis.length;
      let liHeight = lis[len - 3].offsetTop;
      if (scrollTop > liHeight) {
        this.addData();
      }
    },
    sliderChange() {
      let changeTime =
        (this.$refs["video" + this.playNum][0].duration * this.value) / 100;
      this.timeStart = changeTime;
      this.$refs["video" + this.playNum][0].currentTime = changeTime;
      this.$refs["video" + this.playNum][0].play();
      this.mvPlay = false;
    },
    mvTogglePlay() {
      if (this.mvPlay) {
        this.$refs["video" + this.playNum][0].play();
        clearInterval(this.mvTimer);
        this.mvTimer = setInterval(() => {
          let currentTime = this.$refs["video" + this.playNum][0].currentTime;
          let duration = this.$refs["video" + this.playNum][0].duration;
          //   设置滚动条
          this.value = (currentTime / duration) * 100;
          if (this.value == 100) {
            clearInterval(this.timer);
            this.$refs["video" + this.playNum][0].audio.pause();
            this.mvPlay = true;
          }
        }, 10);
      } else {
        this.$refs["video" + this.playNum][0].pause();
        clearInterval(this.mvTimer);
      }
      this.mvPlay = !this.mvPlay;
    },
    likeToggle(i) {
      this.videoList[i].isLike = !this.videoList[i].isLike;
      let t = false;
      let likedCount = this.videoList[i].likedCount;
      if (this.videoList[i].isLike) {
        this.videoList[i].isLike = true;
        likedCount += 1;
        t = 1;
      } else {
        this.videoList[i].isLike = false;
        likedCount -= 1;
        t = false;
      }
      this.videoList[i].likedCount = likedCount;
      this.t = t;
      this.jkFlag = true;
    },
    getResourceLikeFun() {
      getResourceLike({
        id: this.id,
        type: 1,
        t: this.t,
        cookie: window.localStorage.getItem("cookie"),
      }).then();
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
    if (this.jkFlag == true) {
      this.getResourceLikeFun();
      this.jkFlag = false;
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.getMvExclusiveFun();
    });
  },
};
</script>

<style lang="less">
.video-list {
  ul {
    background-color: #fff;
    li {
      margin-bottom: 1rem;
    }
  }
}
.video-detail {
  position: relative;
  width: 100%;
  height: 11.7rem;
  .video-btn {
    width: 100%;
    height: 11.7rem;
    background-repeat: no-repeat;
    background-size: contain;
    i {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 2rem;
      color: #ccc;
    }
  }
  .video-play {
    display: block;
    position: fixed;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 800;
    background-color: rgb(42, 42, 42);
    .video-close {
      padding: 0.75rem;
      box-sizing: border-box;
      color: #fff;
      i {
        font-size: 20px;
      }
    }
    video {
      display: block;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 100%;
      border-radius: 10px;
      box-shadow: 0 0 15px #000;
    }
    .mv-play {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 3rem;
      height: 3rem;
      i {
        font-size: 60px;
        line-height: 3rem;
        color: rgba(213, 212, 212, 0.5);
      }
    }
    .mv-items {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      right: 10px;
      color: #fff;
      i {
        font-size: 27px;
      }
      p {
        font-size: 12px;
        text-align: center;
      }
    }
    .mv-share {
      bottom: 20px;
    }
    .mv-comment {
      bottom: 65px;
    }
    .mv-liked {
      bottom: 120px;
      .like {
        color: rgb(245, 49, 49);
      }
    }
    .van-slider {
      position: absolute;
      bottom: 8px;
    }
    .custom-button {
      width: 0.5rem;
      height: 0.5rem;
      color: #fff;
      text-align: center;
      background-color: #fff;
      border-radius: 100px;
      box-sizing: border-box;
    }
  }
}

.video-slideup {
  animation: slideup linear 0.2s 1;
  top: 0;
  opacity: 1;
}

@keyframes slideup {
  0% {
    top: 100%;
    opacity: 0;
  }
  100% {
    top: 0;
    opacity: 1;
  }
}

.video-slidedown {
  animation: slidedown linear 0.2s 1;
  top: 100%;
  opacity: 0;
}

@keyframes slidedown {
  0% {
    top: 0;
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}
</style>
<template>
  <div>
    <div class="banner">
      <div class="pics">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(item, index) in banners" :key="index">
            <img :src="item.pic" alt="" />
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
    <div class="detail">
      <div class="title">推荐歌单</div>
      <div class="recommend_lists">
        <ul>
          <li class="list_detail" v-for="item in personalized" :key="item.id">
            <div class="list_title">
              <div class="list_pic">
                <router-link :to="'/recommend/recommendlist?id=' + item.id">
                  <img :src="item.picUrl" alt="" />
                </router-link>
              </div>
              <span class="list_count"
                ><i class="iconfont icon-erji"></i
                >{{ item.playCount | playCountFliter }}</span
              >
            </div>
            <p class="list_exp">{{ item.name }}</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="detail">
      <div class="title">每日推荐</div>
      <div class="swiper-container s-container" dir="rtl">
        <div class="swiper-wrapper">
          <div
            class="swiper-slide s-slider"
            v-for="(item, index) in recommend"
            :key="index"
          >
            <div class="slide-img">
              <router-link :to="'/recommend/recommendlist?id=' + item.id">
                <img :src="item.picUrl" alt="" />
              </router-link>
            </div>
            <div class="slide-bfl">
              <i class="iconfont icon-play"></i>
              <span>{{ item.playcount | playCountFliter }}</span>
            </div>
            <div class="slide-exp">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getBanner,
  getPersonalized,
  getRecommendResource,
} from "../api/recommend";
import Swiper from "swiper";

export default {
  data() {
    return {
      banners: null,
      personalized: null,
      recommend: [],
      cookie: window.localStorage.getItem("cookie"),
    };
  },
  methods: {
    getBannerFun() {
      // 获取轮播图数据
      getBanner().then((data) => {
        if (data.code == 200) {
          this.banners = data.banners;
        }
      });
    },
    getPersonalizedFun() {
      // 获取推荐歌单数据
      getPersonalized().then((data) => {
        if (data.code == 200) {
          this.personalized = data.result;
        }
      });
    },
    getRecommendResourceFun() {
      getRecommendResource({
        cookie: this.cookie,
      }).then((data) => {
        this.recommend = data.recommend;
        this.recommend.reverse();
      });
    },
  },
  created() {
    this.getBannerFun();
    this.getPersonalizedFun();
    this.getRecommendResourceFun();
  },
  mounted() {
    new Swiper(".s-container", {
      freeMode: true,
      slidesPerView: "auto",
      observer: true, //修改swiper自己或子元素时，自动初始化swiper
      observeParents: true,
      roundLengths: true,
      freeModeMomentumBounce: false,
    });
  },
  filters: {
    playCountFliter(v) {
      let w = v > 10000 ? v / 10000 : v;
      let y = w > 10000 ? parseInt(w / 10000) + "亿" : parseInt(w) + "万";
      return y;
    },
  },
};
</script>

<style lang="less">
@width: 100%;
@height: 100%;
body {
  background-color: rgb(233, 233, 233);
}
.banner {
  position: relative;
  .pics {
    width: 96%;
    margin-left: 2%;
    border-radius: 0.5rem;
    .my-swipe {
      height: @height;
      border-radius: 0.5rem;
      img {
        width: @width;
      }
    }
  }
  &::after {
    content: "";
    position: absolute;
    top: -0.5rem;
    left: 0;
    z-index: -1;
    width: @width;
    height: 6rem;
    background: linear-gradient(180deg, #f7746a, #9a2d5a);
  }
}
.detail {
  background-color: #fff;
  border-radius: 10px;
  margin: 10px 0;
  .title {
    height: 2.5rem;
    line-height: 2.5rem;
    padding-left: 10px;
    font-size: 16px;
    text-indent: 5px;
    color: #333;
    font-weight: bold;
  }
  .recommend_lists {
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
      .list_detail {
        width: 30%;
        border-radius: 5px;
        .list_title {
          position: relative;
          .list_pic {
            img {
              width: @width;
              border-radius: 5px;
            }
          }
          .list_count {
            position: absolute;
            top: 0;
            right: 0.2rem;
            color: #fff;
            font-size: 12px;
          }
        }
        .list_exp {
          line-height: 16px;
          margin-bottom: 0.5rem;
          padding-top: 8px;
          font-size: 12px;
          color: #585859;
        }
      }
    }
  }
}
.s-container {
  width: @width;
  padding-bottom: 15px !important;
  box-sizing: border-box;
  .s-slider {
    position: relative;
    width: 6rem !important;
    height: 7.5rem;
    margin: 0 0.25rem;
    .slide-img {
      img {
        width: 100%;
        border-radius: 10px;
      }
    }
    .slide-bfl {
      position: absolute;
      right: 5px;
      top: 5px;
      font-size: 12px;
      color: #fff;
      i {
        margin-right: 3px;
        vertical-align: middle;
      }
    }
    .slide-exp {
      margin-top: 5px;
      font-size: 12px;
      text-align: left;
      color: #585859;
    }
  }
}
</style>
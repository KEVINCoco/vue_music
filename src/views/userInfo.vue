<template>
  <div>
    <div class="person-center">
      <div
        class="center-top"
        :style="{ 'background-image': 'url(' + profile.backgroundUrl + ')' }"
      >
        <div class="person-title">
          <div class="center-return" @click="$router.go(-1)">
            <i class="iconfont icon-return"></i>
          </div>
          <div class="user-name">{{ profile.nickname }}</div>
        </div>
      </div>
    </div>
    <div class="person-info">
      <div class="info-title">
        <div class="info-img">
          <img :src="profile.avatarUrl" alt="" />
        </div>
        <div class="info-basic">
          <ul>
            <li>
              <p class="basic-num">{{ profile.followeds }}</p>
              <p class="basic-tag">粉丝</p>
            </li>
            <li>
              <p class="basic-num">{{ profile.follows }}</p>
              <p class="basic-tag">关注</p>
            </li>
            <li>
              <p class="basic-num">Lv.{{ level }}</p>
              <p class="basic-tag">等级</p>
            </li>
          </ul>
          <button class="edit-info">编辑信息</button>
        </div>
      </div>
      <div class="info-content">
        <div class="info-common">
          <div class="content-title">基本信息</div>
          <ul class="content-list">
            <li>
              <p>
                <span>村龄: </span>
                {{ userDetail.createDays | createYear }}年({{
                  userDetail.createDays | createDate
                }}年{{ userDetail.createDays | createMonth }}月注册)
              </p>
              <p>
                <span>性别: </span>
                {{
                  profile.gender == 0
                    ? "保密"
                    : profile.gender == 1
                    ? "男"
                    : "女"
                }}
              </p>
              <p><span>年龄: </span> 95后 射手座</p>
            </li>
          </ul>
        </div>
        <div class="info-common">
          <div class="content-title">创建的歌单</div>
          <ul class="content-list">
            <li v-for="(item, index) in createlist" :key="index">
              <div class="list-content">
                <router-link :to="'/rank/ranklist?id=' + item.id">
                  <img :src="item.coverImgUrl" alt="" />
                </router-link>
                <div class="list-info">
                  <p class="list-title">{{ item.name }}</p>
                  <p class="list-count">{{ item.trackCount }}首</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="info-common">
          <div class="content-title">
            收藏的歌单<span>({{ subPlaylistCount }})</span>
          </div>
          <ul class="content-list">
            <li v-for="(item, index) in collectlist" :key="index">
              <div class="list-content">
                <router-link :to="'/rank/ranklist?id=' + item.id">
                  <img :src="item.coverImgUrl" alt="" />
                </router-link>
                <div class="list-info">
                  <p class="list-title">{{ item.name }}</p>
                  <p class="list-count">{{ item.trackCount }}首</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getUserDetail,
  getUserSubcount,
  getUserPlaylist,
} from "../api/userInfo";

export default {
  data() {
    return {
      uid: "",
      level: "",
      profile: {},
      userDetail: {},
      cookie: localStorage.getItem("cookie"),
      createdPlaylistCount: 0,
      djRadioCount: 0,
      subPlaylistCount: 0,
      playlist: [],
      createlist: [],
      collectlist: [],
    };
  },
  methods: {
    getUserDetailFun() {
      getUserDetail({ uid: this.uid }).then((data) => {
        this.userDetail = data;
        this.level = data.level;
        this.profile = data.profile;
      });
    },
    getUserSubcountFun() {
      getUserSubcount({
        cookie: this.cookie,
      }).then((data) => {
        this.createdPlaylistCount = data.createdPlaylistCount;
        this.djRadioCount = data.djRadioCount;
        this.subPlaylistCount = data.subPlaylistCount;
      });
    },
    getUserPlaylistFun() {
      getUserPlaylist({
        cookie: this.cookie,
        uid: this.uid,
      }).then((data) => {
        this.playlist = data.playlist;
        this.createlist = this.playlist.filter((item) => {
          return !item.subscribed;
        });
        this.collectlist = this.playlist.filter((item) => {
          return item.subscribed;
        });
      });
    },
  },
  created() {
    this.uid = window.localStorage.getItem("uid");
    this.getUserDetailFun();
    this.getUserSubcountFun();
    this.getUserPlaylistFun();
  },
  filters: {
    createYear(val) {
      return parseInt(val / 365);
    },
    createDate(val) {
      let date = new Date();
      let year = date.getFullYear();
      let cyear = year - parseInt(val / 365);
      return cyear;
    },
    createMonth(val) {
      let date = new Date();
      let month = date.getMonth() + 1;
      let cmonth = month - parseInt((val % 365) / 30);
      return cmonth < 10 ? "0" + cmonth : cmonth;
    },
  },
};
</script>

<style lang="less">
.center-top {
  height: 12rem;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  color: #fff;
  .person-title {
    display: flex;
    align-items: center;
    .center-return {
      padding: 0.5rem;
      box-sizing: border-box;
      i {
        font-size: 20px;
      }
    }
  }
}
.person-info {
  position: absolute;
  top: 7rem;
  width: 100%;
  padding: 5rem 1rem 0 1rem;
  background: linear-gradient(360deg, rgb(243, 243, 243) 99%, transparent);
  box-sizing: border-box;
  .info-title {
    display: flex;
    .info-img {
      width: 4rem;
      height: 4rem;
      margin-right: 20px;
      border-radius: 50%;
      img {
        width: 100%;
        border-radius: 50%;
      }
    }
    .info-basic {
      width: 100%;
      ul {
        display: flex;
        margin-bottom: 10px;
        li {
          flex: 1;
          text-align: center;
          font-size: 15px;
          font-weight: bold;
          border-right: 1px solid #ccc;
          &:nth-of-type(3) {
            border-right: none;
          }
          .basic-tag {
            color: rgb(177, 177, 177);
            font-weight: normal;
          }
        }
      }
      .edit-info {
        width: 100%;
        padding: 3px;
        border-radius: 20px;
        border: 1px solid rgb(177, 177, 177);
        font-size: 14px;
        color: #333;
      }
    }
  }
}
.info-content {
  .info-common {
    margin: 15px 0;
    padding: 20px 15px 5px 15px;
    background-color: #fff;
    border-radius: 10px;
    .content-title {
      margin-bottom: 10px;
      font-size: 18px;
      font-weight: bold;
      span {
        margin-left: 5px;
        font-size: 12px;
        font-weight: normal;
        color: rgb(169, 169, 169);
      }
    }
    .content-list {
      li {
        font-size: 14px;
        p {
          color: #666;
          margin-bottom: 10px;
          span {
            color: rgb(150, 150, 150);
          }
        }
        .list-content {
          display: flex;
          align-items: center;
          img {
            width: 3.5rem;
            height: 3.5rem;
            margin-bottom: 10px;
            margin-right: 10px;
            border-radius: 10px;
          }
          p {
            &:nth-of-type(1) {
              font-size: 15px;
              color: rgb(42, 42, 42);
            }
          }
        }
      }
    }
  }
}
</style>
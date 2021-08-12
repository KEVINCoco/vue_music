<template>
  <div>
    <div class="search-body">
      <div class="search">
        <div class="search-return" @click="$router.go(-1)">
          <i class="iconfont icon-left2-01"></i>
        </div>
        <div class="search-icon">
          <i class="iconfont icon-sousuo"></i>
          <input
            type="text"
            placeholder="搜索歌曲、歌手、专辑"
            v-model="value"
          />
        </div>
      </div>
      <div class="hot-tag" v-show="!flag">
        <p class="hot-title">热门搜索</p>
        <ul class="hot-list">
          <li v-for="(item, index) in hotLists" :key="index" @click="value = item.first">
            <a href="javascript:;">{{ item.first }}</a>
          </li>
        </ul>
      </div>
      <section class="search-item" v-show="flag">
        <p class="search-keyword">
          搜索"<span>{{ value }}</span
          >"
        </p>
        <ul class="keyword-list">
          <li v-for="(item, index) in allMatch" :key="index">
            <i class="iconfont icon-sousuo"></i>
            <div class="search-name">{{ item.keyword }}</div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import { getSearchHot, getSearchSuggest } from "../../api/search";

export default {
  data() {
    return {
      hotLists: [],
      value: "",
      flag: false,
      allMatch: [],
    };
  },
  methods: {
    getSearchHotFun() {
      getSearchHot().then((data) => {
        this.hotLists = data.result.hots;
      });
    },
    getSearchSuggestFun() {
      getSearchSuggest({
        keywords: this.value,
        type: "mobile",
      }).then((data) => {
        this.allMatch = data.result.allMatch;
      });
    },
  },
  created() {
    this.getSearchHotFun();
  },
  watch: {
    value() {
      if (this.value == "") {
        this.flag = false;
      } else {
        this.flag = true;
        this.getSearchSuggestFun();
      }
    },
  },
};
</script>

<style lang="less">
.search-body {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .search {
    display: flex;
    height: 3rem;
    padding: 0.75rem 0.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    .search-return {
      width: 1.5rem;
      height: 1.5rem;
      line-height: 1.5rem;
      text-align: center;
    }
    .search-icon {
      flex: 0 0 90%;
      position: relative;
      i {
        position: absolute;
        top: 5px;
        left: 8px;
        color: #cbcbcc;
      }
      input {
        width: 100%;
        height: 100%;
        line-height: 1.5rem;
        background-color: #ebecec;
        border: none;
        text-indent: 1.5rem;
        border-radius: 1.5rem;
        font-size: 14px;
        color: #333;
      }
    }
  }
  .hot-tag {
    margin-top: 10px;
    padding-left: 10px;
    .hot-title {
      font-size: 12px;
      color: #666;
    }
    .hot-list {
      display: flex;
      flex-wrap: wrap;
      margin-top: 5px;
      li {
        line-height: 1.5rem;
        padding: 0 14px;
        margin: 0 8px 8px 0;
        border: 1px solid #d3d4da;
        border-radius: 60px;
        font-size: 14px;
      }
    }
  }
  .search-item {
    padding-left: 7px;
    font-size: 15px;
    .search-keyword {
      height: 2.5rem;
      line-height: 2.5rem;
      color: #507daf;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
    }
    .keyword-list {
      li {
        display: flex;
        align-items: center;
        height: 2.5rem;
        box-sizing: border-box;
        i {
          margin-right: 7px;
          color: #b1b1b2;
        }
        .search-name {
          width: 100%;
          height: 100%;
          line-height: 2.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          box-sizing: border-box;
          color: #333;
        }
      }
    }
  }
}
</style>
<template>
  <div>
    <div class="song_sheet_title">
      <div class="title_pic">
        <img :src="artist.picUrl" alt="" />
      </div>
      <div class="song_sheet_return" @click="$router.go(-1)">
        <i class="iconfont icon-left2-01"></i>
      </div>
      <div class="song_sheet_title">{{ artist.name }}</div>
    </div>
    <div class="song_sheet_lists">
      <ul>
        <li
          v-for="(item, index) in hotSongs"
          :key="index"
          @click="setId(item.id)"
        >
          <div class="song-index">{{ index + 1 }}</div>
          <div class="song-detail">
            <div class="song-name">{{ item.name }}</div>
            <div class="song-artist">
              {{
                item.ar.length == 2
                  ? item.ar[0].name + " / " + item.ar[1].name
                  : item.ar[0].name
              }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getArtists } from "../../api/single";

export default {
  data() {
    return {
      artist: {},
      cookie: localStorage.getItem("cookie"),
      hotSongs:[]
    };
  },
  methods: {
    setId(id) {
      this.$emit("get-play-id", id);
    },
    getArtistsFun() {
      getArtists({ id: this.$route.query.id, cookie: this.cookie }).then(
        (data) => {
          this.artist = data.artist;
          this.hotSongs = data.hotSongs;
        }
      );
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getArtistsFun();
    });
  },
};
</script>

<style lang="less">
.song_sheet_title {
  position: relative;
  .title_pic {
    img {
      width: 100%;
      height: 15rem;
    }
  }
  .song_sheet_return {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.6rem;
    color: #fff;
    font-size: 14px;
    i {
      padding-right: 0.5rem;
    }
  }
  .song_sheet_title {
    position: absolute;
    bottom: 2rem;
    left: 0;
    padding: 0.6rem;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
  }
  .listener_num {
    font-weight: normal;
    i {
      margin-right: 3px;
      vertical-align: top;
    }
    span {
      font-size: 14px;
    }
  }
}
.song_sheet_lists {
  position: relative;
  top: -2rem;
  background-color: #fff;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  .play_all {
    display: flex;
    align-items: center;
    height: 1.85rem;
    border-bottom: 2px solid #e5e5e5;
    box-sizing: border-box;
    i {
      margin: 0 0.7rem;
      font-size: 1rem;
    }
    .play-text {
      font-size: 15px;
    }
    .songs-num {
      font-size: 12px;
      color: #777878;
    }
  }
  ul {
    li {
      display: flex;
      align-items: center;
      height: 2.75rem;
      padding: 0.6rem 1rem;
      border-bottom: 1px solid #e5e5e5;
      box-sizing: border-box;
      .song-index {
        margin-right: 1rem;
        font-size: 14px;
      }
      .song-name {
        height: 1rem;
        font-size: 16px;
        overflow: hidden;
      }
      .song-artist {
        font-size: 13px;
        color: #5c5e5c;
      }
    }
  }
}
</style>
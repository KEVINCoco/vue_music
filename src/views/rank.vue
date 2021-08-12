<template>
  <div>
    <div class="rank_lists">
      <ul>
        <li class="rank_detail" v-for="item in lists" :key="item.id">
          <div class="rank_img">
            <router-link :to="'/rank/ranklist?id='+item.id">
              <img class="cover_img" :src="item.coverImgUrl" alt="" />
            </router-link>
          </div>
          <div class="rank_single_name">
            <p v-for="(key, i) in item.tracks" v-show="i < 3" :key="key.id">
              {{ i + 1 }}.{{ key.name }}-{{
                key.ar.length == 1
                  ? key.ar[0].name
                  : key.ar[0].name + "/" + key.ar[1].name
              }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getTopList, getPlaylistDetail } from "../api/rank";
export default {
  data() {
    return {
      lists: [],
    };
  },
  methods: {
    getPlaylistDetailFun(params) {
      getPlaylistDetail(params).then((data) => {
        this.lists.push(data.playlist);
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      getTopList().then((data) => {
        for (let i = 0; i < data.list.length; i++) {
          vm.getPlaylistDetailFun({
            id: data.list[i].id,
          });
        }
      });
    });
  },
};
</script>

<style lang="less">
.rank_lists {
  background-color: #fff;
  ul {
    width: 96%;
    margin-top: 0.3rem;
    transform: translateX(2%);
    .rank_detail {
      display: flex;
      width: 100%;
      height: 4.9rem;
      border-bottom: 2px solid #e4e5e6;
      .rank_img {
        flex: 0 0 4.5rem;
        height: 4.5rem;
        margin-top: 0.2rem;
        background-color: #fff;
        .cover_img {
          width: 100%;
        }
      }
      .rank_single_name {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        margin-left: 1rem;
        font-size: 12px;
        p {
          height: 1rem;
          line-height: 1rem;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
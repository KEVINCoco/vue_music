<template>
  <div>
    <van-loading v-if="!flag" type="spinner" color="#d4473c" />
    <b-scroll
      v-if="flag"
      :top="'93px'"
      :right="hotArtists"
      :left="leftList"
    ></b-scroll>
  </div>
</template>

<script>
import { getTopArtist, getArtistLists } from "../api/single";
import BScroll from "../components/base/BScroll.vue";
export default {
  data() {
    return {
      leftList: [
        "热",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
      ],
      hotArtists: [],
      flag: false,
    };
  },
  components: {
    BScroll,
  },
  methods: {
    getTopArtistFun() {
      getTopArtist().then((data) => {
        this.hotArtists.unshift({
          name: "热",
          data: data.artists,
        });
      });
    },
    getArtistListsFun() {
      let num = 1;
      for (let i = 1; i < this.leftList.length; i++) {
        getArtistLists({
          type: -1,
          area: -1,
          initial: this.leftList[i],
          limit: 10,
        }).then((data) => {
          let index = this.hotArtists.findIndex(item => item.name == this.leftList[i]);
          // $set修改data数据，并更新视图
          this.$set(this.hotArtists[index],"data",data.artists);
          num++;
          if (num == this.leftList.length) {
            this.flag = true;
          }
        });
      }
    },
    artistLists() {
      for (let i = 1; i < this.leftList.length; i++) {
        this.hotArtists.push({
          name: this.leftList[i]
        });
      }
    }
  },
  created() {
    this.artistLists();
    this.getTopArtistFun();
    this.getArtistListsFun();
  },
};
</script>

<style lang="less">
.van-loading {
  margin-top: 2.5rem;
  text-align: center;
}
</style>
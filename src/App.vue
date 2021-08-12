<template>
  <div id="app">
    <div class="main">
      <header-nav v-if="$route.meta.headerNav"></header-nav>
      <router-view @get-play-id="getPlayId" @get-play-all-id="getPlayAllId"></router-view>
      <player @get-play-id="getPlayId" v-show="playerId || songsId" :player-id="playerId" :songs-id="songsId"></player>
    </div>
  </div>
</template>

<script>
import headerNav from "./components/base/headerNav.vue";
import player from './components/base/player.vue';

export default {
  data(){
    return{
      playerId:null,
      songsId:null,
    }
  },
  components: {
    headerNav,
    player,
  },
  methods:{
    getPlayId(id){
      this.playerId = id;
    },
    getPlayAllId(id){
      this.songsId = id;
    },
  }
};
</script>

<style lang="less">
@import "./assets/css/base.css";
</style>
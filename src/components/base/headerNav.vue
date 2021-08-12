<template>
  <div>
    <header class="header">
      <div class="top">
        <div class="icon_ml" @click="$router.push('/userInfo')">
          <i class="iconfont icon-mulu"></i>
        </div>
        <div class="title">
          <span>MUSIC</span>
        </div>
        <router-link to="/search/search" class="icon_ss" tag="div">
          <i class="iconfont icon-sousuo"></i>
        </router-link>
      </div>
      <div class="nav">
        <router-link to="/recommend" class="item"
          ><span>推荐歌单</span></router-link
        >
        <router-link to="/rank" class="item"><span>排行榜</span></router-link>
        <router-link to="/single" class="item"><span>歌手</span></router-link>
        <router-link to="/video" class="item"><span>MV</span></router-link>
      </div>
    </header>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less">
@width: 100%;
.header {
  position: relative;
  width: @width;
  height: 4.65rem;
  background: linear-gradient(180deg, #d4473c, #f7746a);
  .top,
  .nav {
    display: flex;
    width: @width;
    height: 2rem;
  }
  .top {
    justify-content: space-between;
    line-height: 2rem;
    color: #fff;
    .icon_ml,
    .icon_ss {
      flex: 0 0 2rem;
      height: 2rem;
      text-align: center;
      font-weight: bold;
    }
  }
  .nav {
    justify-content: space-evenly;
    align-items: center;
    .item {
      font-size: 15px;
      color: #fff;
      span {
        display: block;
        height: 1rem;
        line-height: 1rem;
        border-bottom: 1px solid transparent;
      }
      &.router-link-active span {
        border-bottom: 1px solid #fff;
      }
    }
  }
}
</style>
<template>
  <div>
    <div class="content" :style="{ top: top, bottom: bottom }">
      <div class="left" ref="left">
        <!-- 必须获取ul滚动区域，上一个父元素对象 ref="left" -->
        <ul>
          <!-- class="current" -->
          <li
            :class="{ current: currentIndex == index }"
            v-for="(item, index) in left"
            :key="index"
            @click="selectItem(index)"
          >
            <span class="left-item">{{ item }}</span>
          </li>
        </ul>
      </div>
      <div class="right" ref="right">
        <ul>
          <li v-for="(item, index) in right" :key="index" class="right_item">
            <h2>{{ item.name }}</h2>
            <div class="lists">
              <div class="bscroll_detail" v-for="(k, i) in item.data" :key="i">
                <router-link :to="'/single/singlelist?id=' + k.id">
                  <img :src="k.picUrl" alt="" />
                </router-link>
                <p>{{ k.name }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// 按需加载
import BScroll from "@better-scroll/core";

export default {
  data() {
    return {
      listsHeight: [], //存储高度
      // currentIndex:0
      scrollY: "", //右侧滚动条高度  实时数据
    };
  },
  //   props:["left","right","top","bottom"],
  props: {
    left: {
      default: function () {
        return ["热", "A", "B", "C", "D", "E", "F", "G", "H"];
      },
    },
    right: {
      default: function () {
        return [
          {
            name: "内容1",
            content: ["Adele", 2, 3, 4, 5, 6],
          },
          {
            name: "内容2",
            content: [1, 2, 3, 4, 5, 6],
          },
          {
            name: "内容3",
            content: [1, 2, 3, 4, 5, 6],
          },
        ];
      },
    },
    top: {
      default: "50px",
    },
    bottom: {
      default: "0px",
    },
  },
  methods: {
    // 滚动效果初始化方法
    _initScroll() {
      // 左侧滚动效果初始化
      this.lefts = new BScroll(this.$refs.left, {
        click: true, //点击触发
        probeType: 3, //深针的效果，时时获取滚动高度
      });

      // 右侧滚动效果初始化
      this.rights = new BScroll(this.$refs.right, {
        click: true,
        probeType: 3, //深针的效果，时时获取滚动高度
      });

      // 获取滚动高度
      this.rights.on("scroll", (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y)); //当前滚动条高度
      });
    },
    // 获取右侧每一个li高度
    _getHegiht() {
      let rightItems = this.$refs.right.getElementsByClassName("right_item");
      let height = 0;
      this.listsHeight.push(height);
      for (let i = 0; i < rightItems.length; i++) {
        let item = rightItems[i];
        height += item.clientHeight; //获取高
        this.listsHeight.push(height);
      }
    },
    // 左侧点击效果
    selectItem(index) {
      // 获取右侧所有对象
      let rightItems = this.$refs.right.getElementsByClassName("right_item");
      let el = rightItems[index]; //左侧点击位置，对应右侧滚动对象
      // 插件内置方法scrollToElement(对象,滚动速度)
      this.rights.scrollToElement(el, 300);
      // this.currentIndex = index;
    },
  },
  // 页面挂载后生命周期函数
  // 引入第三方js库
  // vue页面加载慢，第三方js库提前加载问题?
  // vm.$nextTick() 方法 保证vue执行完，页面挂载数据后，再执行第三方库
  mounted() {
    this.$nextTick(() => {
      this._initScroll();
      this._getHegiht();
    });
  },
  // 计算属性
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listsHeight.length; i++) {
        let height = this.listsHeight[i];
        let height2 = this.listsHeight[i + 1];

        if (!height2 || (this.scrollY >= height && this.scrollY < height2)) {
          // 控制左侧li位置
          let leftItems = this.$refs.left.getElementsByTagName("li");
          this.lefts.scrollToElement(leftItems[i], 200);
          return i;
        }
      }

      return 0;
    },
  },
};
</script>

<style lang="less" scoped>
ul {
  list-style: none;
}
.content {
  width: 100%;
  position: absolute;
  display: flex;
  overflow: hidden;
}
.content .left {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 1000;
  width: 1rem;
  height: 9rem;
}
.content .left li {
  width: 100%;
  height: 1rem;
  text-align: center;
}
.content .left li.current span {
  color: #ca0500;
}
.content .left li span {
  display: block;
  width: 100%;
  height: 100%;
  line-height: 1rem;
  font-size: 14px;
  color: #5a5a5c;
}
.content .right {
  flex: 1;
  background-color: #fff;
}
.content .right h2 {
  height: 0.95rem;
  line-height: 0.95rem;
  background-color: #dadbdc;
  font-size: 12px;
  text-indent: 0.75rem;
}
.content .right .lists {
  display: flex;
  flex-direction: column;
  width: 96%;
  transform: translateX(2%);
}
.content .right .lists .bscroll_detail {
  display: flex;
  height: 3.3rem;
  line-height: 3.3rem;
  border-bottom: 1px solid #e3e3e3;
  font-size: 15px;
  box-sizing: border-box;
  img {
    display: inline-block;
    width: 2.25rem;
    height: 2.25rem;
    margin-top: 0.525rem;
  }
  p {
    margin-left: 0.8rem;
  }
}
</style>
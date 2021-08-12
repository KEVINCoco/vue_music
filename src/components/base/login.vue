<template>
  <div>
    <div class="login-bg">
      <div class="login-logo">
        <i class="iconfont icon-wangyiyunyinle1"></i>
      </div>
      <div class="login-form">
        <div class="item">
          <input type="text" placeholder="请输入手机号码" v-model="phone" />
        </div>
        <div class="item">
          <input type="text" placeholder="请输入密码" v-model="password" />
        </div>
        <div class="item">
          <button class="user-login" @click="submit">登录</button>
           <!-- @click="submit" -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Notify } from "vant";
import { getLoginCellphone } from "../../api/login"

export default {
  data() {
    return {
      phone: "",
      password:""
    };
  },
  methods: {
    submit(){
      let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      if(!reg.test(this.phone)){
        Notify({type:"warning",message:"请输入正确的号码"});
      }
      getLoginCellphone({
        phone: this.phone,
        password: this.password
      }).then(data=>{
        if(data.code == 200){
          Notify({type:"success",message:"登录成功"});
          window.localStorage.setItem("token",data.token);
          window.localStorage.setItem("uid",data.account.id);
          window.localStorage.setItem("cookie",data.cookie);
          this.$router.push("/");
        }else{
          Notify({type:"danger",message:"登录失败"});
          this.$router.push("/login");
        }
      })
    }
  },
};
</script>

<style lang="less">
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #f1060e, #fff);
  .login-logo {
    position: relative;
    top: 25%;
    left: 50%;
    transform: translateX(-50%);
    width: 4rem;
    height: 4rem;
    line-height: 4rem;
    background-color: #e61920;
    border-radius: 50%;
    text-align: center;
    color: #fff;
    animation: tiaodong linear 2s 1;
    i {
      font-size: 60px;
    }
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      content: "";
      display: block;
      width: 4rem;
      height: 4rem;
      border: 2px solid rgba(247, 246, 246, 0.1);
      border-radius: 50%;
      box-sizing: border-box;
      animation: bowen linear 2s infinite;
    }
    &::after {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      content: "";
      display: block;
      width: 4rem;
      height: 4rem;
      border: 2px solid rgba(247, 246, 246, 0.1);
      border-radius: 50%;
      box-sizing: border-box;
      animation: bowen linear 3s infinite;
    }
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 12rem;
  padding: 0 3rem;
  box-sizing: border-box;
  .item {
    position: relative;
    width: 100%;
    height: 2rem;
    .user-login,
    input {
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 1rem;
      text-indent: 0.75rem;
      font-size: 15px;
      color: #333;
    }
    .user-login {
      background-color: #fff;
      font-weight: bold;
      color: #f1060e;
    }
  }
}

@keyframes bowen {
  0% {
    transform: none;
  }

  100% {
    transform: scale(2, 2);
  }
}

@keyframes tiaodong {
  0% {
    top: -4rem;
  }
  50% {
    top: 35%;
  }
  65% {
    top: 15%;
  }
  85% {
    top: 35%;
  }
  100% {
    top: 25%;
  }
}
</style>
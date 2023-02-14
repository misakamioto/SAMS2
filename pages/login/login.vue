<template>
  <view class="box">
    <!-- 警告框 -->
    <uni-popup ref="message" type="message">
    	<uni-popup-message type="error" :message="err" :duration="2000"></uni-popup-message>
    </uni-popup>
    <view class="title">
      <h1>学生成绩管理系统</h1>
    </view>
    <input type="text" placeholder="用户名" focus v-model="user">
    <view class="password">
      <input :type="chPaIc" placeholder="密码" v-model="password">
      <uni-icons :type="icon" class="icon" size="24" @click="changeIcon"></uni-icons>
    </view>
    <radio-group class="radio" @change="changeRadio">
      <label>
        <radio value="0" checked/><text>学生</text>
      </label>
      <label>
        <radio value="1" /><text>教师</text>
      </label><label>
        <radio value="2" /><text>管理员</text>
      </label>
    </radio-group>
    <button @click="login" :loading="loading" :disabled="disabled">登录</button>
    <text @click.prevent ="forget" :style="{color:txtstyle}">{{txt}}</text>
  </view>
</template>

<script>
import { onMounted, ref } from "vue"
import store from "../../store/store"

  export default{
    setup() {
      let user = ref("")
      let password = ref("")
      let radio = "0"
      let txt = ref("忘记密码？")
      let message = ref(null)
      let icon = ref("eye-slash")
      let chPaIc = ref("password")
      let txtstyle = ref("#000000")
      let err = ref("用户名或密码错误")
      let loading = ref(false)
      let disabled = ref(false)
      let chart = ""
      // 权限选择
      function changeRadio(e){
        radio = e.detail.value
      }
      async function request(data){
        try{
          let res = await uni.request({
            url:"http://localhost:3000/login",
            method:'GET',
            data:{...data}
          })
          if(typeof(res.data) === "string"){
            loading.value = false
            disabled.value = false
            err.value = res.data
            message.value.open()
          }
          else if(res.data.length === 0) {
            loading.value = false
            disabled.value = false
            err.value = "用户名或密码错误！"
            message.value.open()
          }
          else{
            loading.value = false
            disabled.value = false
            store.commit('updatePerInfo',res.data[0])
            store.commit("updateJurisdiction",chart)
            uni.redirectTo({
              url:"/pages/home/home"
            })
          }
        } catch(err){
          loading.value = false
          disabled.value = false
          err.value = err
          message.value.open()
        }
      }
      // 点击登录
      function login(){
        loading.value = true
        disabled.value = true
        if(user.value === "" || password.value === ""){
          loading.value = false
          disabled.value = false
          message.value.open()
        }
        else{
          loading.value = true
          disabled.value = true
          // 发送请求
          if(radio === "0") chart = "student"
          else if(radio === "1") chart = "teacher"
          else chart = "admin"
          request({user:user.value,password:password.value,chart})
        }
      }
      // 查看密码
      function changeIcon(){
        if(icon.value === "eye-slash"){
          icon.value = "eye"
          chPaIc.value = "text"
        }
        else{
          icon.value = "eye-slash"
          chPaIc.value = "password"
        }
      }
      // 忘记密码
      let time = null
      function forget(){
        txt.value = "请联系系统管理员重置密码"
        txtstyle.value = "red"
        clearTimeout(time)
        time = setTimeout(()=>{
          txt.value = "忘记密码？"
          txtstyle.value = "black"
        },2000)
      }
      return{
        user,
        password,
        radio,
        changeRadio,
        login,
        message,
        txt,
        forget,
        icon,
        changeIcon,
        chPaIc,
        txtstyle,
        err,
        loading,
        disabled
      }
    }
  }
</script>

<style lang="scss" scoped>
  body{
    background: linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%);
  }
  .box{
    .err{
      color: red;
    }
    width: 30vw;
    height: 80vh;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: rgba(255, 255, 255,0.8);  
    border-radius: 10px;
    -webkit-box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0,0,0,0); 
    box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0,0,0,0);
    display: flex;
    justify-items: center;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    .title{
      width: 80%;
      padding: 20% 10%;
      text-align: center;
    }
    input{
      width: 80%;
      border-bottom: 1px solid rgb(128,128, 128);
      margin-top: 5%;
    }
    .password{
      width: 80%;
      input{
        position: relative;
        width: 100%;
      }
      .icon{
        float: right;
        transform: translateY(-150%);
        z-index: 5;
      }
    }
    .radio{
      margin-top: 3%;
      width: 80%;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    button{
      margin-top: 5%;
      width: 80%;
      background: linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%);
    }
    text{
      cursor: pointer;
      margin-top: 3%;
      // color: #000000;
    }
  }
</style>
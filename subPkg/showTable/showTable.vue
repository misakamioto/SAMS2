<template>
  <view class="show">
    <view class="insert" :style="{display:display}">
      <view class="insertVal">
        <input type="text" :placeholder="insertVal" v-model="insertUsername">
        <input type="text" :placeholder="insertInput" v-model="insertPassword">
        <view class="insertBtn">
          <button style="background-color: aqua;" @click="insert('insert')">确定</button>
          <button style="background-color: rgb(229, 99, 99);" @click="insert('back')">返回</button>
        </view>
      </view>
      
    </view>
    <uni-popup ref="message" type="message">
    	<uni-popup-message :type="error" :message="err" :duration="2000"></uni-popup-message>
    </uni-popup>
    <view class="search">
      <input type="text" :placeholder="placeholder" v-model="username">
      <button  plain @click="select('my')" :disabled="disabled">确定</button>
      <button style="background-color: aqua;" @click="select('all')" :disabled="disabled">查询所有</button>
      <uni-data-select v-model="sortVal" placeholder="排序关键字" class="dataSelect"
      emptyText="暂无更多数据" :localdata="sortData" @change="sortValChange" ></uni-data-select>
      <button style="background-color: aqua;" :disabled="disabled" @click="sort('asc')">升序</button>
      <button style="background-color: aqua;" :disabled="disabled" @click="sort('desc')">降序</button>
      <button style="background-color: aqua;"  @click="insert('add')" 
      :style="{display:displayBtn}" :disabled="disabled">添加</button>
    </view>
    <view class="table">
      <uni-table stripe emptyText="暂无更多数据"  :loading="loading">
        <uni-tr>
          <uni-th align="center" v-for="(value,key,index) in tableData[0]" key="index" >{{key}}</uni-th>
          <uni-th align="center" v-if="showTd">操作</uni-th>
        </uni-tr>
        <uni-tr v-for="(item,index2) in tableData">
          <uni-td v-for="(value2,key2,index3) in item" align="center">
            <text :style="{display: (((index2 === rowIndex) && (index3 >= collapseIndex && index3 !== collapseIndex2)) ? 'none':'block')}">{{value2}}</text>
            <input class="update" type="text" :style="{display: (((index2 === rowIndex) && (index3 >= collapseIndex && index3 !== collapseIndex2)) ? 'block':'none')}" v-model="updateVal[index3]">
          </uni-td>
          <uni-td align="center" style="display: flex;justify-content: space-around;" v-if="showTd">
            <button style="background-color: aqua;border:1px solid #ccc" size="mini" 
            @click="update(index2,item)" :disabled="disabled">编辑</button>
            <button style="background-color: aqua;border:1px solid #ccc" size="mini"
            :style="{display: (index2 === rowIndex ? 'block':'none')}"
            @click="updateConfirm(item)" :disabled="disabled">确定</button>
            <button style="background-color: rgb(229, 99, 99);border:1px solid #ccc" size="mini" 
            @click="del(item)" :disabled="disabled" v-show="collapse !== 'result'">删除</button>
          </uni-td>
        </uni-tr>
      </uni-table>
    </view>
  </view>
</template>

<script>
import { nextTick, onMounted, onUpdated, reactive, ref, watch } from "vue"
import store from "../../store/store"
  export default {
    setup() {
      let username = ref("")
      let disabled = ref(false)
      let err = ref("")
      let message = ref(null)
      let tableData = ref([])
      let placeholder = ref("学工号")
      let loading = ref(false)
      let sortVal = ref("")
      let sortData = ref([])
      let display = ref("none")
      let displayBtn = ref("block")
      let insertUsername = ref("")
      let insertPassword =  ref("")
      let insertVal = ref("姓名")
      let insertInput = ref("密码(默认123456)")
      let error = ref("error")
      let collapse = ref("")
      // 不变的列
      let collapseIndex = ref(10000)
      let collapseIndex2 = ref(10000)
      // 改变的行
      let rowIndex = ref(10000)
      let updateVal = ref([])
      // 控制查询成绩列表隐藏操作
      let showTd = ref(false)
      watch(()=>store.state.tableData,(newVal,oldVal)=>{
        tableData.value = newVal
        if((store.state.collapse === "result" && store.state.collapseItem === 0) || store.state.collapseItem === "" || tableData.value.length === 0) {
          showTd.value = false
        }
        else showTd.value = true
      })
      watch(()=>store.state.username,(newVal,oldVal)=>{
        username.value = newVal
      })
      watch(()=>store.state.collapse,(newVal,oldVal)=>{
        if(newVal === "course") placeholder.value = "课程编号"
        else placeholder.value = "学工号"
        sortData.value = []
        sortVal.value = ""
        collapse.value = newVal
      })
      watch(()=>store.state.collapseItem,(newVal,oldVal)=>{
        updateVal.value = []
        sortData.value = []
        collapseIndex.value = 10000
        collapseIndex2.value = 10000
        rowIndex.value = 10000
        sortVal.value = ""
        // 权限允许请求的范围
        if(store.state.jurisdiction === "student"){
          if((store.state.collapse === "result" && newVal === 0) || newVal === "") {
            disabled.value = false
            loading.value = false
          }
          else{
            disabled.value = true
            loading.value = false
            err.value = "缺少相关权限，请联系管理员增加相应权限！"
            message.value.open()
            error.value = "error"
          }
        }
        else if(store.state.jurisdiction === "teacher"){
          if(store.state.collapse === "result" || store.state.collapse === "student"){
            disabled.value = false
            loading.value = false
          }
          else{
            disabled.value = true
            loading.value = false
            err.value = "缺少相关权限，请联系管理员增加相应权限！"
            message.value.open()
            error.value = "error"
          }
        }
        else disabled.value =false
        // 控制添加按钮的显示
        if(store.state.collapse === "result" || newVal === "") displayBtn.value = "none"
        else displayBtn.value = "block"
      })
      // 设置排序
      function setData(){
        let a = Object.keys(JSON.parse(JSON.stringify(store.state.tableData[0])))
        for(let i = 0;i < a.length;i++) sortData.value.push({text:a[i],value:a[i],disabled:false})
      }
      function sortValChange(data){
        sortVal.value = data
      }
      // 排序
      function sort(type){
        disabled.value = true
        loading.value = true
        if(sortVal.value === ""){
          err.value = "请选择排序关键字"
          message.value.open()
          error.value = "error"
          disabled.value = false
          loading.value = false
        }
        else selectResult({username:"*",chart:store.state.collapse,order:[sortVal.value,type]})
      }
      // 添加信息
      function insert(type){
        if(type === "back"){
          display.value = "none"
          insertUsername.value = ""
          insertPassword.value = ""
          return
        }
        if(type === "add"){
          display.value = "block"
          err.value = "添加过程中请勿切换板块！！！"
          error.value = "error"
          message.value.open()
          if(store.state.collapse === "course"){
            insertInput.value = "课程id"
            insertVal.value = "课程名"
          }
          else{
            insertInput.value = "密码(默认123456)"
            insertVal.value = "姓名"
          }
          return
        }
        if(store.state.collapse === "course"){
          if(insertUsername.value === "" || insertPassword.value === ""){
            err.value = "请输入课程名和课程编号"
            message.value.open()
          }
          else add({username:insertUsername.value,password:insertPassword.value,chart:store.state.collapse})
        }else{
          let a = ""
          if(insertUsername.value === ""){
            err.value = `请输入${insertVal.value}`
            message.value.open()
          }
          else if(insertPassword.value === "") a = "123456"
          else a = insertPassword.value
          add({username:insertUsername.value,password:a,chart:store.state.collapse})
        }
      }
      // 删除信息
      function del(data){
        if(store.state.collapse === "course") deleteData({username:data.课程编号,chart:store.state.collapse})
        else deleteData({username:data.学工号,chart:store.state.collapse})
      }
      // 更新信息
      function update(index,data){
        rowIndex.value = index
        if(store.state.collapse === "result"){
            collapseIndex.value = 2
            let key = Object.keys(data)
            collapseIndex2.value = key.indexOf('总分')
          } 
        else{
          collapseIndex.value = 1
          collapseIndex2.value = 10000
        }
      }
      // 点击更新确定按钮
      function updateConfirm(data){
        disabled.value = true
        let key = Object.keys(data)
        let username = Object.values(data)[0]
        let value = Object.values(updateVal.value)
        let index = Object.keys(updateVal.value)
        let obj = [] 
        if(store.state.collapse === "result"){
          for(let i = 0,j = Number(index[0]);i < value.length;i++){
            obj.push({[key[j]]:Number(value[i])})
            j++
          }
        }
        else{
          for(let i = 0,j = Number(index[0]);i < value.length;i++){
            obj.push({[key[j]]:value[i]})
            j++
          }
        }
        UPDATE({data:JSON.stringify(obj),chart:store.state.collapse,username}) 
      }
      // 查询
      async function selectResult(data){
        try{
          sortData.value = []
          tableData.value = []
          let res = await uni.request({
            url: 'http://localhost:3000/select',
            method: 'GET',
            data: {...data}
          });
          disabled.value = false
          loading.value = false
          if(typeof(res.data) === "string"){
            err.value = res.data
            message.value.open()
            error.value = "error"
          }
          else if(res.data.length === 0){
            err.value = "搜索内容不存在"
            message.value.open()
            error.value = "error"
          }
          else {
            store.commit("updataTable",res.data)
            setData()
          }
        }catch(err){
          disabled.value = false
          loading.value = false
          err.value = err
          message.value.open()
          error.value = "error"
        }
      }
      // 添加请求
      async function add(data){
        disabled.value = true
        try{
          let res = await uni.request({
            url:"http://localhost:3000/insert",
            method:"GET",
            data:{...data}
          })
          disabled.value = false
          if(typeof(res.data) === "string"){
            err.value = res.data
            message.value.open()
            error.value = "error"
          }
          else{
            insertUsername.value = ""
            insertPassword.value = ""
            err.value = "数据添加成功"
            message.value.open()
            error.value = "success"
            selectResult({username:"*",chart:store.state.collapse,order:[]})
          }
        }catch(err){
          err.value = err
          message.value.open()
          error.value = "error"
          disabled.value = false
        }
      }
      // 删除请求
      async function deleteData(data){
        disabled.value = true
        try{
          let res = await uni.request({
            url:"http://localhost:3000/delete",
            method:"GET",
            data:{...data}
          })
          disabled.value = false
          if(typeof(res.data) === "string"){
            err.value = res.data
            message.value.open()
            error.value = "error"
          }
          else{
            insertUsername.value = ""
            insertPassword.value = ""
            err.value = "数据删除成功"
            message.value.open()
            error.value = "success"
            selectResult({username:"*",chart:store.state.collapse,order:[]})
          }
        }catch(err){
          disabled.value = false
          err.value = err
          message.value.open()
          error.value = 'error'
        }
      }
      // 更新请求
      async function UPDATE(data){
        try{
          let res = await uni.request({
            url:"http://localhost:3000/update",
            method:"GET",
            data:{...data}
          })
          disabled.value = false
          if(typeof(res.data) === "string"){
            err.value = res.data
            message.value.open()
            error.value = "error"
          }
          else{
            insertUsername.value = ""
            insertPassword.value = ""
            err.value = "数据更新成功"
            message.value.open()
            error.value = "success"
            collapseIndex.value = 10000
            collapseIndex2.value = 10000
            rowIndex.value = 10000
            updateVal.value = []
            selectResult({username:"*",chart:store.state.collapse,order:[]})
          }
        }catch(err){
          err.value = err
          error.value = "error"
          message.value.open()
          collapseIndex.value = 10000
          collapseIndex2.value = 10000
          rowIndex.value = 10000
          updateVal.value = []
        }
      }
      // 点击按钮发送请求
      function select(type){
        disabled.value = true
        loading.value = true
        store.commit("updataUsername",username.value)
        if(store.state.collapseItem === ""){
          err.value = "请在左侧面板选择具体事项以供查询"
          message.value.open()
          error.value = "error"
          disabled.value =false
          loading.value =false
        }
        else{
          if(type === "my") selectResult({username:username.value,chart:store.state.collapse,order:[]})
          else selectResult({username:"*",chart:store.state.collapse,order:[]})
        }
      }
      return {
        tableData,
        select,
        username,
        err,
        message,
        disabled,
        placeholder,
        loading,
        sort,
        sortVal,
        sortData,
        sortValChange,
        display,
        insert,
        displayBtn,
        insertPassword,
        insertUsername,
        insertInput,
        insertVal,
        error,
        update,
        del,
        collapse,
        collapseIndex,
        collapseIndex2,
        rowIndex,
        updateConfirm,
        updateVal,
        showTd
      }
    }
  }
</script>

<style lang="scss" scoped>
  html{
    font-size: 16px;
  }
  .insert{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 666;
    background-color: rgba(0,0,0,.8);
    .insertVal{
      width: 30vw;
      height: 25vh;
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-direction: column;
      background-color: rgb(255, 255, 255);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      .insertBtn{
        width: 20vw;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
      input {
        width: 20vw;
        height: 4vh;
        border: 1px solid rgba(0, 0, 0, 0.41);
        border-radius: 5px;
        padding: 5px;
        box-sizing: border-box;
      }
      
      button {
        width: 8vw;
        height: 4vh;
        border: 1px solid rgba(0, 0, 0, 0.41);
        text-align: center;
        line-height: 4vh;
        font-size: 0.1rem;
      }
    }
  }
  .show {
    padding: 10px;
    position: absolute;
    top: 50%;
    box-sizing: border-box;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 95%;
    height: 95%;
    background-color: white;
    z-index: 55;
    box-shadow: 1px 3px 19px 4px rgba(0, 0, 0, 0.41);

    .search {
      display: flex;
      height: 4vh;
      width: 50vw;
      position: relative;
      left: 50%;
      top: 30px;
      transform: translate(-50%, -20px);
      z-index: 333;
      .dataSelect{
        margin-left: 10px;
      }
      input {
        width: 20vw;
        height: 4vh;
        border: 1px solid rgba(0, 0, 0, 0.41);
        border-radius: 5px;
        padding: 5px;
        box-sizing: border-box;
      }

      button {
        margin-left: 10px;
        height: 4vh;
        border: 1px solid rgba(0, 0, 0, 0.41);
        text-align: center;
        line-height: 4vh;
        font-size: 0.1rem;
      }
    }

    .table {
      margin-top: 30px;
    }
  }
  .update{
    width: 80%;
    height: 4vh;
    border: 1px solid aqua;
    box-sizing: border-box;
    padding: 5px;
    text-align: center;
    border-radius: 5px;
    font-size: 14px;
  }
</style>

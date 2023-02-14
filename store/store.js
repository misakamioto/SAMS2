import { createStore } from 'vuex'
export default createStore({
  actions:{},
  mutations:{
    updatePerInfo(state,data){
      state.perInfo = data
      uni.setStorageSync("perInfo",JSON.stringify(data))
    },
    updateJurisdiction(state,data){
      state.jurisdiction = data
      uni.setStorageSync("jurisdiction",JSON.stringify(data))
    },
    
    showTable(state,data){
      state.table = data
    },
    
    updataTable(state,data){
      state.tableData = data
    },
    
    updataCollapseItem(state,data){
      state.collapseItem = data
    },
    
    updataCollapse(state,data){
      state.collapse = data
    },
    
    updataUsername(state,data){
      state.username = data
    },
    quit(state,data){
      state.collapse = data
      state.collapseItem = data
      state.jurisdiction = data
      state.perInfo = data
      state.table = false
      state.tableData = data
      state.username = data
    }
  },
  state:{
    // 个人信息
    perInfo:JSON.parse(uni.getStorageSync("perInfo") || "{}"),
    // 权限信息
    jurisdiction:JSON.parse(uni.getStorageSync("jurisdiction") || "{}"),
    // table
    table:false,
    // table数据
    tableData:"",
    // 点击的面板
    collapse:"",
    // 面板中的选项
    collapseItem:"",
    // 更新输入框内容
    username:""
  }
})
// pages/studentNotice/studentNotice.js
import {StudentApplyDao} from '../../class/dao/StudentApplyDao.js'
import {JobDao} from '../../class/dao/JobDao.js'
const app = getApp()
const studentApplyDao = new StudentApplyDao()
const jobDao = new JobDao()
const limit = 10
var offsetPage = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    applys:[],
    index:0,
    actionSheetVisible:false,
    options:[{
      name:'查看',
    },{
      name:'删除申请',
      color:'#ed3f14'
    }],
    showLoadmore:false,
    showBlank:false
  },
  showActionSheet(e){
    this.setData({ 
      index:e.currentTarget.dataset.index,
      actionSheetVisible:true
    })
  },
  closeActionSheet(){
    this.setData({ actionSheetVisible:false })
  },
  
  do({ detail }){
    const index = detail.index
    if(index == 0)  //查看岗位信息
      this.gotoJobInfo()
    else  //取消申请
      this.cancelApply()      
  },

  gotoJobInfo(){
    var _id = this.data.applys[this.data.index].job_id
    this.closeActionSheet()
    jobDao.get(_id).then(res=>{
      var jobJson = JSON.stringify(res)
      wx.navigateTo({ url: '/pages/jobInfo/jobInfo?job='+jobJson })
    },err=>{ console.log(err) })
  },

  cancelApply(){
    var _id = this.data.applys[this.data.index]._id,self = this
    var applys = this.data.applys
    wx.showModal({
      title:'提示',
      content:'确定取消吗？',
      cancelText:'放弃', 
      cancelColor: '#ed3f14',
      confirmText:'确定',
      confirmColor:'#2b85e4',
      success(res){
        if(res.confirm){
          console.log('删除')
          studentApplyDao.delete(_id).then(res=>{
            applys.splice(self.data.index,1)
            self.setData({
              actionSheetVisible:false,
              applys:applys,
              showBlank:applys.length ? false : true
            })
            wx.showToast({  title: '删除成功' })
          },err=>{ console.log(err) })
        }
      }
    })
  },

  onLoad(){
    var self = this
    wx.getSystemInfo({
      success: (res) => {
        self.setData({ height:res.windowHeight - 50 })
      },
    })
  },
  
  onReady(){
    var self = this
    wx.showLoading()
    studentApplyDao.getsByConditionOrderBy({worker_id:app.globalData.userInfo._id}).then(res=>{
      wx.hideLoading()
      var showBlank = res.length?false:true
      self.setData({ applys:res,showBlank:showBlank })
      wx.stopPullDownRefresh()
    },err=>{ console.error(err) })
  },

  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        current: 'notice',
        currentIdentity: app.globalData.userInfo.constructor.name
      })
    }
  },

  onPullDownRefresh() {
    this.onReady()
  },

  onReachBottom(){
    var self = this, applys = this.data.applys
    this.setData({ showLoadmore:true })
    
    studentApplyDao.getsByConditionOrderBy({worker_id:app.globalData.userInfo._id},(++offsetPage)*limit,limit).then(res=>{
      console.log(res)
      //没有更多数据
      if(res.length == 0){
        setTimeout(function(){
          self.setData({  showLoadmore:false  })
        },1000)
        wx.showToast({  title: '暂无更多数据',icon:'none'  })
      }else{
        applys = applys.concat(res) 
        self.setData({  applys:applys,  showLoadmore:false  })
      }
    },err=>{
      console.log(err)
      wx.showToast({  title: '加载时遇到错误',icon:'none'  })
    })  
  }
})
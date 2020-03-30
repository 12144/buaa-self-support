// pages/studentNotice/studentNotice.js
import {StudentApplyDao} from '../../class/dao/StudentApplyDao.js'
const app = getApp()
const studentApplyDao = new StudentApplyDao()
const limit = 10
var offsetPage = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    applys:[],
    showLoadmore:false,
    showBlank:false
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
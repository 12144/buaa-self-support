// pages/adminNotice/adminNotice.js
import {TeacherApplyDao} from '../../class/dao/TeacherApplyDao.js'
import {JobDao} from '../../class/dao/JobDao.js'

const app = getApp()
const teacherApplyDao = new TeacherApplyDao()
const jobDao = new JobDao()
const limit = 10
var offsetPage = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    applys:[],
    showBlank:false,
    actionSheetVisible:false,
    modalVisible:false,
    showLoadmore:false,
    selectedIndex:0,
    options:[{
      name:'查看岗位',
    },{
      name:'通过',
      color:'#19be6b'
    },{
      name:'拒绝',
      color:'#ed3f14'
    },{
      name:'取消'
    }],
    reason:'',
  },

  showActionSheet(e){
    console.log(e)
    this.setData({ 
      selectedIndex:e.currentTarget.dataset.index,
      actionSheetVisible:true
    })
  },
  closeActionSheet(){
    this.setData({ actionSheetVisible:false })
  },
  showModal(){
    this.setData({ modalVisible:true })
  },
  closeModal(){
    this.setData({ modalVisible:false })
  },

  inputReason(e){
    console.log(e)
    this.setData({ reason: e.detail.detail.value})
  },

  do({ detail }){
    const index = detail.index
    if(index == 0)
      this.gotoJobInfo()
    else if(index == 1)
      this.pass()
    else if(index == 2)
      this.showModal()
    else
      this.closeActionSheet()      
  },

  gotoJobInfo(){
    console.log(this.data)
    var jobJson = JSON.stringify(this.data.applys[this.data.selectedIndex].job)
    wx.navigateTo({ url: '/pages/jobInfo/jobInfo?job='+jobJson })
    this.closeActionSheet()
  },

  pass(){
    var self = this
    var applys = this.data.applys
    var apply = applys[this.data.selectedIndex]
    apply.state = '通过'
    //修改状态为通过
    teacherApplyDao.update(apply._id,{state:'通过'}).then(res=>{
      //如果是岗位已存在
      if(apply.target)
        jobDao.update(apply.target,apply.job).then(res=>{
          console.log(res)
          self.restOption(applys)
          wx.showToast({  title: '操作成功', })
        },err=>{
          console.log(err)
          wx.showToast({  title: '更新岗位时遇到错误',icon:'none' })
        })
      //往岗位表中添加记录
      else  
        jobDao.add(apply.job).then(res=>{
          console.log(res)
          self.restOption(applys)
          wx.showToast({  title: '操作成功', })
        },err=>{
          console.log(err)
          wx.showToast({  title: '添加岗位时遇到错误',icon:'none' })
        })
    },err=>{ 
      console.log(err)
      wx.showToast({  title: '修改状态时遇到错误',icon:'none' })
    })
  },

  reject(){
    console.log('reject')
    var self = this
    var applys = this.data.applys
    var _id = applys[this.data.selectedIndex]._id
    applys[this.data.selectedIndex].state = '拒绝'
    applys[this.data.selectedIndex].reason = this.data.reason
    teacherApplyDao.update(_id,{state:'拒绝',reason:this.data.reason}).then(res=>{
      console.log(res)
      self.restOption(applys)
      wx.showToast({  title: '操作成功', })
    },err=>{
      console.log(err)
      wx.showToast({  title: '修改状态时遇到错误',icon:'none' })
    })
  },

  restOption(applys){
    this.setData({
      actionSheetVisible:false,
      modalVisible:false,
      applys:applys
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
    offsetPage = 0
    wx.showLoading()
    teacherApplyDao.getsOrderBy().then(res=>{
      wx.hideLoading()
      var showBlank = res.length?false:true
      self.setData({ applys:res,showBlank:showBlank })
      wx.stopPullDownRefresh()
      console.log(res)
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

  onPullDownRefresh(){
    this.onReady()
  },

  onReachBottom(){
    var self = this, applys = this.data.applys
    this.setData({ showLoadmore:true })
    
    teacherApplyDao.getsOrderBy((++offsetPage)*limit,limit).then(res=>{
      console.log(res)
      //没有更多数据
      if(res.length == 0){
        setTimeout(function(){
          self.setData({  showLoadmore:false })
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
// miniprogram/pages/personalInfo/personalInfo.js
import {UserInfoDao} from '../../class/dao/UserInfoDao.js'
var Md5 = require('../../third-part/md5.js')
const app = getApp()
const userInfoDao = new UserInfoDao()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    loading:false,
    visible:false,
    password1:'',
    password2:''
  },

  onInputName(e){
    this.setData({ 'userInfo.name':e.detail.detail.value })
  },
  onInputMobileNumber(e){
    this.setData({ 'userInfo.mobile_number':e.detail.detail.value })
  },
  changeDepartment(){
    wx.navigateTo({ url: '/pages/teacherIdnetifyCampus/teacherIdnetifyCampus'  })
  },

  showModal(){
    this.setData({ visible:true })
  },
  closeModal(){
    this.setData({ visible:false })
  },

  inputPassword1(e){
    this.setData({ password1:e.detail.detail.value })
  },
  inputPassword2(e){
    console.log(e)
    this.setData({ password2:e.detail.detail.value })
  },
  changePassword(e){
    if(this.data.password1 != this.data.password2){
      wx.showToast({  title: '两次密码输入不一致',icon:'none' })
      return
    }else{
      var pwd = Md5.b64_md5(this.data.password1)
      app.globalData.userInfo.password = pwd
      this.update({password:pwd})
    }
  },

  save(){
    app.globalData.userInfo.name = this.data.userInfo.name
    app.globalData.userInfo.mobile_number = this.data.userInfo.mobile_number
    this.update({
      name:this.data.userInfo.name,
      mobile_number:this.data.userInfo.mobile_number
    })
  },

  update(data){
    wx.showLoading()
    var self = this
    userInfoDao.update(app.globalData.userInfo._id,data).then(res=>{
      wx.hideLoading()
      wx.showToast({  title: '修改成功'  })
      self.setData({visible:false})
      console.log(res)
    },err=>{ 
      wx.showToast({  title: '修改时遇到错误,请重新尝试',icon:'none'  })
      console.log(err)
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({ userInfo:app.globalData.userInfo })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
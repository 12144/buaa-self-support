// pages/teacherIdentifyDepartment/teacherIdentifyDepartment.js
import {UserInfoDao} from '../../class/dao/UserInfoDao.js'
import {Teacher} from '../../class/entity/UserIdentity.js'

const app = getApp()
const userInfoDao = new UserInfoDao()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:0,
    campus:'',
    currentDeparment:'',
    department:[],
  },

  changeDepartment(e){
    this.setData({ currentDeparment: e.detail.value })
  },

  confirm(){
    if(!this.data.currentDeparment){
      wx.showToast({  title: '请选择部门',icon:'none' })
      return
    }
    //更新用户信息
    else{
      wx.showLoading()
      this.updateUserInfo({
        campus:this.data.campus,
        department:this.data.currentDeparment,
      }).then(res=>{
        wx.hideLoading()
        var pages = getCurrentPages(), preprePage = pages[pages.length-3].__route__
        if(preprePage == "pages/personalInfo/personalInfo")
          wx.navigateBack({delta:2})
        else
          wx.switchTab({ url: '/pages/jobs/jobs' })
      },err=>{ console.log(err) })
    }
  },

  //更新用户个人信息，同时更新全局用户角色
  updateUserInfo(userInfo){
    var promise = new Promise(function(resolve,reject){
      userInfoDao.update( app.globalData.userInfo._id , userInfo).then(res=>{
        userInfoDao.get( app.globalData.userInfo._id ).then(res=>{
          //更新全局角色
          app.globalData.userInfo = new Teacher(res)
          console.log("更新全局角色：",app.globalData.userInfo)
          resolve('ok')
        },err=>{ reject(err) })
      },err=>{ reject(err) })
    })
    return promise
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        var height = res.windowHeight*0.8
        if(options.campus == '沙河')
          this.setData({ campus:options.campus, department: app.globalData.shDepartment,height:height })
        else
          this.setData({ campus:options.campus, department: app.globalData.xylDepartment,height:height })
      },
    })
  },
})
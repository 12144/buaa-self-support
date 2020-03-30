// pages/teacherIdnetify/teacherIdentify.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentCampus:'',
    campus:app.globalData.campus,
  },

  changeCampus(e){
    if(e.detail.value == '学院路')
      this.setData({ currentCampus:e.detail.value })
    else
      this.setData({ currentCampus:e.detail.value })
  },

  nextStep(){
    if(!this.data.currentCampus){
      wx.showToast({  title: '请选择校区',icon:'none' })
      return
    }

    var arg = this.data.currentCampus
    wx.navigateTo({ url: '/pages/teacherIdentifyDepartment/teacherIdentifyDepartment?campus='+arg })
  }
})
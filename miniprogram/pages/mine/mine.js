// pages/mine/mine.js
import {Student, Teacher, Admin } from "../../class/entity/UserIdentity"

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
  },

  onShow(){
    console.log(app.globalData.userInfo)
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        current: 'mine',
        currentIdentity: app.globalData.userInfo.constructor.name,
      })
    }
    this.setData({ userInfo: app.globalData.userInfo  })
  },
})
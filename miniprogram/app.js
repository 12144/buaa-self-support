import {getCampusList,getDepartmentList} from './class/entity/CampusAndDepartments.js'
//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env:'buaa-self-support-ax7oe',
        traceUser: true,
      })
    }

    this.globalData = {}
    //校区信息
    this.globalData.campus = getCampusList()
    //获取部门信息
    this.globalData.shDepartment = getDepartmentList('沙河')
    this.globalData.xylDepartment = getDepartmentList('学院路')
  },
  
  globalData:{
    userInfo:{}
  },
})

// pages/jobs/jobs.js
import {JobDao} from '../../class/dao/JobDao.js'

const app = getApp()
const jobDao = new JobDao()
const limit = 10
var offsetPage = 0
const shDepartment = [{_id:0,name:"全部"}].concat(app.globalData.shDepartment)
const xylDepartment = [{_id:0,name:"全部"}].concat(app.globalData.xylDepartment)


Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobs:[],
    showFilter:false,
    showBlank:false,
    showLoadmore:false,
    visibility:'hidden',
    animation:'',
    campus:['全部','学院路','沙河'],
    shDepartment:shDepartment,
    xylDepartment:xylDepartment,
    currentCampus:"全部",
    currentDepartment:'全部',
  },

  // 筛选
  showFilter(){
    this.setData({ showFilter:true })
  },
  closeFilter(){
    this.setData({ showFilter:false })
  },
  changeCampus(e){
    if(e.detail.value == "全部" && this.data.currentCampus != "全部")
      this.setData({ animation:'hidden' })
    else
      this.setData({ animation:'show' })
    
    this.setData({  
      currentCampus:e.detail.value,
      currentDepartment:"全部",
    })
  },
  changeDepartment(e){
    var idx = e.detail.value[0]
    var department = this.data.currentCampus == "沙河"?shDepartment[idx].name:xylDepartment[idx].name
    this.setData({ currentDepartment:department  })
  },
  filter(){
    var condition = {}
    if(this.data.currentCampus != "全部") condition.campus = this.data.currentCampus
    if(this.data.currentDepartment != "全部") condition.department = this.data.currentDepartment
    this.condition = condition
    console.log(condition)
    this.onReady()
  },
  // 查看岗位详情
  goToJobInfo(e){
    var job = e.currentTarget.dataset.job
    var jobJson = JSON.stringify(job)
    wx.navigateTo({  url: '/pages/jobInfo/jobInfo?job='+jobJson, })
  },

  onLoad(){
    var self = this
    wx.getSystemInfo({
      success: (res) => {
        self.setData({ height:res.windowHeight - 50 })
      },
    })
    // 初始化筛选条件
    this.condition = {}
  },

  onReady(){
    var self = this
    offsetPage = 0
    wx.showLoading()
    //拉取岗位信息
    jobDao.getsByConditionOrderBy(this.condition).then(res=>{
      wx.hideLoading()
      console.log(res)
      var showBlank = res.length?false:true
      self.setData({ jobs:res,showBlank:showBlank  })
      wx.stopPullDownRefresh()
    },err=>{ 
      console.log(err) 
      wx.hideLoading()
      wx.showToast({  title: '网络错误，请重新加载',icon:'none' })
    })
  },

  onShow(){
    //设置tabbar
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        current: 'jobs',
        currentIdentity: app.globalData.userInfo.constructor.name
      })
    }
  },

  onPullDownRefresh(){
    this.onReady()
  },
  
  onReachBottom(){
    var self = this, jobs = this.data.jobs
    this.setData({ showLoadmore:true })
    
    jobDao.getsOrderBy((++offsetPage)*limit,limit).then(res=>{
      console.log(res)
      //没有更多数据
      if(res.length == 0){
        setTimeout(function(){
          self.setData({  showLoadmore:false  })
        },1000)
        wx.showToast({  title: '暂无更多数据',icon:'none'  })
      }else{
        jobs = applys.concat(res) 
        self.setData({  jobs:jobs,  showLoadmore:false  })
      }
    },err=>{
      console.log(err)
      wx.showToast({  title: '加载时遇到错误',icon:'none'  })
    })  
  }
})
// pages/teacherNotice/teacherNotice.js
import {TeacherApplyDao} from '../../class/dao/TeacherApplyDao.js'
import {StudentApplyDao} from '../../class/dao/StudentApplyDao.js'
import {JobDao} from '../../class/dao/JobDao.js'
import {OnJobDao} from '../../class/dao/OnJobDao.js'
const app = getApp()
const studentApplyDao = new StudentApplyDao()
const teacherApplyDao = new TeacherApplyDao()
const jobDao = new JobDao()
const onJobDao = new OnJobDao()
const limit = 10  //  每次加载个数
var offsetPage1 = 0
var offsetPage2 = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBlank1:false,
    showBlank2:false,
    studentApplys:[],
    studentIndex:0,
    teacherApplys:[],
    teacherIndex:0,
    tabs:['学生申请','我的申请'],
    current:'学生申请',
    actionSheetVisible:false,
    actionSheetVisible2:false,
    modalVisible:false,
    reason:'',
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
    options2:[{
      name:'预览'
    },{
      name:'修改',
      color:'#19be6b'
    },{
      name:'删除',
      color:'#ed3f14'
    },{
      name:'取消'
    }],
    showLoadmore:false
  },

  changeTab(e){
    this.setData({ current:e.detail.key })
  },

  showActionSheet(e){
    this.setData({ 
      studentIndex:e.currentTarget.dataset.index,
      actionSheetVisible:true
    })
  },
  showActionSheet2(e){
    this.setData({
      teacherIndex:e.currentTarget.dataset.index,
      actionSheetVisible2:true
    })
  },
  closeActionSheet(){
    this.setData({ actionSheetVisible:false,actionSheetVisible2:false })
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
    var _id = this.data.studentApplys[this.data.studentIndex].job_id
    this.closeActionSheet()
    jobDao.get(_id).then(res=>{
      var jobJson = JSON.stringify(res)
      wx.navigateTo({ url: '/pages/jobInfo/jobInfo?job='+jobJson })
    },err=>{ console.log(err) })
  },

  pass(){
    var self = this
    var applys = this.data.studentApplys
    var apply = applys[this.data.studentIndex]
    applys[this.data.studentIndex].state = '通过'
    //修改状态为通过
    studentApplyDao.update(apply._id,{state:'通过'}).then(res=>{
      //往在岗表中添加记录
      onJobDao.add({
        job_id:apply.job_id,
        worker_id:apply.worker_id,
        work_time:apply.work_time,  //工作时间
        apply_time:apply.work_time  //报名的时间
      }).then(res=>{
        console.log(res)
        self.restOption('studentApplys',applys)
        wx.showToast({  title: '操作成功', })
      },err=>{
        console.log(err)
        wx.showToast({  title: '添加工作人员时遇到错误',icon:'none' })
      })
    },err=>{ 
      console.log(err)
      wx.showToast({  title: '修改状态时遇到错误',icon:'none' })
    })
  },

  reject(){
    var self = this
    var applys = this.data.studentApplys
    var _id = applys[this.data.studentIndex]._id
    applys[this.data.studentIndex].state = '拒绝'
    applys[this.data.studentIndex].reason = this.data.reason
    studentApplyDao.update(_id,{state:'拒绝',reason:this.data.reason}).then(res=>{
      console.log(res)
      self.restOption('studentApplys',applys)
      wx.showToast({  title: '操作成功', })
    },err=>{
      console.log(err)
      wx.showToast({  title: '修改状态时遇到错误',icon:'none' })
    })
  },

  do2({detail}){
    const index = detail.index
    if(index == 0)
      this.preview()
    else if(index == 1)
      this.modify()
    else if(index == 2)
      this.delete()
    else
      this.closeActionSheet()
  },

  preview(){
    var apply = this.data.teacherApplys[this.data.teacherIndex]
    var jobJson = JSON.stringify(apply.job)
    this.closeActionSheet()
    wx.navigateTo({ url: '/pages/jobInfo/jobInfo?job='+jobJson})
  },

  //修改岗位信息
  modify(){
    var apply = this.data.teacherApplys[this.data.teacherIndex]
    var jobJson = JSON.stringify(apply.job),applyId = apply._id
    this.closeActionSheet()
    wx.navigateTo({  url: '/pages/createJob/createJob?applyId='+applyId+'&job='+jobJson  })
  },

  //删除我的申请记录
  delete(){
    var id = this.data.teacherApplys[this.data.teacherIndex]._id , self = this
    var applys = this.data.teacherApplys
    teacherApplyDao.delete(id).then(res=>{
      console.log(res)
      applys.splice(self.data.teacherIndex,1)
      self.restOption('teacherApplys',applys)
      wx.showToast({  title: '删除成功' })
    },err=>{
      console.log(err)
      wx.showToast({  title: '删除时遇到错误',icon:'none'  })
    })
  },

  restOption(which,applys){
    var data = {
      actionSheetVisible:false,
      actionSheetVisible2:false,
      modalVisible:false,
    }
    if(which == 'studentApplys'){
      data.studentApplys = applys
      data.showBlank1 = applys.length ? false : true
    }
    else if(which == 'teacherApplys') {
      data.teacherApplys = applys 
      data.showBlank2 = applys.length ? false : true
    }

    this.setData(data)
  },

  onLoad(){
    var self = this
    wx.getSystemInfo({
      success: (res) => {
        self.setData({ height:res.windowHeight - 92 })
      },
    })
  },
  
  onReady(){
    var self = this,tmp=0
    offsetPage1 = 0,offsetPage2 = 0
    wx.showLoading()
    teacherApplyDao.getsByConditionOrderBy({_openid: app.globalData.userInfo._openid}).then(res=>{
      wx.hideLoading()
      var showBlank2 = res.length?false:true
      self.setData({ teacherApplys:res,showBlank2:showBlank2 })
      if(++tmp == 2)
        wx.stopPullDownRefresh()
    },err=>{ console.error(err) })
  
    studentApplyDao.getsByConditionOrderBy({
      campus:app.globalData.userInfo.campus,
      department:app.globalData.userInfo.department,
      state:'审核中'
    }).then(res=>{
      var showBlank1 = res.length?false:true
      self.setData({ studentApplys:res,showBlank1:showBlank1 })
      if(++tmp == 2)
        wx.stopPullDownRefresh()
    },err=>{ console.log(err) })
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
    var self = this,applys = [],Dao = null,condition = null,current = this.data.current == "学生申请"?0:1
    this.setData({ showLoadmore:true })

    if(current == 0){
      applys = this.data.studentApplys
      Dao = studentApplyDao
      offsetPage1++
      condition = {  campus:app.globalData.userInfo.campus,
        department:app.globalData.userInfo.department,
        state:'审核中'  }
    }  
    else{
      applys = this.data.teacherApplys
      Dao = teacherApplyDao
      offsetPage2++
      condition = { _openid: app.globalData.userInfo._openid }
    }
      
    Dao.getsByConditionOrderBy(condition,(current?offsetPage2:offsetPage1)*limit).then(res=>{
      console.log(res)
      //没有更多数据
      if(res.length == 0){
        setTimeout(function(){
          self.setData({  showLoadmore:false  })
        },1000)
        wx.showToast({  title: '暂无更多数据',icon:'none'  })
      }else{
        applys = applys.concat(res) 
        if(current)  self.setData({  teacherApplys:applys,  showLoadmore:false  })
        else self.setData({  studentApplys:applys,  showLoadmore:false  })
      }
    },err=>{
      console.log(err)
      wx.showToast({  title: '加载时遇到错误',icon:'none'  })
    })
  },

  onPageScroll(e){
    if(e.scrollTop > 0){
      if(this.fixed) return
      this.setData({ fixed:true })
      this.fixed = true
    }
    else{
      if(!this.fixed) return
      this.setData({ fixed:false })  
      this.fixed = false
    }
  }
})
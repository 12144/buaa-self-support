// miniprogram/pages/createJob/createJob.js
import {Schedule} from '../../class/entity/Schedule.js'
import {TeacherApplyDao} from '../../class/dao/TeacherApplyDao.js'

const app = getApp()
const teacherApplyDao = new TeacherApplyDao()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    campusList:null,
    shDepartment:null,
    xylDepartment:null,
    visible1:false,
    index:0,      //选择部门用
    loading:false,
    current:'周一',
    //岗位的信息
    job:{
      name:'',              
      campus:'点击选择校区',  
      department:'点击选择所属部门',  
      teacher:'', 
      teacher_mobile_number:'', 
      email:'', 
      department_mobile_number:'',  
      temporary:false,  
      site:'',   
      worker_need:null, 
      introduction:'',  
      note:'',  
      start_apply_time: new Date().getTime(), 
      end_apply_time: new Date().getTime(), 
    },
    schedule:{},
  },

  changeCurrent(e){
    this.setData({ current:e.detail })
  },

  //岗位名称模块
  inputName(e){
    this.setData({ 'job.name':e.detail.detail.value })
  },

  //选择校区模块
  showCampus(){
    this.setData({ visible1:true })
  },
  closeCampus(){
    this.setData({ visible1:false })
  },
  changeCampus({detail}){
    var index = detail.index
    this.setData({
      'job.campus':this.data.campusList[index].name,
      visible1:false
    })
  },

  //选择部门模块
  changeDepartment(e){
    if(this.data.job.campus == '点击选择校区'){
      wx.showToast({  title: '请先选择校区',  icon:'none'  })
      return
    }

    var index = e.detail.value
    if(this.data.job.campus == '沙河')
      this.setData({ 'job.department':this.data.shDepartment[index].name })
    else
      this.setData({ 'job.department':this.data.xylDepartment[index].name })  
  },

  //填写老师名字
  inputTeacher(e){
    this.setData({ 'job.teacher':e.detail.detail.value })
  },

  //填写工作地点
  inputSite(e){
    this.setData({ 'job.site':e.detail.detail.value })
  },

  //填写教师手机号
  inputTeacherMobile(e){
    this.setData({ 'job.teacher_mobile_number':e.detail.detail.value })
  },

  //填写邮箱
  inputEmail(e){
    this.setData({ 'job.email':e.detail.detail.value })
  },
  
  //部门电话
  inputDepartmentMobile(e){
    this.setData({ 'job.department_mobile_number':e.detail.detail.value })
  },

  //是否临时岗
  changeTemporary(e){
    this.setData({ 'job.temporary':e.detail.value })
  },

  //所需人数
  inputWorkerNeed(e){
    this.setData({ 'job.worker_need':parseInt(e.detail.detail.value) })
  },

  //岗位介绍
  inputIntroduction(e){
    this.setData({ 'job.introduction':e.detail.detail.value })
  },

  //报名须知
  inputNote(e){
    this.setData({ 'job.note':e.detail.detail.value })
  },

  //报名开始日期
  getStartDay(e){
    var array = e.detail.value.split('-')
    var year = parseInt(array[0]),month = parseInt(array[1])-1,day = parseInt(array[2])
    var date = new Date(this.data.job.start_apply_time)
    date.setFullYear(year,month,day)
    this.setData({ 'job.start_apply_time': date.getTime() })
  },

  //报名开始时间
  getStartTime(e){
    var array = e.detail.value.split(':')
    var hour = parseInt(array[0]),minute = parseInt(array[1])
    var date = new Date(this.data.job.start_apply_time)
    date.setHours(hour,minute,0,0)
    this.setData({ 'job.start_apply_time': date.getTime()})
  },

  //报名截止日期
  getEndDay(e){
    var array = e.detail.value.split('-')
    var year = parseInt(array[0]),month = parseInt(array[1])-1,day = parseInt(array[2])
    var date = new Date(this.data.job.end_apply_time)
    date.setFullYear(year,month,day)
    this.setData({ 'job.end_apply_time': date.getTime() })
  },

  //报名截止时间
  getEndTime(e){
    var array = e.detail.value.split(':')
    var hour = parseInt(array[0]),minute = parseInt(array[1])
    var date = new Date(this.data.job.end_apply_time)
    date.setHours(hour,minute,0,0)
    this.setData({ 'job.end_apply_time': date.getTime()})
  },

  //添加时间段
  addTime(e){
    var day = e.detail.day
    var time = e.detail.time
    var schedule = this.data.schedule
    schedule.addWorkTime(day,time)
    this.setData({ schedule:schedule })
  },

  //删除时间段
  deleteTime(e){
    var day = e.detail.day
    var time = e.detail.time
    var schedule = this.data.schedule
    schedule.deleteWorkTime(day,time)
    this.setData({ schedule:schedule })
  },

  //拷贝时间段
  copyTime(e){
    var sourceDay = e.detail.sourceDay
    var targetDay = e.detail.targetDay
    var schedule = this.data.schedule
    schedule.copyTime(sourceDay,targetDay)
    this.setData({ schedule:schedule })
  },

  //检查信息是否完整
  checkInfo(){
    var tip = "请填写"
    if(!this.data.job.name) tip += "岗位名称 "
    if(this.data.job.campus == '点击选择校区') tip += "所在校区 "
    if(this.data.job.department == '点击选择所属部门') tip += "所属部门 "
    if(!this.data.job.teacher) tip += "负责老师 "
    if(!this.data.job.teacher_mobile_number) tip += "联系电话 "
    if(!this.data.job.email) tip += "联系邮箱 "
    if(!this.data.job.department_mobile_number) tip += "部门电话 "
    if(!this.data.job.site) tip += "工作地点 "
    if(!this.data.job.worker_need) tip += "所需人数 "
    if(!this.data.job.introduction) tip += "岗位介绍 "
    if(!this.data.job.note) tip += "报名须知 "
    
    if(tip.length != 3)
      wx.showToast({  title: tip,icon:'none'  })
    else
      this.applyJob()
  },

  //上传申请
  applyJob(){
    this.setData({ loading:true })
    var job = this.jobTemplate(),self = this
    var apply = this.applyTemplate(job)

    // 修改申请
    if(this.applyId)
      teacherApplyDao.update(self.applyId,{job:job,state:'审核中'}).then(res=>{
        console.log(res)
        this.setData({ loading:false })
        wx.showToast({  title: '申请成功'  })
      },err=>{
        console.log(err)
        this.setData({ loading:false })
        wx.showToast({ title: '申请时遇到错误，请再次尝试',icon:'none'  })
      })
    //新建一个申请  
    else
      teacherApplyDao.add(apply).then(res=>{
        console.log(res)
        this.setData({ loading:false })
        wx.showToast({  title: '申请成功'  })
      },err=>{ 
        console.log(err)
        this.setData({ loading:false })
        wx.showToast({ title: '申请时遇到错误，请再次尝试',icon:'none'  })
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var job = JSON.parse(options.job), applyId = options.applyId
    if(options.job != '"{}"'){ 
      if(applyId) this.applyId = applyId
      else    this.jobId = job._id
      this.setData({ job:job })
    }

    var workDay = ["周一","周二","周三","周四","周五","周六","周日"]
    var work_time = {}
    workDay.forEach((day)=>{
      if(options.job != '"{}"' && job.work_time[day])  work_time[day] = job.work_time[day]
      else  work_time[day] = []
    })

    this.setData({
      schedule:new Schedule(work_time,[]),
      campusList:app.globalData.campus,
      shDepartment:app.globalData.shDepartment,
      xylDepartment:app.globalData.xylDepartment
    })
  },

  jobTemplate(){
    var schedule = this.data.schedule
    var job = this.data.job
    job.work_time = schedule.export()
    job.avatar_url = app.globalData.userInfo.avatarUrl
    job.stop = false
    if(job._id) delete job._id
    return job
  },

  applyTemplate(job){
    return {//_id,_openid自动创建
      avatar_url:app.globalData.userInfo.avatarUrl,
      job:job,
      apply_time: (new Date()).getTime(),
      reason: '',
      state: '审核中',
      target:this.jobId?this.jobId:''
    }
  }
})
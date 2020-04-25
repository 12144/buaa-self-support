// pages/jobInfo/jobInfo.js
import {Schedule} from '../../class/entity/Schedule.js'
import {StudentApplyDao} from '../../class/dao/StudentApplyDao.js'
import {OnJobDao} from '../../class/dao/OnJobDao.js'
import {JobDao} from '../../class/dao/JobDao.js'

const app = getApp()
const studentApplyDao = new StudentApplyDao()
const onJobDao = new OnJobDao()
const jobDao = new JobDao()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    identity:'',
    job:null,
    workerList:[],
    schedule:{},
    current:'tab1',
    timeSelected:[],          //学生报名选择的时间段
    add_reduce_student_day:'',  // 添加或者删除某个学生所在时间段的星期和具体时间段
    add_reduce_student_time:'',
    currentId:'',             //当前要操作（从时间段里添加或删除）的学生id
    fireId:'',                //下岗学生id
    loading:false,
    showLeft1:false,
    showLeft2:false,
    showRight:false,
    showFire:false,
    showModify:true,
    notOnCharge:true
  },

  changeCurrent(e){
    this.setData({ current:e.detail })
  },
  
  checkboxChange(e){
    this.setData({ timeSelected : e.detail.value })
  },
  
  showAddStudent(e){
    this.setData({
      add_reduce_student_day:e.detail.day,
      add_reduce_student_time:e.detail.time,
      showLeft1:true,
    })
  },
  showReduceStudent(e){
    this.setData({
      add_reduce_student_day:e.detail.day,
      add_reduce_student_time:e.detail.time,
      showLeft2:true,
    })
  },
  closeDrawer(){
    var self = this
    this.setData({
      showLeft1:false,
      showLeft2:false,
    })
    setTimeout(function(){
      self.setData({currentId:''})
    },500)
  },
  showAllList(){
    this.setData({ showRight:true })
  },
  closeAllList(){
    this.setData({ showRight:false })
  },
  
  showFire(e){
    this.setData({
      showFire:true,
      fireId:e.currentTarget.dataset.id
    })
  },
  closeFire(e){
    this.setData({  showFire:false  })

    setTimeout(function(){
      self.setData({currentId:''})
    },500)
  },

  checkApply(){
    // 检查时间段
    var date = new Date().getTime()
    if(date < this.data.job.start_apply_time){
      wx.showToast({ title: '还未到报名时间',icon:'none' })
      return
    }
    if(date > this.data.job.end_apply_time){
      wx.showToast({  title: '报名已截止',icon:'none'  })
      return
    }

    // 检查报名时间段的数量
    var self = this
    var timeSelected = this.data.timeSelected
    if(timeSelected.length < 2 || timeSelected.length > 5){
      wx.showToast({  title: '请选择2到5个时间段',  icon:'none' })
      return
    }

    // 检查身份 
    if(!this.data.job.temporary && !app.globalData.userInfo.is_self_supporter){
      wx.showToast({  title: '非经困生只能报名临时岗',icon:'none' })
      return
    }
    
    self.setData({ loading:true })
    //检查用户是否有在岗岗位
    onJobDao.getCountByCondition({worker_id:app.globalData.userInfo._id}).then(res=>{
      if(res == 0)
        //检查用户是否有申请中的岗位
        studentApplyDao.getsByCondition({worker_id:app.globalData.userInfo._id,state:'审核中'}).then(res=>{
          //无申请中岗位，新建申请
          if(res.length == 0)
            self.apply()
          //修改当前岗位的报名时间段
          else if(res.length == 1 && res[0].job_id == self.data.job._id)  
            self.updateApply(res[0]._id)
          else
            wx.showToast({  
              title: '您最多只能同时申请一个岗位',  icon: 'none',
              success:function(){ self.setData({ loading:false }) } 
            })
        },err=>{ 
          console.log(err)
          wx.showToast({  
            title: '检查申请时遇到错误',  icon: 'none',
            success:function(){ self.setData({ loading:false }) } 
          })
        })
      else
        wx.showToast({ 
          title: '您已经有在岗岗位',  icon: 'none',
          success:function(){ self.setData({ loading:false }) } 
        })
    },err=>{ 
      console.log(err)
      wx.showToast({  
        title: '检查在岗时遇到错误',  icon: 'none',
        success:function(){ self.setData({ loading:false }) } 
      })
    })
  },

  //新增申请
  apply(){
    var self = this
    var apply = applyTemplate(this.data.job._id,this.data.job.name,this.data.job.campus,this.data.job.department,this.data.job.avatar_url,
      app.globalData.userInfo._id,this.formatTimeSelected())
    
    studentApplyDao.add(apply).then(res=>{
      wx.showToast({  
        title: '报名成功',
        success:function(){ self.setData({ loading:false }) } 
      })
    },err=>{ 
      console.log(err) 
      wx.showToast({  
        title: '报名时遇到错误',  icon: 'none',
        success:function(){ self.setData({ loading:false }) } 
      })
    })
  },

  //更新报名时间段
  updateApply(_id){
    var self = this
    studentApplyDao.update(_id,{
      work_time:this.formatTimeSelected()
    }).then(res=>{
      console.log(res)
      wx.showToast({  
        title: '报名成功',
        success:function(){ self.setData({ loading:false }) } 
      })
    },err=>{ 
      console.log(err) 
      wx.showToast({  
        title: '报名时遇到错误',  icon: 'none',
        success:function(){ self.setData({ loading:false }) } 
      })
    })
  },

  //格式化
  formatTimeSelected(){
    var timeSelected = this.data.timeSelected
    var work_time = {}
    for(let i=0;i<timeSelected.length;i++){
      let day = timeSelected[i].split('?')[0]
      let time = timeSelected[i].split('?')[1]
      if(!work_time[day])
        work_time[day] = []
      let j = 0;
      while(j < work_time[day].length && work_time[day] < time ) j++;
      work_time[day].splice(j,0,time)
    }
    return work_time
  },


  addStudent(e){
    var self = this
    const id = e.currentTarget.dataset.id
    var schedule = this.data.schedule,day = this.data.add_reduce_student_day,time = this.data.add_reduce_student_time
    
    //从该时间段删除该学生，同时修改该学生的工作时间段
    schedule.addStudent(day,time,id)
    //修改该学生工作时间
    onJobDao.update(id,{work_time:schedule.workers[id].work_time}).then(res=>{
      console.log(res)
      self.setData({ currentId:day+time+id },()=>{
        setTimeout(function(){
          self.setData({ schedule:schedule })
        },600)
      })
      wx.showToast({title:''})
    },err=>{ 
      console.log(err) 
      wx.showToast({title:'遇到错误',icon:'none'})
    })
  },

  reduceStudent(e){
    var self = this
    const id = e.currentTarget.dataset.id
    var schedule = this.data.schedule,day = this.data.add_reduce_student_day,time = this.data.add_reduce_student_time
    
    //从该时间段删除该学生，同时修改该学生的工作时间段
    schedule.reduceStudent(day,time,id)
    //修改该学生工作时间
    onJobDao.update(id,{work_time:schedule.workers[id].work_time}).then(res=>{
      console.log(res)
      self.setData({ currentId:day+time+id },()=>{
        setTimeout(function(){
          self.setData({ schedule:schedule })
        },600)
      })
      wx.showToast({title:''})
    },err=>{ 
      console.log(err) 
      wx.showToast({title:'遇到错误',icon:'none'})
    })
  },

  //下岗学生
  fire(){
    var id = this.data.fireId,self = this
    var schedule = this.data.schedule
    schedule.fireStudent(id)

    onJobDao.delete(id).then(res=>{
      console.log(res)
      self.setData({ currentId:id,showFire:false },()=>{
        setTimeout(function(){
          self.setData({ schedule:schedule })
        },600)
      })
      wx.showToast({  title: '操作成功'  })
    },err=>{
      console.log(err)
      wx.showToast({  title: '删除时遇到错误',  icon: 'none'  })
    })
  },

  modify(){
    var jobJson = JSON.stringify(this.data.job)
    wx.navigateTo({  url: '/pages/createJob/createJob?applyId='+'&job='+jobJson  })
  },

  stopApply(){
    var self = this
    wx.showModal({
      title:"提示",
      content:"确认截止报名？开启需要再次申请",
      confirmColor:'#2b85e4',
      success:function(){
        //岗位停止报名
        jobDao.update(self.data.job._id,{stop:true}).then(res=>{
          console.log(res)
          self.setData({'job.stop':true})
        },err=>{  
          console.log(err)
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var job = JSON.parse(options.job)
    this.setData({ job:job,identity:app.globalData.userInfo.className})
    var pages = getCurrentPages(), prePage = pages[pages.length-2].__route__
    if(prePage == "pages/teacherNotice/teacherNotice" || prePage == "pages/adminNotice/adminNotice")
      this.setData({ showModify:false })
    
    if(app.globalData.userInfo.campus == job.campus && app.globalData.userInfo.department == job.department)
      this.setData({ notOnCharge:false })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var self = this
    var job = this.data.job

    if(!job._id){
      var schedule = new Schedule(job.work_time,[],job.worker_need)
      self.setData({
        workerList:[],
        schedule:schedule,
        current:schedule.workDay[0]
      })
    }else{
      //获取工作人员名单
      wx.cloud.callFunction({
        name: 'getWorkers',
        data:{
          job_id:job._id
        },
        success:res=>{
          console.log(res)
          var schedule = new Schedule(job.work_time,res.result.list,job.worker_need)
          self.setData({ 
            workerList:res.result.list,
            schedule: schedule,
            current:schedule.workDay[0]
          })
        },
        fail:err=>{ 
          console.log(err)
          wx.showToast({ title: '网络错误请重新尝试',icon:'none'  })
        }
      })
    }
  },
})

var applyTemplate = function(job_id,job_name,campus,department,avatar_url,worker_id,work_time){
  return {
    //_id，自动生成
    job_id : job_id,
    job_name : job_name,
    campus: campus,
    department:department,
    avatar_url: avatar_url,
    worker_id : worker_id,
    work_time : work_time,
    reason : '',
    target: '',
    state:'审核中',
    apply_time:(new Date()).getTime()
  }
}
// pages/studentIdentify/studnetIdentify.js
import {SelfSupporterDao} from '../../class/dao/SelfSupporterDao.js'
import {UserInfoDao} from '../../class/dao/UserInfoDao.js'
import {Student} from '../../class/entity/UserIdentity.js'

const app = getApp()
const userInfoDao = new UserInfoDao()
const selfSupporterDao = new SelfSupporterDao()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    student_id:"",
    mobile_number:"",
    visible:false,
    actions:[
      {name:'取消'},
      {name:'继续',color:'#2d8cf0'}
    ]
  },

  openModal(){
    this.setData({visible:true})
  },
  closeModal(){
    this.setData({visible:false})
  },
  inputName(e){
    this.setData({name:e.detail.detail.value})
  },
  inputStudentId(e){
    this.setData({student_id:e.detail.detail.value})
  },
  inputMobileNumber(e){
    this.setData({mobile_number:e.detail.detail.value})
  },
  // 点击操作弹窗
  onclick(e){
    if(e.detail.index == 0) this.closeModal()
    else if(e.detail.index == 1) this.gotoIndex()
  },
  gotoIndex(){
    if(this.check(0)){
      //更新用户数据
      this.updateUserInfo({
        name:this.data.name,
        student_id:this.data.student_id,
        mobile_number:this.data.mobile_number
      }).then(res=>{
        wx.switchTab({ url: '/pages/jobs/jobs' })
      },err=>{ console.log(err) })
    }
  },
  
  //检查信息是否完善，0检查手机号，非0检查姓名学号
  check(mode){
    var tip = "请填写"
    if(!mode){
      var mobile_number = this.data.mobile_number
      if(!mobile_number) tip += "手机号"
    }else{
      var name = this.data.name
      var student_id = this.data.student_id
      if(!name) tip += "姓名"
      if(!student_id) tip += "学号"
    }

    if(tip.length != 3){
      wx.showToast({  title: tip,  icon: 'none'  })
      return false
    }else return true
  },

  confirm(){
    var self = this
    var name = self.data.name, student_id = self.data.student_id
    
    if(this.check(1)){
      wx.showLoading()
      selfSupporterDao.getByCondition({'name':name, 'student_id': student_id}).then(res=>{
        wx.hideLoading()
        //用户是经困生，更新用户数据，更新全局角色，更新本地缓存，跳转到首页
        if(res.length){
          //更新用户数据
          var user = res[0]
          user.is_self_supporter = true
          delete user['_id']
          self.updateUserInfo(user).then(res=>{
            //更新后，跳转页面
            wx.switchTab({ url: '/pages/jobs/jobs' })
          },err=>{console.log(err)})
        }
        //用户不是经困生，显示提示弹窗
        else 
         self.openModal()
      },err=>{  console.log(err) })  
    }
  },

  //更新用户个人信息，同时更新全局用户角色
  updateUserInfo(userInfo){
    return new Promise(function(resolve,reject){
      userInfoDao.update( app.globalData.userInfo._id , userInfo).then(res=>{
        userInfoDao.get( app.globalData.userInfo._id ).then(res=>{
          //更新全局角色
          app.globalData.userInfo = new Student(res)
          console.log("更新全局角色：",app.globalData.userInfo)
          resolve('ok')
        },err=>{ reject(err) })
      },err=>{ reject(err) })
    })
  },
})
import {Student,Teacher,Admin,userInfoInit} from '../../class/entity/UserIdentity.js'
import {UserInfoDao} from '../../class/dao/UserInfoDao.js'
var Md5 = require('../../third-part/md5.js')

const app = getApp()
const userInfoDao = new UserInfoDao()

Page({
  data: {
    current: 0,               //当前身份，0学生，1教师，2管理员
    userIdentity:[{
        imagePath:"/images/student.png",
        identity:"学生"
      },{
        imagePath:"/images/teacher.png",
        identity:"教师"
      },{
        imagePath:"/images/admin.png",
        identity:"管理员"
    }],
    loading:false,
    visible:false,
    password:""
  },

  //改变身份
  changeIdentity(e){
    this.setData({current:e.detail.current})
  },

  openModal(){
    this.setData({visible:true})
  },
  closeModal(){
    this.setData({visible:false})
  },
  inputPassword(e){
    this.setData({password:e.detail.detail.value})
  },

  login(e){
    //没有授权
    if(!e.detail.userInfo) return

    var self = this
    var current = this.data.current

    wx.showLoading()
    //获取用户信息
    this.getUserInfo(e.detail.userInfo).then(res => {
      //创建全局用户角色
      if(current == 0)
        app.globalData.userInfo = new Student(res);
      if(current == 1)
        app.globalData.userInfo = new Teacher(res);
      if(current == 2)
        app.globalData.userInfo = new Admin(res);
      console.log('app.globalData.userInfo:', app.globalData.userInfo)

      wx.hideLoading()
      //如果身份是教师或者管理员，则需要输入密码
      if(app.globalData.userInfo instanceof Teacher || app.globalData.userInfo instanceof Admin)
        self.openModal()
      else if(app.globalData.userInfo instanceof Student)
        //刚创建的用户，跳转到认证页面
        if(!app.globalData.userInfo.student_id)
          wx.navigateTo({  url: '/pages/studentIdentify/studnetIdentify' })
        else
          wx.switchTab({ url: '/pages/jobs/jobs' })
      else
        wx.showToast({  title: '用户初始化失败，请重新尝试',icon:'none'  })
    }, err => {
      console.log(err)
      wx.showToast({  title: '获取用户信息失败，请重新尝试',icon:'none'  })
    })
  },

  //以教师或管理员的身份登录
  teacherOrAdminLogin(){
    var password = this.data.password

    //密码错误
    if (Md5.b64_md5(password) != app.globalData.userInfo.password) {
      wx.showToast({ title: '密码错误', icon: 'none' })
      return
    }else  this.setData({ visible:false })

    //管理员直接到首页
    if( app.globalData.userInfo instanceof Admin )
      wx.switchTab({ url: '/pages/jobs/jobs' })
    //教师认证过的去首页，否则去认证页
    else  
      if( app.globalData.userInfo.department )   
        wx.switchTab({ url: '/pages/jobs/jobs' })
      else   
        wx.navigateTo({ url: '/pages/teacherIdnetifyCampus/teacherIdnetifyCampus'  })
  },

  //以对象形式返回用户信息（云数据库的一个副本），初次使用会在数据库新增一条记录
  getUserInfo(userBasicInfo){
    var self = this
    return new Promise(function(resolve,reject){
      //获取用户openid
      self.getOpenId().then(openid=>{
        //用openid去查询用户
        userInfoDao.getByCondition({'_openid':openid}).then(res=>{
          if(res.length)
            resolve(res[0])
          //用户不存在初始化用户信息，插入数据库  
          else{  
            var initUserInfo = userInfoInit()
            initUserInfo.nickName = userBasicInfo.nickName
            initUserInfo.avatarUrl = userBasicInfo.avatarUrl
            //插入时数据库已自动生成_id和_openid
            userInfoDao.add(initUserInfo).then(res=>{ 
              initUserInfo._id = res._id
              initUserInfo._openid = openid
              resolve(initUserInfo)
            },err=>{  reject(err) })
          }
        },err=>{  reject(err) })
      },err=>{  reject(err) })
    })
  },

  //获取openid
  getOpenId(){
    return new Promise(function(resolve,reject){
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          resolve(res.result.openid)
        },
        fail: err => {  reject('[云函数] [login] 调用失败', err) }
      })
    })
  }
})
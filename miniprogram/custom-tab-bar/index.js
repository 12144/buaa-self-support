const app = getApp()

Component({
  data: {
    current:'',
  },

  methods: {
    handleChange(e){
      var identity = app.globalData.userInfo.className
      switch(e.detail.key){
        case 'jobs':
          wx.switchTab({  url: '/pages/jobs/jobs' })
          break;
        case 'notice':
          if(identity == 'Student')
            wx.switchTab({  url: '/pages/studentNotice/studentNotice' })
          else if(identity == 'Teacher')
            wx.switchTab({  url: '/pages/teacherNotice/teacherNotice' })
          else if(identity == 'Admin')
            wx.switchTab({  url: '/pages/adminNotice/adminNotice' })
          else
            wx.showToast({  title: '用户角色未定义' ,icon:'none'})  
          break;
        case 'mine':  
          wx.switchTab({  url: '/pages/mine/mine' })
          break
      }
    }
  }
 })
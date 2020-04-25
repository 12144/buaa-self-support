const app = getApp()

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties:{
    thumb:{
      type:String,
      value:""
    },
    reason:{
      type:String,
      value:""
    },
    state:{
      type:String,
      value:""
    },
    title:{
      type:String,
      value:""
    }
  },
  data: {
    url:""
  },
  lifetimes:{
    attached(){
      var url = "";
      if(this.data.state == '通过')
        url = 'pass'
      else if(this.data.state == '拒绝')
        url = 'reject'
      else if(this.data.state == '审核中')
        url = 'check'
      if(url != '')    
        this.setData({
          url: url+'.png'
        })   
    }
  }
})

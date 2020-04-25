const app = getApp()

Component({
  properties:{
    url:{
      type:String,
      value:""
    },
    content:{
      type:String,
      value:""
    },
    islink:{
      type:Boolean,
      value:false
    },
    linkurl:{
      type:String,
      value:""
    },
    linktype:{
      type:String,
      value:'default'
    }
  },
  data: {

  },

  methods:{
    goto(){
      var self = this
      if(self.data.islink){
        if(self.data.linktype == 'default')
          wx.navigateTo({  url: self.data.linkurl })
        else if(self.data.linktype == 'relaunch')
          wx.reLaunch({  url: self.data.linkurl })  
      }
    }
  }
})

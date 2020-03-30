// dist/schedule.js
import {Schedule} from '../../class/entity/Schedule.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    schedule:{
      type:Object,
      value:{}
    },
    current:{
      type:String,
      value:''
    },
    ifcreate:{
      type:Boolean,
      value:false
    },
    identity:{
      type:String,
      value:''
    },
    //是否显示添加删除按钮
    add_delete_button:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: { 
    visible:false,
    visible2:false,
    startTime:'00:00',
    endTime:'23:59',
    currentDay:'',
    sourceDay:'周一'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //触发事件
    checkboxChange(e){
      var detail = e.detail
      var option = {}
      this.triggerEvent('checkboxChange',detail,option)
    },
    handleChange(e){
      var detail = e.detail.key
      var option = {}
      this.triggerEvent('currentChange',detail,option)
    },
    showModal(e){
      this.setData({
        visible:true,
        currentDay:e.currentTarget.dataset.day
      })
    },
    showCopyModal(e){
      this.setData({
        visible2:true,
        currentDay:e.currentTarget.dataset.day
      })
      console.log(this.data.schedule.workDay)
    },
    closeModal(){
      this.setData({ visible:false,visible2:false })
    },
    getStartTime(e){
      this.setData({ startTime:e.detail.value })
    },
    getEndTime(e){
      this.setData({ endTime:e.detail.value })
    },
    add(){
      if(this.data.startTime >= this.data.endTime){
        wx.showToast({  title: '不合理时间段，请重新设置',icon:'none' })
        return
      }

      var detail = {
        day:this.data.currentDay,
        time:this.data.startTime + '-' + this.data.endTime
      }
      var option = {}
      this.triggerEvent('addTime',detail,option)
    },
    delete(e){
      var detail = e.currentTarget.dataset
      var option = {}
      this.triggerEvent('deleteTime',detail,option)
    },
    addStudent(e){
      var detail = {
        day:e.currentTarget.dataset.day,
        time:e.currentTarget.dataset.time
      }
      var option = {}
      this.triggerEvent('addStudent',detail,option)
    },
    reduceStudent(e){
      var detail = {
        day:e.currentTarget.dataset.day,
        time:e.currentTarget.dataset.time
      }
      var option = {}
      this.triggerEvent('reduceStudent',detail,option)
    },
    changeSourceDay(e){
      var idx = e.detail.value[0]
      var day = this.data.schedule.workDay[idx]
      this.setData({ sourceDay:day })
    },
    copyTime(){
      var detail = {
        sourceDay:this.data.sourceDay,
        targetDay:this.data.currentDay
      }
      var option = {}
      this.triggerEvent('copyTime',detail,option)
    }
  },
})

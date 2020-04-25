// components/theSwiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrls: Array,
    currentIndex: {
      type: Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    swiperChange(e) {
      var detail = e.detail
      var option = {}
      this.triggerEvent('onChange',detail,option)
    }
  }
});

// pages/yukaman/yukamanDisplay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yukamanTypeArray: ["所有", "天和", "地和", "四暗刻", "大三元", "国士无双", "字一色", "绿一色", "小四喜", "清老头", "九莲宝灯", "四杠子", "累计役满", "纯正九莲宝灯", "四暗刻单骑", "国士无双十三面", "大四喜"],
    yukamanTypeValue: 0,
    searchName: "",
    inputValue:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('yakuman').get({
      success: res => {
        try {
          this.myYakuman = res.data
          console.log('役满榜的数据:', this.myYakuman)
          this.setData({
            myYakuman: this.myYakuman
          })
        } catch (e) {
          console.log(e)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("yukamanTypeArray ready", this.yukamanTypeArray, this.test)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("yukamanTypeArray onshow", this.yukamanTypeArray)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  yukamanTypeBindPickerChange: function (e) {
    console.log('yukamanPicker发送选择改变，携带值为', e.detail.value,this.data.yukamanTypeValue,this.data.inputValue)
    this.setData({
      yukamanTypeValue: e.detail.value
    })
    var filterList
    if (e.detail.value == 0) {
      filterList = this.myYakuman
    }else{
      filterList = this.myYakuman.filter(item => item.yukamanType == this.data.yukamanTypeArray[e.detail.value])
    }


    if (this.data.inputValue!=""&&this.data.inputValue!=null){
      filterList=filterList.filter(i=>i.playerName.indexOf(this.data.inputValue) != -1)
    }

    this.setData({
      myYakuman: filterList
    })
  },

  bindKeyInput: function (e) {
    console.log("[bindKeyInput]",e.detail.value)
    var filterList
    if (this.data.yukamanTypeValue == 0) {
      filterList = this.myYakuman
    }else{
      filterList = this.myYakuman.filter(item => item.yukamanType == this.data.yukamanTypeArray[this.data.yukamanTypeValue])
    }

    if (e.detail.value!=""&&e.detail.value!=null){
      filterList=filterList.filter(i=>i.playerName.indexOf(e.detail.value) != -1)
    }

    this.setData({
      myYakuman: filterList
    })
  },
})
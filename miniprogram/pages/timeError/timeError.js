const app = getApp()
// pages/TimeError/timerror.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        serveTime:app.globalData.serveTime, 
        phoneTime:app.globalData.phoneTime 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('服务器时间为',new Date(app.globalData.serveTime))
        var s=this.formatTime(new Date(app.globalData.serveTime))
        var p=this.formatTime(new Date(app.globalData.phoneTime))
        var offset_GMT = new Date().getTimezoneOffset()
        this.setData({
            serveTime:s,
            phoneTime:p,
            offset_GMT:offset_GMT/-60
          })
    },
    formatTime: function (date1) {
        var date = new Date(date1); //返回当前时间对象
        var month = date.getMonth() + 1
        var day = date.getDate()
        var hour = date.getHours()
        return date.getFullYear()+ "年"+month+ "月"+day+ "日" + hour+":" + date.getMinutes()+":" +date.getSeconds()
      },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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

    }
})
// pages/yukaman/yukamanAdd/yukamanAdd.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        branchArray: ['杨浦', '浦东'],
        branchValue: -1,
        yukamanTypeArray: ["天和", "地和", "四暗刻", "大三元", "国士无双", "字一色", "绿一色", "小四喜", "清老头", "九莲宝灯", "四杠子", "累计役满","纯正九莲宝灯", "四暗刻单骑", "国士无双十三面", "大四喜"],
        yukamanTypeValue: -1,
        addButtonEnable:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    },

    bindFormSubmit: function (e) {
        this.addButtonEnable=true
        const db = wx.cloud.database()
        const _ = db.command
        console.log(e.detail.value.getTime)
        console.log(e.detail.value.yukamanType)
        console.log(e.detail.value.branch)
        console.log(e.detail.value.playerName)
        var time = "黑板年代"
        if (e.detail.value.getTime != null) {
            time = e.detail.value.getTime
        }
        try {
            db.collection('yakuman').add({
                data: {
                    getTime: time,
                    yukamanType: e.detail.value.yukamanType,
                    branch: e.detail.value.branch,
                    playerName: e.detail.value.playerName
                },
                success: res => {
                    wx.redirectTo({
                        url: "/pages/yukaman/yukamanDisplay/yukamanDisplay"
                    })
                }
            })
        } catch (e) {
            console.error(e)
        }

    },
    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            branchValue: e.detail.value
        })
    },
    yukamanBindPickerChange: function (e) {
        console.log('yukamanPicker发送选择改变，携带值为', e.detail.value)
        this.setData({
            yukamanTypeValue: e.detail.value
        })
    },
    bindDateChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            date: e.detail.value
        })
    },
})
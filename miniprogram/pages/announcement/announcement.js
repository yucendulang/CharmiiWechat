// pages/announcement/announcement.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isSubmit:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const db = wx.cloud.database()
        const _ = db.command
        db.collection('config').where({
            type: 'announcement'
        }).get({
            success: res => {
                console.log("数据库成功", res)
                this.setData({
                    announcement: res.data[0].content
                })
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '查询记录失败'
                })
                console.error('[数据库] [查询记录] 失败：', err)
            }
        })

        db.collection('config').where({
            type: 'fontSize'
        }).get({
            success: res => {
                console.log("数据库成功", res)
                this.setData({
                    fontSize: res.data[0].content
                })
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '查询记录失败'
                })
                console.error('[数据库] [查询记录] 失败：', err)
            }
        })
        db.collection('config').where({
            type: 'redAnnouncement'
        }).get({
            success: res => {
                console.log("数据库成功", res)
                this.setData({
                    redAnnouncement: res.data[0].content
                })
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '查询记录失败'
                })
                console.error('[数据库] [查询记录] 失败：', err)
            }
        })
    },

    bindFormSubmit: function (e) {
        this.data.isSubmit=true
        console.log(e)
        console.log(e.detail.value.textarea)
        const db = wx.cloud.database()
        const _ = db.command
        try {
            db.collection('config').where({
                type: 'announcement'
            }).update({
                data: {
                    content: e.detail.value.textarea
                },
                success:res=>{
                    console.log(res)
                    db.collection('config').where({
                        type: 'redAnnouncement'
                    }).update({
                        data: {
                            content: e.detail.value.redAnnouncement
                        },
                        success:res=>{
                            db.collection('config').where({
                                type: 'fontSize'
                            }).update({
                                data: {
                                    content: e.detail.value.fontSize
                                },
                                success:res=>{
                                    wx.showToast({
                                        title: '成功',
        
                                      })
                                      wx.redirectTo({
                                        url: "/pages/index/index"
                                      })
                                },
                                fail:res=>{
                                    console.log(res)
                                    wx.showToast({
                                        title: '失败了不知道为啥1 找Dulang',
                                      })
                                }
                            })
                    }})
                },
                fail:res=>{
                    console.log(res)
                    wx.showToast({
                        title: '失败了不知道为啥 找Dulang',
                      })
                }
            })
        } catch (e) {
            console.error(e)
        }
    }
})
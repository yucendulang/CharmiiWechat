// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database()
    const _ = db.command
    var result;
    await db.collection('yakuman').limit(1000).get().then(res=>{
        result=res.data
    })
    return result
}
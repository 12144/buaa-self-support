// 获取在此岗位上的用户的信息和工作时间段
const cloud = require('wx-server-sdk')

cloud.init()

// 获取岗位的工作人员，传入参数是岗位的_id，job_id
exports.main = async (event, context) => {
  return new Promise(function(resovle,reject){
    var db = cloud.database()
    var $ = db.command.aggregate
    db.collection('on_job').aggregate().match({
      job_id:event.job_id
    }).lookup({
      from:'users',
      localField:'worker_id',
      foreignField:'_id',
      as:'workerInfo'
    }).replaceRoot({
      newRoot:$.mergeObjects([$.arrayElemAt(['$workerInfo',0]),'$$ROOT'])
    }).project({
      workerInfo:0
    }).project({
      worker_id:1,
      _openid:1,
      name:1,
      student_id:1,
      mobile_number:1,
      work_time:1,
      apply_time:1
    }).end().then(res=>{
      resovle(res)
    },err=>{ reject(err) })
  })
}
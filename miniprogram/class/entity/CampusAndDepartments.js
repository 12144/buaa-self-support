function getCampusList(){
  return [
    {_id:1,name:'学院路'},
    {_id:2,name:'沙河'}]
} 

//获取校区的所有部门
function getDepartmentList(campus){
  if(campus == '沙河')
    return [{_id:1,name:'北航大数据中心'},
    {_id:2,name:'北航档案馆'},
    {_id:3,name:'北航学院'},
    {_id:4,name:'“畅叙”少数民族工作室'},
    {_id:5,name:'大学生活动中心'},
    {_id:6,name:'冯如书院'},
    {_id:7,name:'高等理工学院'},
    {_id:8,name:'后勤物业管理服务部'},
    {_id:9,name:'积极心理体验中心'},
    {_id:10,name:'空间与环境学院'},
    {_id:11,name:'沙河教务部'},
    {_id:12,name:'沙河物业服务中心'},
    {_id:13,name:'沙河校区管委会办公室'},
    {_id:14,name:'沙河校区图书馆'},
    {_id:15,name:'沙河校区学生公寓'},
    {_id:16,name:'食堂'},
    {_id:17,name:'士谔书院'},
    {_id:18,name:'士嘉书院'},
    {_id:19,name:'守锷书院'},
    {_id:20,name:'体育部'},
    {_id:21,name:'团工委'},
    {_id:22,name:'物理教学与实验中心'},
    {_id:23,name:'校园卡综合服务中心'},
    {_id:24,name:'新媒体艺术与设计学院'},
    {_id:25,name:'信息化办公室'},
    {_id:26,name:'学生处'},
    {_id:27,name:'学业与发展支持中心'},
    {_id:28,name:'知行书院'},
    {_id:29,name:'致真书院'},
    {_id:30,name:'资助中心'}]
  else
    return [{_id:1,name:'安全保卫部'},
    {_id:2,name:'安全保卫处'},
    {_id:3,name:'北航纪委办公室'},
    {_id:4,name:'北航科协'},
    {_id:5,name:'材料科学与工程学院'},
    {_id:6,name:'档案与文博馆'},
    {_id:7,name:'党委统战部'},
    {_id:8,name:'党委宣传部'},
    {_id:9,name:'党政办机要科'},
    {_id:10,name:'党政办综合科'},
    {_id:11,name:'电子信息工程学院'},
    {_id:12,name:'法学院学生工作办公室'},
    {_id:13,name:'高等理工学院'},
    {_id:14,name:'国际交流合作处'},
    {_id:15,name:'国际通用工程学院'},
    {_id:16,name:'航空科学与工程学院'},
    {_id:17,name:'后勤保障处综合办公室'},
    {_id:18,name:'化学学院'},
    {_id:19,name:'机械学院'},
    {_id:20,name:'积极心理体验中心'},
    {_id:21,name:'计算机学院'},
    {_id:22,name:'教务处'},
    {_id:23,name:'就业指导服务中心'},
    {_id:24,name:'可靠性与系统工程学院'},
    {_id:25,name:'空间与环境学院'},
    {_id:26,name:'离退休党委/离退休工作处'},
    {_id:27,name:'人事处'},
    {_id:28,name:'人文社会科学学院'},
    {_id:29,name:'社区管理服务办公室'},
    {_id:30,name:'实验学校小学部'},
    {_id:31,name:'收发室'},
    {_id:32,name:'数学与系统科学学院'},
    {_id:33,name:'体育部'},
    {_id:34,name:'图书馆'},
    {_id:35,name:'外国语学院'},
    {_id:36,name:'网络信息中心-网络运维'},
    {_id:37,name:'无人系统研究院'},
    {_id:38,name:'物理学院'},
    {_id:39,name:'校团委'},
    {_id:40,name:'校团委组织部'},
    {_id:41,name:'校医院'},
    {_id:42,name:'校园规划建设与资产管理处'},
    {_id:43,name:'校园卡综合服务中心'},
    {_id:44,name:'宣传部'},
    {_id:45,name:'学生事务服务中心'},
    {_id:46,name:'仪器科学与光电工程学院'},
    {_id:47,name:'宇航学院'},
    {_id:48,name:'招标采购管理中心'},
    {_id:49,name:'招生就业处'},
    {_id:50,name:'中法工程师学院'},
    {_id:51,name:'资助中心'},
    {_id:52,name:'自动化科学与电气工程学院'}]  
}
// async function getDepartmentList(campus){
//   var db = wx.cloud.database()
//   var collection
//   const MAX_LIMIT = 20

//   if(campus == '沙河') collection = db.collection('sh_departments')
//   else collection = db.collection('xyl_departments')

//   //集合总数
//   const countResult = await collection.count()
//   const total = countResult.total
//   //分几次取
//   const batchTimes = Math.ceil(total/MAX_LIMIT)
//   //承载所有读操作的promise数组
//   const tasks = []
//   for(let i=0;i < batchTimes;i++){
//     const promise = collection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
//     tasks.push(promise)
//     console.log(promise)
//   }
//   //等待所有
//   return (await Promise.all(tasks)).reduce((acc,cur)=>{
//     return {
//       data:acc.data.concat(cur.data),
//       errMsg:acc.errMsg
//     }
//   })
// }
export {getCampusList,getDepartmentList}
export class Schedule{
  
  constructor(workTime,workerList,workerNeed){
    this.workDay = []
    this.workTime = {}  //{周几:{时间段:[_id]}}
    this.restWorkTime = {}  //该时间段可以工作的学生，添加学生时可从此对象里挑选
    this.workers = {}  //map
    this.workerNeed = workerNeed
    
    //构建this.workDay
    var _workDay = ["周一","周二","周三","周四","周五","周六","周日"]
    _workDay.forEach((day)=>{
      if(workTime[day])
        this.workDay.push(day)
    })
    
    //初始化this.workTime
    this.workDay.forEach((day)=>{
      this.workTime[day] = {}
      workTime[day].forEach((time)=>{
        this.workTime[day][time] = []
      })
    })  

    //初始化this.restWorkTime
    this.restWorkTime = JSON.parse(JSON.stringify(this.workTime))

    //构建this.workTime和this.restWorkTime
    workerList.forEach((worker)=>{
      //根据apply_time初步构建this.reduceWorkTime
      for(let day in worker.apply_time){
        let timeArray = worker.apply_time[day]
        timeArray.forEach((time)=>{
          this.workTimeAdd(this.restWorkTime,day,time,worker._id)
        })
      }
      //根据work_time构建this.workTime并从this.restWorkTime中删去对应项
      for(let day in worker.work_time){
        let timeArray = worker.work_time[day]
        timeArray.forEach((time)=>{
          this.workTimeAdd(this.workTime,day,time,worker._id)
          this.workTimeReduce(this.restWorkTime,day,time,worker._id)
        })
      }
      //构建workers
      this.workers[worker._id] = worker
    })
  }

  //下面两个函数是workTime和restWorkTime的共用函数
  //往时间段里添加一个学生，传入参数要操作的对象，周几，时间段，id
  workTimeAdd(workTime,day,time,id){
    workTime[day][time].push(id)
  }
  //从时间段里去掉一个学生，传入参数要操作的对象，周几，时间段，id
  workTimeReduce(workTime,day,time,id){
    var idx = workTime[day][time].indexOf(id)
    if(idx != -1)
      workTime[day][time].splice(idx,1)
  }

  //在某个时间段内加入一个学生，传入参数周几，时间段，学生id
  addStudent(day,time,id){
    this.workTimeAdd(this.workTime,day,time,id)
    this.workTimeReduce(this.restWorkTime,day,time,id)
    // 修改学生工作时间段
    this.workerAddWorkTime(id,day,time)
  }

  //在某个时间段内删除一个学生，传入参数周几，时间段，学生id
  //同时修改该学生的工作时间段
  reduceStudent(day,time,id){
    this.workTimeReduce(this.workTime,day,time,id)
    this.workTimeAdd(this.restWorkTime,day,time,id)
    //修改学生工作时间段
    this.workerReduceWorkTime(id,day,time)
  }

  //工作人员添加工作时间段，传入参数人员id，周几，时间段
  workerAddWorkTime(id,day,time){
    this.workers[id].work_time[day].push(time)
  }
  //工作人员减少工作时间段
  workerReduceWorkTime(id,day,time){
    var idx = this.workers[id].work_time[day].indexOf(time)
    if(idx != -1)
      this.workers[id].work_time[day].splice(idx,1)
  }

  //下面两个函数是在申请岗位时使用
  //新增一个时间段，传入参数周几day，时间段time
  addWorkTime(day,time){
    this.workTime[day][time] = []
  }
  //删除一个时间段, 传入参数周几day, [时间段time]
  deleteWorkTime(day,time){
    if(time)
      delete this.workTime[day][time]
    else
      delete this.workTime[day]
  }

  //拷贝时间段，传入参数sourceDay,targetDay，sourceDay 拷贝到targerDay
  copyTime(sourceDay,targetDay){
    this.workTime[targetDay] = JSON.parse(JSON.stringify(this.workTime[sourceDay]))
  }

  //从岗位下岗一个学生，传入参数是学生id
  fireStudent(id){
    //从时间表中删除该学生
    var applyTime = this.workers[id].apply_time

    for(var day in applyTime)
      applyTime[day].forEach((time)=>{
        this.workTimeReduce(this.workTime,day,time,id)
        this.workTimeReduce(this.restWorkTime,day,time,id)
      })
    
    //从总名单中删除该学生
    delete this.workers[id]
  }

  //按特定格式导出工作时间段
  export(){
    var workTime = this.workTime
    var _workTime = {}

    for(var day in this.workTime){
      var times = Object.keys(workTime[day]).sort();
      if(times.length != 0){
        _workTime[day] = []
        for(let j in times)
          _workTime[day].push(times[j])
      }
    }

    return _workTime  
  }
}
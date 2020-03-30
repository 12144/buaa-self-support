export class StudentApply{
  constructor(apply){
    this._id = apply._id
    this.job_id = apply.job_id
    this.job_name = apply.job_name    //岗位名字
    this.avatar_url = apply.avatar_url  //岗位的负责人头像
    this.worker_id = apply.worker_id  //申请人id
    this.worker_time = apply.worker_time  //工作时间段
    this.reason = apply.reason        //拒绝理由
    this.target = apply.target        //如果是更新的话，为目标的id，否则为空
    this.state = apply.state
    this.apply_time = apply.apply_time
  }
}
import { Dao } from "./Dao"

export class OnJobDao extends Dao{
  constructor(){
    super('on_job')
  }

  //获取用户在岗的信息的数量
  getCountByCondition(condition){
    var self = this
    return new Promise(function(resolve,reject){
      self.collection.where(condition).count().then(res=>{
        resolve(res.total)
      },err=>{ reject(err) })
    })
  }
}
// 所有管理数据库类的父类，封装了常用的方法
export class Dao{

  constructor(collection){
    this.db = wx.cloud.database()
    this.collection = this.db.collection(collection)
  }

  // 获取一条记录，传入_id
  get(_id){
    var self = this
    return new Promise(function(resolve,reject){
      self.collection.doc(_id).get().then(res=>{
        resolve(res.data)
      },err=>{ 
        reject(err)
      })
    })
  }

  // 无条件获取记录，传入offset和limit，返回一个列表
  gets(offset = 0,limit = 10){
    var self = this
    return new Promise(function(resolve,reject){
      self.collection.skip(offset).limit(limit).get().then(res=>{
        resolve(res.data)
      },err=>{
        reject(err)
      })
    })
  }

  //功能与上一个一样，提供排序功能
  getsOrderBy(offset = 0,limit = 10,orderBy = 'updated_time',mode = 'desc'){
    var self = this
    return new Promise(function(resolve,reject){
      self.collection.skip(offset).limit(limit).orderBy(orderBy,mode).get().then(res=>{
        resolve(res.data)
      },err=>{
        reject(err)
      })
    })
  }

  // 根据查询条件来获取一条记录，传入condition，有多条只返回满足条件的第一条
  getByCondition(condition){
    var self = this
    return new Promise(function(resolve,reject){
      self.collection.where(condition).get().then(res=>{
        resolve(res.data)
      },err=>{
        reject(err)
      })
    })
  }

  // 根据查询条件获取记录，传入offset和limit，返回一个列表
  getsByCondition(condition,offset = 0,limit = 10){
    var self = this
    return new Promise(function(resolve,reject){
      self.collection.where(condition).skip(offset).limit(limit).get().then(res=>{
        resolve(res.data)
      },err=>{
        reject(err)
      })
    })
  }

  //功能与上一个一样，加入排序功能
  getsByConditionOrderBy(condition,offset = 0,limit = 10,orderBy = 'updated_time',mode = 'desc'){
    var self = this
    return new Promise(function(resolve,reject){
      self.collection.where(condition).orderBy(orderBy,mode).skip(offset).limit(limit).get().then(res=>{
        resolve(res.data)
      },err=>{
        reject(err)
      })
    })
  }

  // 添加一条记录，传入记录的信息，返回_id
  add(data){
    var self = this
    return new Promise(function(resolve,reject){
      data['updated_time'] = (new Date()).getTime()
      self.collection.add({ data: data }).then(res=>{
        resolve(res)
      },err=>{
         reject(err)
      })
    })
  }

  // 更新一条记录，传入_id和要更新的数据
  update(_id,data){
    var self = this
    return new Promise(function(resolve,reject){
      data['updated_time'] = (new Date()).getTime()
      if(data['_openid']) delete data['_openid']
      if(data['_id']) delete data['_id']
      self.collection.doc(_id).update({data:data}).then(res=>{
        resolve(res)
      },err=>{
         reject(err) 
      })
    })
  }
  //更新多条记录
  updates(condition,data){
    var self = this
    return new Promise(function(resolve,reject){
      if(data['_openid']) delete data['_openid']
      if(data['_id']) delete data['_id']
      self.collection.where(condition).update({data:data}).then(res=>{
        resolve(res)
      },err=>{reject(err)})
    })
  }

  // 删除一条记录，传入_id
  delete(_id){
    var self = this
    return new Promise(function(resolve,reject){
      self.collection.doc(_id).remove().then(res=>{
        resolve(res)
      },err=>{
        reject(err)
      })
    })
  }

  // 根据条件删除多条记录，传入condition
}
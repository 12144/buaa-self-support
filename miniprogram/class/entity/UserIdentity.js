import {b64_md5} from '../../third-part/md5.js'

export class Student{
  constructor(userInfo){
    this.className = 'Student'
    this._id = userInfo._id;
    this._openid = userInfo._openid;
    this.nickName = userInfo.nickName;
    this.avatarUrl = userInfo.avatarUrl;
    this.name = userInfo.name;
    this.student_id = userInfo.student_id;
    this.mobile_number = userInfo.mobile_number;
    this.is_self_supporter = userInfo.is_self_supporter;
  }
}

export class Teacher {
  constructor(userInfo){
    this.className = 'Teacher'
    this._id = userInfo._id;
    this._openid = userInfo._openid;
    this.nickName = userInfo.nickName;
    this.avatarUrl = userInfo.avatarUrl;
    this.campus = userInfo.campus
    this.department = userInfo.department;
    this.password = userInfo.password;
    this.name = userInfo.name;
    this.mobile_number = userInfo.mobile_number;
  }
}

export class Admin {
  constructor(userInfo){
    this.className = 'Admin'
    this._id = userInfo._id;
    this._openid = userInfo._openid;
    this.nickName = userInfo.nickName;
    this.avatarUrl = userInfo.avatarUrl;
    this.password = userInfo.password;
    this.name = userInfo.name;
    this.mobile_number = userInfo.mobile_number;
  }
}

//初始化用户信息的模板
export function userInfoInit(){
  //_id和_openid数据库自动生成
  return {
    nickName: "",
    avatarUrl: "",
    name: "",
    student_id: "",
    mobile_number: "",
    is_self_supporter: false,
    department:"",
    campus:"",
    password: b64_md5('123')
  }
}
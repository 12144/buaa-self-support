import { Dao } from "./Dao"

/*
 *管理申请类
 */

export class StudentApplyDao extends Dao{
  constructor(){
    super('student_apply')
  }
}
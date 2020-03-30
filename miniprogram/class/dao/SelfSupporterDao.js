/*
 * 管理经困生表
 */
import {Dao} from './Dao.js'

export class SelfSupporterDao extends Dao{
  constructor(){
    super('self_supporters')
  }
}
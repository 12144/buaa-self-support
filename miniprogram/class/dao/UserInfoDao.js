/*
 *用户数据库类，用于管理数据库，是对微信云数据库功能的封装
 */
import {Dao} from './Dao.js'

export class UserInfoDao extends Dao{
  constructor(){
    super('users');
  }
}

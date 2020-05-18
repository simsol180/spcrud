"use script"
import EntityTypeQuery from './EntityTypeQuery.js';

export default class UsersQuery extends EntityTypeQuery{
  constructor(url){
    super('User Information List',url);
  }
  read(url){
    let urlEnd=url||"";
    let u="/_api/web/siteusers?"+urlEnd;
    return super.read(u)
  }
  update(obj){
    let t=this,id=this._getIdFromData(obj),d,functUpdate=super.update;
    return new Promise(function(resolve,reject){
      t._ensureMetaData(obj).then(function(d){
        let url="/_api/web/siteusers/getById("+id+")";
        functUpdate.apply(t,[url,d]).then(resolve,reject);
      },reject)
    });
  }
  current(url){
    let urlEnd=url||"";
    let u="/_api/Web/CurrentUser?"+urlEnd;
    return super.read(u)
  }
}

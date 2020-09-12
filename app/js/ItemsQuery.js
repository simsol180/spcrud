"use script"
import EntityTypeQuery from './EntityTypeQuery.js';

export default class ItemsQuery extends EntityTypeQuery{
  constructor(list,web){
    super(list,web);
  }
  create(data){
    let t=this;
    let functCreate=super.create
    return new Promise(function(resolve,reject){
      t._ensureMetaData(data).then(function(d){
        let url="/_api/web/lists/getbytitle('"+t.list+"')/items";
        functCreate.apply(t,[url,d]).then(resolve,reject)
      },reject)
    })
  }
  read(urlEnd){
    let u=urlEnd||"";
    let url="/_api/web/lists/getbytitle('"+this.list+"')/items?"+u;
    return super.read(url)
  }
  update(data){
    let t=this,id=this._getIdFromData(data),d;
    let functUpdate=super.update
    return new Promise(function(resolve,reject){
      t._ensureMetaData(data).then(function(d){
        let url="/_api/web/lists/getbytitle('"+t.list+"')/items("+id+")";
        functUpdate.apply(t,[url,d]).then(resolve,reject)
      },reject)
    });
  }
  delete(data){
    let id=this._getIdFromData(data);
    let url="/_api/web/lists/getbytitle('"+this.list+"')/items("+id+")";
    return super.delete(url,data);
  }
}

"use script"
import Query from './Query.js';

let types={};

function getIdFromData(data){
  let id=0
  if(data && 'Id' in data){
    let id=data.Id;
  }
  if(data && 'ID' in data){
    let id=data.ID;
  }
  return id;
}


export default class ItemsQuery extends Query{
  constructor(list,web){
    super(web);
    this.web=web;
    this.list=list;
  }
  _getListItemEntityTypeFullName(){
    let list=this.list;
    return new Promise((resolve,reject)=>{
      if(list in types){
        resolve(types[list])
      }else{
        super.read("/_api/web/lists/getbytitle('"+list+"')/?$select=ListItemEntityTypeFullName").then(function(response){
          console.dir(response)
          types[list]=response.d.ListItemEntityTypeFullName
          resolve(types[list]);
        },function(){
          reject.apply((this||{}),araguments);
        })
      }
    })
  }
  _ensureMetaData(data){
    let d=data||{};
    let t=this;
    return new Promise((resolve,reject)=>{
      if("__metadata" in d==false){
        d.__metadata={};
      }
      t._getListItemEntityTypeFullName().then(function(type){
        if("type" in d.__metadata==false){
          d.__metadata.type=type;
        }
        resolve(d)
      },function(){
        reject.apply((this||{}),arguments)
      })
    })
  }
  create(data){
    let t=this;
    let functCreate=super.create
    return new Promise(function(resolve,reject){
      t._ensureMetaData(data).then(function(d){
        let url="/_api/web/lists/getbytitle('"+t.list+"')/items";
        functCreate.apply(t,[url,d]).then(resolve,reject)
      })
    })
  }
  read(urlEnd){
    let url="/_api/web/lists/getbytitle('"+this.list+"')/items?"+urlEnd;
    return super.read(url)
  }
  update(data){
    let t=this,id=getIdFromData(data),d;
    let functUpdate=super.update
    return new Promise(function(resolve,reject){
      t._ensureMetaData(data).then(function(d){
        let url="/_api/web/lists/getbytitle('"+t.list+"')/items("+id+")";
        functUpdate.apply(t,[url,d]).then(resolve,reject)
      })
    })

    return
  }
  delete(data){
    let id=getIdFromData(data);
    let url="/_api/web/lists/getbytitle('"+this.list+"')/items("+id+")";
    return super.delete(url,data);
  }

}

"use script"
import Query from './Query.js';
let types={};

export default class EntityTypeQuery extends Query{
  constructor(list,web){
    super(web);
    this.list=list;
  }
   _getIdFromData(data){
    let id=0
    if(data && 'Id' in data){id=data.Id;}
    if(data && 'ID' in data){id=data.ID;}
    return id;
  }
  _getListItemEntityTypeFullName(){
    let list=this.list;
    return new Promise((resolve,reject)=>{
      if(list in types){
        resolve(types[list])
      }else{
        super.read("/_api/web/lists/getbytitle('"+list+"')/?$select=ListItemEntityTypeFullName").then(function(response){
          types[list]=response.d.ListItemEntityTypeFullName
          resolve(types[list]);
        },reject)
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
      },reject)
    })
  }
}

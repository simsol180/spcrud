"use script"
import EntityTypeQuery from './EntityTypeQuery.js';

function listSelector(list){
  var title="",id="",listSelector=""
  if(typeof list=="string"){
    title=list;
  }else if(typeof list=="object"&& list!==null){
    if("Id" in list){id=list.Id;}
    else if("ID" in list){id=list.ID;}
    else if("Title" in list){title=list.Title;}
  }
  if(id!=""){listSelector="lists(guid'"+id+"')"}
  if(title!=""){listSelector="lists/getbytitle('"+title+"')";}
  return listSelector
}

export default class ListsQuery extends EntityTypeQuery{
  constructor(web){console.log(web)
    super(null,web);
  }
  create(obj){
    if(obj && "__metadata" in obj==false){obj.__metadata={}}
    if("type" in obj.__metadata==false){obj.__metadata.type="SP.List"}
    var u="/_api/web/lists";
    return super.create(u,obj)
  }
  read(url){
    var u=url||""
    var urlEnd="/_api/web/lists?"+u
    return super.read(urlEnd)
  }
  update(obj){
    if(obj && "__metadata" in obj==false){obj.__metadata={}}
    if("type" in obj.__metadata==false){obj.__metadata.type="SP.List"}
    var u="/_api/web/"+listSelector(obj);
    return super.update(u,obj)
  }
  delete(obj){
    let id=this._getIdFromData(obj);
    let url="/_api/web/lists(guid'"+id+"')";
    return super.delete(url);
  }
  createField(obj,list){
    var o={"__metadata": {"type": "SP.Field"},"Title":"","FieldTypeKind": 2,"Required": false,"EnforceUniqueValues": false,};
    for(var i in obj){o[i]=obj[i];}
    var u = "/_api/web/"+listSelector(list)+"/Fields"
    return super.update(u,obj)
  }
  readFields(obj,list){

  }
  updateField(){

  }
}

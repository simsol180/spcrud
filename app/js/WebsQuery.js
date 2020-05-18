"use script"
import EntityTypeQuery from './EntityTypeQuery.js';

export default class WebsQuery extends EntityTypeQuery{
  constructor(web){
    super(web);
  }
  create(obj){
    if(obj && "__metadata" in obj==false){obj.__metadata={}}
    if("type" in obj.__metadata==false){obj.__metadata.type="SP.WebInfoCreationInformation"}
    var u="/_api/web/webinfos/add";
    return super.create(u,obj)
  }
  read(url){
    var u=url||""
    var urlEnd="/_api/web/lists?"+u
    return super.read(urlEnd)
  }
  update(obj){
    if(obj && "__metadata" in obj==false){obj.__metadata={}}
    if("type" in obj.__metadata==false){obj.__metadata.type="SP.WebInfoCreationInformation"}
    var id=this._getIdFromData(obj);
    var u="/_api/web/lists(guid'"+id+"')";
    return super.update(u,obj)
  }
  delete(obj){
    let id=this._getIdFromData(obj);
    let url="/_api/web/lists(guid'"+id+"')";
    return super.delete(url);
  }
}

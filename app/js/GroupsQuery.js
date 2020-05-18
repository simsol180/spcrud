"use script"
import EntityTypeQuery from './EntityTypeQuery.js';

export default class GroupsQuery extends EntityTypeQuery{
  constructor(url){
    super(url)
  }
  create(obj){
    return new Promise((resolve,reject)=>{
        var o=obj||{};
        if("__metadata" in o==false){o.__metadata={};}
        if("type" in o.__metadata==false){o.__metadata.type="SP.Group";}
        super.create("/_api/Web/SiteGroups",o).then(resolve,reject).catch(reject);
    });
  }
  read(urlEnd){
    var u=urlEnd||""
    let url="/_api/Web/SiteGroups/?"+u;
    return super.read(url)
  }
  update(obj){
    var t=this;
    var id=this._getIdFromData(obj)
    for(var i in obj){
      if(obj[i] && typeof obj[i] == 'object' &&'__deferred' in obj[i]){
        delete obj[i];
      }
    }
    return super.update("/_api/web/sitegroups("+id+")",obj);
  }
  delete(obj){
    return new Promise((resolve,reject)=>{
      var t=this;
      var id=this._getIdFromData(obj)
      //requires a post, so using create instead of delete
      super.update("/_api/web/sitegroups/removeById("+id+")",null).then(function(response){
        resolve(response.data);
      }).catch(reject)
    });
  }
}

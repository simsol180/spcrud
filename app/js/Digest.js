const axios = require('axios');

var webs={};
function getStringFromDigest(digest){
  if("FormDigestValue" in digest){
    return digest.FormDigestValue;
  }else{
    return ""
  }
}
function getExpiresFromDigest(digest){
  let expires=new Date();
  if(digest && "FormDigestTimeoutSeconds" in digest){
    expires.setSeconds(expires.getSeconds()+digest.FormDigestTimeoutSeconds-30)
  }else{
    expires.setSeconds(expires.getSeconds()-30)
  }
  return expires;
}

function getWebFromDigest(digest){
  if(digest && "WebFullUrl" in digest){
    return digest.WebFullUrl;
  }else{
    return "";
  }
}

function setReload(data){
  let now=new Date();
  window.setTimeout(function(){
    queryWebDigest(data.web)
  },data.expires-now-2000);
}
function queryWebDigest(web){console.log(web)
  webs[web] = new Promise((resolve,reject)=>{
    var q= axios.post(web+"/_api/contextinfo?$select=FormDigestTimeoutSeconds,FormDigestValue",{
      method: "POST",headers: {"Accept": "application/json; odata=verbose"}
    });
    q.then(function(d){
      var d=d.data
        webs[web]={
          expires:getExpiresFromDigest(d),
          digest:getStringFromDigest(d),
          web:getWebFromDigest(d)
        }
        setReload(webs[web]);
        resolve(webs[web]);
    },reject);
  });
  return webs[web]
}

export default class WebDigest{
  constructor(webUrl){console.log(webUrl)
    return new Promise((resolve,reject)=>{
      if(webUrl in webs==false){
        queryWebDigest(webUrl).then(function(d){resolve(d);},reject);
      }else if('then' in webs[webUrl]==true){
        webs[webUrl].then(function(d){resolve(d);},reject);
      }else if('expires' in webs[webUrl]==false){
        resolve(webs[webUrl]);
      }else{
        reject({});
      }
    })
  }
}

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
    this.web=digest.WebFullUrl;
  }
}
function queryWebDigest(web){
  return axios.post(web+"/_api/contextinfo?$select=FormDigestTimeoutSeconds,FormDigestValue",{
    method: "POST",
    headers: {
      "Accept": "application/json; odata=verbose"
    }
  })
}
function setDigest(d){
  this.digest=getStringFromDigest(d.data);
  this.expires=getExpiresFromDigest(d.data);
  getWebFromDigest.apply(this,[d.data]);
  setReload.apply(this,[]);
}
function setReload(){
  let now=new Date();
  window.setTimeout(this.query,this.expires-now-2000);
}
class BaseDigest{
  constructor(web){
    this.web=web;
    this.activeQuery=false;
    this.digest="";

    this.expires=new Date();
    this.expires.setMinutes(this.expires.getMinutes()-1);

    this.query();
  }
  query(){
    let t=this;
    return new Promise((resolve,reject)=>{
      t.activeQuery=queryWebDigest(t.web);
      t.activeQuery.then(function(){
        setDigest.apply(t,arguments);
        t.activeQuery=false;
        resolve.apply(t,arguments)
      },function(){
        t.activeQuery=false;
        reject.apply(t,arguments);
      });

    })
  }

  read(){
    let t= this;
    return new Promise((resolve,reject)=>{
      if(t.activeQuery){
        t.activeQuery.then(function(){
          resolve(t.digest);
        },function(){
          reject(t.digest);
        })
      }else{
        resolve(t.digest);
      }
    })
  }
  getWeb(){
    let t= this;
    return new Promise((resolve,reject)=>{
      if(t.activeQuery){
        t.activeQuery.then(function(){
          resolve(t.web);
        },function(){
          reject(t.web);
        })
      }else{
        resolve(t.web);
      }
    })
  }
}

export default class WebDigest{
  constructor(web){
    let href=web||window.location.href;
    if(typeof href!="string" || href.length<2){
      href=window.location.href;
    }
    href=href.split("/")
    let isWebFile=  new RegExp("^(.(.*\.aspx|.*\.html$|.*\.htm$))*$");
    if(isWebFile.test(href[href.length-1])){
      href.pop()
    }
    console.dir(href)
    href=href.join("/")

    if(href in webs){
      return webs[href];
    }else{
      webs[href]=new BaseDigest(href);
      return webs[href];
    }
  }
}

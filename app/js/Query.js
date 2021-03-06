import WebDigest from './Digest.js';
const axios = require('axios');

function cleanData(data){
  function cleanRow(row){
    for(let propName in row){
      if(row[propName] && typeof row[propName]=="object"  && "__deferred" in row[propName]){
        delete row[propName];
      }
    }
  }
  if(Array.isArray(data)){for(let i in data){cleanRow(data[i]);}
  }else{cleanRow(data);}
}

export default class Query{
  constructor(web=""){
    this.digest=new WebDigest(web);
  }
  create(url,data){
    cleanData(data);
    let t=this;
    return new Promise((resolve,reject)=>{
      t.digest.then(function(wd){
        axios.post(wd.web+url,JSON.stringify(data),{
          "method": "POST",
          "headers": {
            "content-type": "application/json;odata=verbose",
            "Accept": "application/json; odata=verbose",
            "X-RequestDigest": wd.digest
          },
        }).then(function(response){
          var d=response;
          if("data" in d){d=response.data}
          resolve(d)
        },reject);
      })
    })

  }
  read(url){
    let t=this,u=url||"";
    return new Promise((resolve,reject)=>{
      t.digest.then(function(wd){
        axios.get(wd.web+u,{  method: "GET",headers: { "Accept": "application/json; odata=verbose"  } }).then(function(response){
          var d=response;
          if("data" in d){d=response.data}
          resolve(d)
        }).catch(reject)
      })
    })

  }
  update(url,data){
    cleanData(data);
    let t=this;
    return new Promise((resolve,reject)=>{
      t.digest.then(function(wd){
        axios.patch(wd.web+url,JSON.stringify(data),{
          'headers': {
            "Accept": "application/json; odata=verbose",
            'content-type': "application/json;odata=verbose",
            "X-RequestDigest": wd.digest,
            "If-Match": "*"
          }
        }).then(function(response){
          var d=response;
          if("data" in d){d=response.data}
          resolve(d)
        }).catch(reject)
      })
    })
  }
  delete(url){
    let t=this;
    return new Promise((resolve,reject)=>{
      t.digest.then(function(wd){
        axios.delete(wd.web+url,{
          'method': "DELETE",'headers': {
            "Accept": "application/json; odata=verbose",
            "X-RequestDigest": wd.digest,
            "If-Match": "*"
          }
        }).then(function(response){
          var d=response;
          if("data" in d){d=response.data}
          resolve(d)
        }).catch(reject)
      });
    })
  }
}

import WebDigest from './Digest.js';
const axios = require('axios');

export default class Query{
  constructor(web=""){
    this.digest=new WebDigest(web);
  }
  create(url,data){
    let t=this;
    return new Promise((resolve,reject)=>{
      console.dir(t);
      t.digest.read().then(function(digest){
        t.digest.getWeb().then(function(web){
          axios.post(web+url,JSON.stringify(data),{
            "method": "POST",
            "headers": {
              "content-type": "application/json;odata=verbose",
              "Accept": "application/json; odata=verbose",
              "X-RequestDigest": digest
            },
          }).then(function(response){
            resolve(response.data)
          },function(response){
            reject(response)
          })
        })
      })
    })

  }
  read(url){
    let t=this;
    return new Promise((resolve,reject)=>{
      t.digest.getWeb().then(function(web){
        axios.get(web+url,{
          method: "GET",
          headers: { "Accept": "application/json; odata=verbose"}
        }).then(function(response){
          resolve(response.data)
        },function(){
          reject(response)
        })
      })
    })

  }
  update(url,data){
    let t=this;
    return new Promise((resolve,reject)=>{
      t.digest.read().then(function(digest){
        t.digest.getWeb().then(function(web){
          axios.post(web+url,JSON.stringify(data),{
            'method': "PATCH",
            'headers': {
              "Accept": "application/json; odata=verbose",
              'content-type': "application/json;odata=verbose",
              "X-RequestDigest": digest,
              "If-Match": "*"
            }
          }).then(function(response){
            resolve(response.data);
          },function(response){
            reject(response);
          })
        })
      })
    })
  }
  delete(url){
    let t=this;
    return new Promise((resolve,reject)=>{
      t.digest.read().then(function(digest){
        t.digest.getWeb().then(function(web){
          axios.post(web+url,{
            method: "DELETE",
            headers: {
              "Accept": "application/json; odata=verbose",
              "X-RequestDigest": "todo:get a digest",
              "If-Match": "*"
            }
          }).then(function(response){
            resolve(response.data);
          },function(response){
            reject(response);
          })
        })
      });
    })
  }
}

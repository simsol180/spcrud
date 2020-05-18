"use strict"
import ItemsQuery from './ItemsQuery.js';
import Query from './Query.js';

const axios = require('axios');

var una=new Date();
una=una.getTime();

function restUpload(fileName,digest,arrayBuffer,web,library,overwritable,ensureUnique){
  return new Promise((resolve,reject)=>{
  	var file=fileName.split(".");
  	var end=file.pop();
  	file=file.join(".");
  	file=file.replace(/[^\w\s]/gi, '');
    if(ensureUnique){
      una++;
    	file=file+'-'+una+"."+end;
    }else{
      file=file+"."+end;
    }

  	axios.post(web+ "/_api/web/lists/getbytitle('"+library+"')/RootFolder/Files/Add(url='" +file+ "',overwrite="+overwritable+")?$select=name, ListItemAllFields/Id,ListItemAllFields/ID&$expand=ListItemAllFields",
      arrayBuffer,{headers: {"Accept": "application/json; odata=verbose","X-RequestDigest":digest}
    }).then(resolve).catch(reject);
  })
}

function convertFileToBuffer(file){
  return new Promise((resolve,reject)=>{
    var reader=new FileReader();
    if(!reader){
      reject()
    }else{
      reader.onload = function (e) {
        resolve(reader.result)
      }
      reader.readAsArrayBuffer(file)
    }
  })
}

function uploadFile(file,digest,list,web,overwritable,ensureUnique){
  return new Promise((resolve,reject)=>{
    convertFileToBuffer(file).then(function(arrayBuffer){
        restUpload(file.name,digest,arrayBuffer,web,list,overwritable,ensureUnique).then(resolve).catch(reject)
    },reject)
  })
}

function processFiles(files,digest,list,web,overwritable,ensureUnique){
  return new Promise((resolve,reject)=>{
    var todo=getActionableFileCount(),responses=[],done=0,errors=0;
    function getActionableFileCount(){var c=0;for(var i in files){if(files[i] instanceof Blob){c++;}}return c;}
    function checkDone(a){
        responses.push(a);
        if(responses.length>=files.length&&errors==0){resolve(responses);}
        else if(responses.length>=files.length&&errors!=0){reject(responses);}
    }
    function errorsDone(a){errors++;checkDone(a);}
    for(var i in files){
        var file=files[i];
        if(file instanceof Blob){
          uploadFile(file,digest,list,web,overwritable,ensureUnique).then(checkDone,errorsDone).catch(errorsDone);
        }
    }

    //todo, on all responses with axios.all
  })
}
function isEmpty(o){
  return o===null || typeof o==="undefined";
}

export default class DocumentQuery extends ItemsQuery{
  constructor(list,web,overwritable,ensureUnique){
    super(list,web);
    this.overwritable=false;
    this.ensureUnique=false;
    if(isEmpty(overwritable)===false){this.overwritable=overwritable;}
    if(isEmpty(ensureUnique)===false){this.ensureUnique=ensureUnique;}
  }
  upload(files,overwritable,ensureUnique){
    var t=this,ow=this.overwritable,eu=this.ensureUnique;
    if(isEmpty(overwritable)===false){ow=overwritable;}
    if(isEmpty(ensureUnique)===false){eu=ensureUnique;}
    return new Promise((resolve,reject)=>{
      t.digest.then(function(wd){
        processFiles(files,wd.digest,t.list,wd.web,ow,eu).then(resolve).catch(reject)
      })
    })
  }
}

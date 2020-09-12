
# SP-Crud
## Quick Links
1. [Mission](#mission)  
2. [Installation](#Installation)- How to add sp-crud to your site
3. [Items](#items)- Update List Items
	1. [Example](#items-example)
	2. [Documentation](#items-documentation)
4. [Documents](#documents)- Upload documents
	1. [Example](#documents-example)
	2. [Documentation](#documents-documentation)


## Mission

SP-Crud makes programming with REST easier. As you know, CRUD stands for Create, Read, Update and Delete which succinctly identifies the mission of SP-Crud. Its mission is to make those things as easy as possible.

This executes using the permissions of the user. Therefore, some functionality may be limited by the permissions of that user. For example, a user with read only permissions will not be able to update list items using this tool.

So far, this tool only works in office 365. However, I would like to bring it to SP2013-2019 if can I establish reliable testing environments on those platforms.

[home](#sp-crud)  
<br/><br/>

## Installation

Include the js file in your project using the script tag.
```html
<script type="text/javascript" src="spcrud.simsol180.js"></script>
```

[home](#sp-crud)  
<br/><br/>

### Items

The Items Query Object is intended to aid in changing list items.

#### Items Example
The below example first create's a list item, then reads it, then updates it and finally deletes it.
```javascript

(function(){"use strict"

	//note: it does not end with a slash
	var web="https://simsol180.sharepoint.com"
	var ItemsQuery=simsol180.spcrud.Items

	//assumes there is a list with the title "To Buy" in the web above
	var ToBuy=new ItemsQuery("To Buy",web);

	//create a list item
	ToBuy.create({ Title:"Ice Cream for my daughter"	}).then(function(){

		//read list items
		ToBuy.read("$orderby=Id desc").then(function(query){

			//get the first row
			var results=query.d.results;
			var row=results[0]

			//change the title so that it says "Lots of Ice Cream for my daughter"
			row.Title="Lots of "+row.Title

			//update the row in the list
			ToBuy.update(row).then(function(){

				//delete the list item (sorry, little goose; no ice cream for you.)
				ToBuy.delete(row).then(function(){
					//the row is deleted

				})//close delete
			})//close update
		})//close read
	})//close create
})()

[home](#sp-crud)  
<br/>
```
#### Items Documentation

Class Name: &quot;ItemsQuery&quot;  
JS reference: simsol180.spcrud.Items

Class Instantiation

| Name | Parameters | Result |
| --- | --- | --- |
| simsol180.spcrud.Items | List Title (string), Web Url (string) | An ItemsQuery Object. |

ItemsQuery Object:

| Name | Parameters | Result |
| --- | --- | --- |
| create | 1. A [SP.ListItems](https://docs.microsoft.com/en-us/previous-versions/office/sharepoint-visio/jj245356(v=office.15)?redirectedfrom=MSDN) object  | Returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). The promise resolves a [SP.ListItem](https://docs.microsoft.com/en-us/previous-versions/office/sharepoint-visio/jj245356(v=office.15)?redirectedfrom=MSDN) accessible through arguments[0].d Note: this is not an array or rejects. |
| read |1. The OData query options from a [REST query string](https://docs.microsoft.com/en-us/sharepoint/dev/sp-add-ins/use-odata-query-operations-in-sharepoint-rest-requests#odata-query-operators-supported-in-the-sharepoint-rest-service). | Returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). The promise resolves an array of [SP.ListItems](https://docs.microsoft.com/en-us/previous-versions/office/sharepoint-visio/jj245356(v=office.15)?redirectedfrom=MSDN) accessible through arguments[0].d.results or rejects. |
| update |1. A [SP.ListItems](https://docs.microsoft.com/en-us/previous-versions/office/sharepoint-visio/jj245356(v=office.15)?redirectedfrom=MSDN) object containing at least an Id. | Returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves a blank string or rejects. |
| delete |1. A [SP.ListItems](https://docs.microsoft.com/en-us/previous-versions/office/sharepoint-visio/jj245356(v=office.15)?redirectedfrom=MSDN) object containing at least an Id | Returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves a blank string or rejects. |

[home](#sp-crud)  
<br/><br/>
### Documents

The Document Query Object is intended to handle the part of an upload following a file related event. For example, using a file input or reacting to a file drop event.


#### Documents Example
html (default.aspx)
```html
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml">
<head>
	<script type="text/javascript" src="spcrud.simsol180.js"></script>
	<script type="text/javascript" src="index.js"></script>
</head>
<body>
	<form id="form1" runat="server">
		<div  id="dropArea" style="border:1px silver dotted; width:500px; height:500px;">&nbsp;</div>
	</form>
</body>
</html>
```


JavaScript (index.js)
```javascript

(function(){"use strict"
	//note: it does not end with a slash
	var web="https://simsol180.sharepoint.com"
	var DocumentQuery=simsol180.spcrud.Document
	var Documents =new DocumentQuery("Documents",web);

	document.addEventListener("DOMContentLoaded", function(){
		var dropArea= document.getElementById("dropArea")
		dropArea.addEventListener("dragover", function(e) {
			var ev = e || event;
			ev.preventDefault();
			dropArea.style.background="#333";
		});
		dropArea.addEventListener("dragleave", function(){
			dropArea.style.background="white";
		});
		dropArea.addEventListener("drop", function(e){
			var ev = e || event;
			//stop the browser from trying to open the file
			ev.preventDefault();

			//provide some user feedback
			dropArea.style.background="white";
			dropArea.innerHTML="uploading...";




			/************    Doing the upload here!     ****************/
			var items=ev.dataTransfer.files
			Documents.upload(items,false,true).then(function(results){
				console.log("upload",results)
				dropArea.innerHTML="done uploading...";
			})



		},false);
	});

})()
```
<br/>  
#### Documents Documentation

Class Name: &quot;DocumentQuery&quot;  
JS reference: simsol180.spcrud.Document

Class Instantiation

| Name | Parameters | Result |
| --- | --- | --- |
| simsol180.spcrud.Document |List Title (string), Web Url (string) | An DocumentQuery Object. |

DocumentQuery Object:

| Name | Parameters | Result |
| --- | --- | --- |
| upload | 1. A [DataTransfer.files](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/files) object 2. Overwritable (Boolean) Default false. True if you want uploaded documents to overwrite pre-existing documents. False if you want uploads with pre-existing files to fail. 3. ensureUnique (Boolean) Default false. True if you want to add a unique number to the end of documents. False if you want the original file names unchanged. | An array of UploadResponses  |

<br/><br/>

UploadResponses look like this:
```javascript
{
	d:{
		ListItemAllFields:{
			ID:1,
			Id:1
		}, Name: "Your.doc"
	}
}
 ```
 <br/>  

To get the id of the uploaded document, try this:
```javascript
Documents.upload(items,false,true).then(function(results){
	for(var i in results){
		var uploadedFile=results[i];
		console.log(uploadedFile.d.ListItemAllFields.ID)
	}
})
```
<br/>

Similarly, to get the name:
```javascript
Documents.upload(items,false,true).then(function(results){
	for(var i in results){
		var uploadedFile=results[i];
		console.log(uploadedFile.d.Name)
	}
})
```
[home](#sp-crud)  

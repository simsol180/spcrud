
# SP-Crud

## Mission

SP-Crud makes programming with REST easier. As you know, CRUD stands for Create, Read, Update and Delete which succinctly identifies the mission of SP-Crud. Its mission is to make those things as easy as possible.

This executes using the permissions of the user. Therefore, some functionality may be limited by the permissions of that user. For example, a user with read only permissions will not be able to update list items using this tool.

So far, this tool only works in office 365. However, I would like to bring it to SP2013-2019 if can I establish reliable testing environments on those platforms.

## Installation

Include the js file in your project using the script tag.
```html
<script type=&quot;text/javascript&quot; src=&quot;spcrud.simsol180.js&quot;></script>
```
### Items

The Items Query Object is intended to aid in changing list items.

#### Example
```javascript

(function(){"use strict"

	//note: it does not end with a slash
	var web="https://simsol180.sharepoint.com"
	var ItemsQuery=simsol180.spcrud.Items

	//assumes there is a list with the title "To Buy" in the web above
	var ToBuy=new ItemsQuery("To Buy",web);

	//create a list item
	ToBuy.create({
		Title:"Ice Cream for my daughter"
	}).then(function(){

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

```
#### Documentation

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

### Documents

The Document Query Object is intended to handle the part of an upload following a file related event. For example, using a file input or reacting to a file drop event.

#### Example
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

			var items=ev.dataTransfer.files
			//will add a new copy of the file with a unique string instead of overwriting
			Documents.upload(items,false,true).then(function(results){
				console.log("upload",results)
				dropArea.innerHTML="done uploading...";
			})
		},false);
	});

})()
```
#### Documentation

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
To get the id of the uploaded document, try this:
```javascript
 obj.d.ListItemAllFields.ID
```

Similarly, to get the name:
```javascript
 obj.d.Name
```
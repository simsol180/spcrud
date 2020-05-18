import ItemsQuery from "./js/ItemsQuery.js";
import Query from "./js/Query.js";
import WebDigest from "./js/Digest.js";
import DocumentQuery from "./js/DocumentQuery.js";
import GroupsQuery from "./js/GroupsQuery.js";
import ListsQuery from "./js/ListsQuery.js";

if("simsol180" in window==false){
  window.simsol180={};
}
if("spcrud" in window.simsol180==false){
  window.simsol180.spcrud={
    Query:Query,
    Items:ItemsQuery,
    Digest:WebDigest,
    Document:DocumentQuery,
    Groups:GroupsQuery,
    Lists:ListsQuery
  };
}

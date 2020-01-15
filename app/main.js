import ItemsQuery from "./js/ItemsQuery.js";
import WebDigest from "./js/Digest.js";

if("simsol180" in window==false){
  window.simsol180={}
}
if("spcrud" in window.simsol180==false){
  window.simsol180.spcrud={}
}

window.simsol180.spcrud.ItemsQuery=ItemsQuery;
window.simsol180.spcrud.WebDigest=WebDigest;

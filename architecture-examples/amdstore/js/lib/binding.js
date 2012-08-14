define(['dollar'], function($){

 var allBindings = {};
 var global = this;
 
 var fnBind = function(fn, scope){
   var args = Array.prototype.slice.call(arguments, 2);
   return function(){
     return fn.apply(scope || global, Array.prototype.concat.apply(args, arguments));
   };
 };
 
 var makeId = function(){
   return +new Date() * Math.random();
 };
 
 /*
  Post-process DOM to set up bindings between nodes and the associated viewmodel (data-attach-point)
  ..and event handlers (data-attach-event)
  
  <ul id="list" data-attach-event="click:onClick,dblclick:onDoubleClick"></ul>
  
  $('#list').html(template('<li data-attach-event="click:onItemClick">{{name}}</li>', { })
 
 */
 function bind(scopeNode, viewmodel) {
   // set up node reference and event handler bindings between a node and its viewmodel
   var delegates = {};
   
   $('[data-attach-event]', scopeNode).forEach(function(node){
     var bindId = scopeNode.getAttribute('data-bindid') || scopeNode.setAttribute('data-bindid', (bindId = makeId()));
     var namevalue = (node.getAttribute('data-attach-event') || '').split(':'), 
        evtname = namevalue[0].replace(/^on/, ''), 
        method = namevalue[1]; 
      var handler = fnBind(viewmodel[method], viewmodel); // call the method with viewmodel as 'this'
     $(scopeNode).on(evtname, handler);
     bindings[bindId][evtname] = handler;
   });
   
   $('[data-attach-point]', scopeNode).forEach(function(node){
     var pointname = node.getAttribute('data-attach-point'); 
     viewmodel[pointname] = node;
   });
 }
 function unbind(scopeNode, viewmodel){
   var bindId = scopeNode.getAttribute('data-bindid'), 
       bindings = bindId && allBindings[bindId], 
       unbindFn;
   if(bindId){
      while((unbindFn = bindings.pop())){
        //
      }
   }
 }

 // make sure we clean up before unload
 $(window).unload(function(){allBindings = {};});
 
 return template;
});
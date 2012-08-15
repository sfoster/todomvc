define([
  "dollar", "util", "store/LocalStorage", "store/Observable", "store/lib/Promise", "knockout", "text!../resources/app.tmpl", "text!../resources/item.tmpl"
], function($, util, Store, StoreObservable, Promise, ko, mainTemplate, itemTemplate) {

    //  $(elements).delegate(selector, events, data, handler);  // jQuery 1.4.3+
    //  $(elements).on(events, selector, data, handler);        // jQuery 1.7+

    // -----------------
    // dollar extensions
    //
    $.fn.insertAt = function(selector, idx) {
      // jquery extension to insert contents at a particular position
      var cont = this, 
          $refNode = $(selector), 
          children = $refNode.children();

      if(undefined === idx || idx >= children.length) {
        $refNode.append(cont);
      } else {
        $(children[idx+1]).insertBefore(cont);
      }
      return this;
    };

    // -----------------
    // helpers
    //
    function isDefined(thing){
      return (typeof thing !== 'undefined');
    }

    function decorateWithIndex(item, idx){
      item = Object.create(item); 
      item.index = idx;
      return item;
    }
    
    function insertInto(selector){
      return function(str, idx, coln){
        return $(str).insertAt(selector, idx);
      };
    }
    
    var insertNodes = insertInto('#todo-list');

    // -----------------
    // assemble the pieces for the app
    //

    function renderItem(data, idx){
      var context = Object.create(data);
      context.index = idx;
      var html = itemTemplate(context);
      return html;
    }

    TodoItemPrototype = {
      title: "",
      completed: false
    };

    var App = function(options){
      options = options || {};
      for(var key in options){
        this[key] = options[key];
      }
    };
    
    App.prototype = {
      /** Hash state constants */
      ACTIVE: "/active",
      COMPLETED: "/completed",

      el: null, 

      initialize: function(){
        var self = this;

        /**
         * Hook into unload event to trigger persisting
         * of the current model contents into the localStorage
         * backed data store.
         */
        window.onbeforeunload = function() {
            if(self.store.commit) self.store.commit();
        };

        return this;
      },
      applyBindings: function(){
        var selfNode = $(this.el)[0];
        
        console.log("Applying bindings in : ", selfNode);
        ko.applyBindings(this, selfNode);
        console.log("/Applying bindings");

        return this;
      },
      setStore: function(store){
        var self = this;
        store = this.store = store; // StoreObservable(
        
        var todos = this._todos = ko.observableArray([]);
        
        // the todos array is a computed value, delegating to an observable array
        this.todos = ko.computed(function(){
          console.log("computing the todos property");
          return self.fetchTodos(todos);
        });

        return this;
      },
      fetchTodos: function(rows){
        var self = this;
        
        // we return the observable array, but call splice on it with the results when the come back
        // as its observable, it should result in updates to all listeners
        Promise.when(this.store.query({ type: 'todo' }), function(results){
          console.log("query callback, got results: ", results);
          rows.splice.apply(rows, [0, rows.length].concat(results) );
        });

        return rows; 
      },
      onKeyPress: function(viewmodel, evt){
        var self = this;
        if(evt.which == 13) {
          console.log("adding new store item: ", evt.target.value);
          self.store.add({ title: evt.target.value, type: 'todo' });
          evt.target.value = '';
        }
        return true; // allow default action
      },
      onResultsChange: function(item, removedFrom, insertedInto){
        // console.log("results observer, removed from: %s, inserted into: %s", removedFrom, insertedInto);
        // var arr = [];
        // 
        // if(isDefined(insertedInto) && insertedInto > -1) {
        //   // item was added
        //   arr = new Array(insertedInto); // sparse array
        //   arr.push(item);                    // index 'zeroed' at the store results index
        //   // arr
        //   //   .map(decorateWithIndex)
        //   //   .map(renderItem)
        //   //   .map(insertNodes);
        // } else if(isDefined(removedFrom) && removedFrom > -1){
        //   console.log("item was removed, at index: ", removedFrom, " of ", results.length);
        //   // remove everything after and including the affected item
        // 
        //   arr = new Array(removedFrom); // sparse arrqy
        //   // don't touch elements not needing changes
        //   var dirtyitems= results.slice(removedFrom);
        //   arr.push.apply(arr, dirtyitems);
        // }
        // return arr;
      },
      
      render: function(){
        var self = this;
        $(this.el).html(mainTemplate);
        return this;
      },
      /**
       * Event handler when user has clicked to
       * remove a todo item, just remove it from the
       * model using the item identifier.
       */
      onRemove: function (event) {
          // TODO
      }, 

      /**
       * Whenever the user double clicks the item label, 
       * set inline edit box to true.
       */ 
      onEdit: function (event) {
        console.log("onEdit");
        // TODO
      },

      /**
       * When the URI's hash value changes, modify the 
       * displayed list items to show either completed,
       * remaining or all tasks. 
       * Also highlight currently selected link value.
       */ 
      onHashChange: function (hash) {
        // TODO
      },
      
      onMarkAll: function(){
        console.log("onMarkAll");
      },
      
      removeCompletedItems: function(){
        console.log("removeCompletedItems");
      }
    };
    
    var todoStore = new Store({
      // config store
      data: [
        { id: 'item0', title: 'First Todo', completed: false, type: 'todo' }, 
        { id: 'item1', title: '2nd Todo', completed: false, type: 'todo' },
        { id: 'item3', title: 'Not a  Todo', completed: false, type: 'foo' }
      ]
    });
    
    var app = window.app = new App({
      el: '#todoapp'
    });
    app
      .initialize()
      .render()
      .setStore(todoStore)
      .applyBindings()
    ;
    
});

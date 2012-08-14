define([
  "dollar", "util", "store/LocalStorage", "store/Observable", "handlebars", "text!../resources/app.tmpl", "text!../resources/item.tmpl"
], function($, util, Store, StoreObservable, Handlebars, mainTemplate, itemTemplate) {

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
    mainTemplate = Handlebars.compile(mainTemplate);
    itemTemplate = Handlebars.compile(itemTemplate);

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
        
        // render
        this.mainView = {
          el: '#todoapp',
          template: mainTemplate,
          render: function(context, options){
            this.clear(options);
            var $el = $(this.el);
            var html = this.template(context || {});
            console.log("Insert markup into: ", $el);
            $el.html( html );
          },
          clear: function(options){
            if(!options) options = {};
            var $el = $(this.el), 
                len = $el.children().size();
            var fromIdx = options.from || 0, 
                toIdx = options.to || len; 
                
            console.log(this.el, "view clear from %s, to %s of children: %s", fromIdx, toIdx, len);
            $el.children().slice(fromIdx, toIdx).remove();
          }
        };
        
        this.listView = util.extend(Object.create(this.mainView), {
          el: '#todo-list',
          render: function(items, options){
            items = items || [];
            console.log("render items: ", items);
            this.clear(options);
            items
              .map(renderItem)
              .map(insertNodes);
            return this;
          }
        });

        // TODO
        //  bind key events

        /**
         * Hook into unload event to trigger persisting
         * of the current model contents into the localStorage
         * backed data store.
         */
        window.onbeforeunload = function() {
            if(self.store.commit) self.store.commit();
        };

        // TODO: Connect to changes to the URI hash

        return this;
      },
      setStore: function(store){
        store = this.store = StoreObservable(store);
        var self = this;
        var rows = this.rows = store.query(null);
        // initial render, move/bind to view
        
        //  watch for changes to the store that match our query
        rows.observe(function(item, removedFrom, insertedInto){
          var changes = self.onResultsChange.apply(self, arguments);
          var options = {
            from: removedFrom > -1 ? removedFrom : undefined,
            to: insertedInto > -1 ? insertedInto : undefined
          };
          
          self.listView.render( changes.map(decorateWithIndex), options );

        }, true);
        console.log("in intializae, mapping rows, ", rows.length);
        rows.map(decorateWithIndex).map(function(item, idx){
          console.log("calling render with item: ", item, idx);
          self.listView.render( [item], {
           from: idx 
          });
        });

      },
      onResultsChange: function(item, removedFrom, insertedInto){
        console.log("results observer, removed from: %s, inserted into: %s", removedFrom, insertedInto);
        var arr = [];
        
        if(isDefined(insertedInto) && insertedInto > -1) {
          // item was added
          arr = new Array(insertedInto); // sparse array
          arr.push(item);                    // index 'zeroed' at the store results index
          // arr
          //   .map(decorateWithIndex)
          //   .map(renderItem)
          //   .map(insertNodes);
        } else if(isDefined(removedFrom) && removedFrom > -1){
          console.log("item was removed, at index: ", removedFrom, " of ", results.length);
          // remove everything after and including the affected item

          arr = new Array(removedFrom); // sparse arrqy
          // don't touch elements not needing changes
          var dirtyitems= results.slice(removedFrom);
          arr.push.apply(arr, dirtyitems);
        }
        return arr;
      },
      
      render: function(){
        var self = this;
        if(this.mainView) this.mainView.render();
        if(this.listView) this.listView.render();
        // TODO: tear-down handlers before re-rendering
        $(this.mainView.el)
          .delegate(".destroy", "click", function(){ self.onRemove(); })
          .delegate(".view", "dblclick", function(){ self.onEdit(); })
        ;

        // this.onItemStatusUpdate();

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
      }
    };
    
    var todoStore = new Store({
      // config store
      data: []
    });
    
    var app = window.app = new App();
    app
      .initialize()
      .render()
      .setStore(todoStore);
    
});

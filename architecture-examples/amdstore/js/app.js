define([
  "dollar", "store/LocalStorage", "handlebars", "text!./app.html"
], function($, Store, Handlebars, mainTemplate) {
    //  $(elements).delegate(selector, events, data, handler);  // jQuery 1.4.3+
    //  $(elements).on(events, selector, data, handler);        // jQuery 1.7+
    
    var App = function(options){
      options = options || {};
      for(var key in options){
        this[key] = options[key];
      }
    };
    
    mainTemplate = Handlebars.compile(mainTemplate);
    TodoItemPrototype = {
      title: "",
      completed: false
    };
    
    App.prototype = {
      /** Hash state constants */
      ACTIVE: "/active",
      COMPLETED: "/completed",

      el: null, 

      initialize: function(){
        var self = this;
        
        this.store = new Store({
          data: [
            { title: "Get a TODO app working using the amd-store module", completed: false },
            { title: "Profit", completed: false }
          ]
        });
        
        this.rows = this.store.query(null);
        // TODO
        //  bind key events
        //  bind store events

        /**
         * Hook into unload event to trigger persisting
         * of the current model contents into the localStorage
         * backed data store.
         */
        window.onbeforeunload = function() {
            if(self.store.commit) self.store.commit();
        };

        // TODO: Connect to changes to the URI hash

        // render
        this.view = {
          render: function(){
            $(self.el).html(template);
            // emit("render");
          }
        };
        
        return this;
      },
      render: function(){
        if(this.view) this.view.render();
        // TODO: tear-down handlers before re-rendering
        $(this.el)
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

    var app = new App()
      .initialize()
      .render();
});

$(function( $ ) {
	'use strict';

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	window.app.AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: $("#todoapp"),

		// Our template for the line of statistics at the bottom of the app.
		statsTemplate: _.template($('#stats-template').html()),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			"keypress #new-todo":  "createOnEnter",
			"click #clear-completed": "clearCompleted",
			"click #toggle-all": "toggleAllComplete"
		},

		// At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize: function() {

			this.input = this.$("#new-todo");
			this.allCheckbox = this.$("#toggle-all")[0];

			window.app.Todos.on('add', this.addOne, this);
			window.app.Todos.on('reset', this.addAll, this);
			window.app.Todos.on('all', this.render, this);

			this.$footer = $('#footer');
			this.$main = $('#main');

			window.app.Todos.fetch();
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function() {
			var completed = window.app.Todos.completed().length;
			var remaining = window.app.Todos.remaining().length;

			if (window.app.Todos.length) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.statsTemplate({
							completed:       completed,
							remaining:  remaining
				}));


				this.$('#filters li a')
					.removeClass('selected')
					.filter("[href='#/" + window.app.TodoFilter + "']")
					.addClass('selected');

		
			} else {
				this.$main.hide();
				this.$footer.hide();
			}

			this.allCheckbox.checked = !remaining;
		},

		// Add a single todo item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function(todo) {
			var view = new window.app.TodoView({model: todo});
			$("#todo-list").append(view.render().el);
		},

		// Add all items in the **Todos** collection at once.
		addAll: function() {

			console.log('addall', window.app.TodoFilter);

			this.$("#todo-list").html('');

			switch(window.app.TodoFilter){
				case "active":
					_.each(window.app.Todos.remaining(), this.addOne);
					break;
				case "completed":
					_.each(window.app.Todos.completed(), this.addOne);
					break;
				default:
					window.app.Todos.each(this.addOne, this);
					break;
			}

		},

		// Generate the attributes for a new Todo item.
		newAttributes: function() {
			return {
				title: this.input.val().trim(),
				order: window.app.Todos.nextOrder(),
				completed: false
			};
		},

		// If you hit return in the main input field, create new **Todo** model,
		// persisting it to *localStorage*.
		createOnEnter: function(e) {
			if (e.keyCode != 13) return;
			if (!this.input.val().trim()) return;

			window.app.Todos.create(this.newAttributes());
			this.input.val('');
		},

		// Clear all completed todo items, destroying their models.
		clearCompleted: function() {
			_.each(window.app.Todos.completed(), function(todo){ todo.clear(); });
			return false;
		},

		toggleAllComplete: function () {
			var completed = this.allCheckbox.checked;
			window.app.Todos.each(function (todo) { todo.save({'completed': completed}); });
		}
	});
		

});
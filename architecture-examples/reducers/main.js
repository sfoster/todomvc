/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true browser: true devel: true
         forin: true latedef: false globalstrict: true */
'use strict';

// Imports
// -----------------------------------------------------------------------------

var open = require('reducers/dom').open;
var core = require('reducers/core'),
    filter = core.filter,
    map = core.map;

var reduce = require('reducers/accumulator').reduce;

// Helper Functions
// -----------------------------------------------------------------------------

var each = function (source, f) {
  reduce(source, function (_, item) {
    f(item);
  });
  return null;
};

// Generate a unique client ID.
var cid = function () {
  return (Date.now()).toString(16);
};

var isTruthy = function (thing) {
  return !!thing;
};

// Mutates an element by capturing, removing and returning it's value.
var removeValue = function (el) {
  var value = el.value;
  el.value = '';
  return value;
};

var isEnterKey = function (event) {
  return event.keyCode === 13;
};

// Create a new Todo element from a template by passing an
// object as a data model.
var createTodo = function (model) {
  var liEl = document.createElement('li');
  liEl.setAttribute('id', model.cid);
  liEl.innerHTML = '<div class="view"><input class="toggle" type="checkbox"><label>' +
    model.title +
    '</label><button class="destroy"></button></div><input class="edit" value="' +
    model.title +
    '">';

  return liEl;
}

// Prepend an element to the top of a parent element.
// This helper could be replaced if you decide to use jQuery.
var prepend = function (parentEl, childEl) {
  var firstChild = parentEl.firstChild;
  parentEl.insertBefore(childEl, firstChild);
}

var updateCount = function (count) {
  document.getElementById('todo-count').textContent = count;
}

// Create new TODO
// -----------------------------------------------------------------------------

var docEl = document.documentElement;

var presses = open(docEl, 'keypress');

var enters = filter(presses, isEnterKey);

var incomingTitles = map(enters, function (event) {
  return event.target.value;
});

var validTitles = filter(incomingTitles, isTruthy);

var newTodos = map(validTitles, function (title) {
  return {
    // Generate a client ID for this TODO.
    cid: cid(),
    title: title,
    done: false
  };
});

var newTodoEls = map(newTodos, createTodo);

var todosEl = document.getElementById('todo-list');

// Add the todo elements to the DOM as they stream in.
each(newTodoEls, function (todoEl) {
  prepend(todosEl, todoEl);
});

// Clear each value after it's processed.
each(enters, function (event) {
  event.target.value = '';
});

// Update the item count for each item entered.
reduce(enters, function (count) {
  count = count + 1;
  updateCount(count);
  return count;
}, 0);

// Mouse Mover
// -----------------------------------------------------------------------------

var moves = open(docEl, 'mousemove');

var positions = map(moves, function(event) {
  return { x: event.clientX, y: event.clientY };
});

var element = document.createElement('span');
element.textContent = 'hello world 3';
element.style.position = 'absolute';
element.style.top = 0;
document.body.appendChild(element);

reduce(positions, function(result, position) {
  element.style.top = position.y + 'px'
  element.style.left = position.x + 'px'
});
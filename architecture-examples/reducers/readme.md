# [TodoMVC](http://todomvc.com) using reducers

Reducers is a reactive programming approach to creating applications.

Reducers allow you to process streams of data in real time by using and transforming processing functions. You don't have to create a bunch of interim array containers for that data, because your functions react to it *as it streams in*.

There are a bunch of happy side-effects to this approach as well:

* You don't need to do data-binding. Since you're mapping and filtering from the same live stream, everything stays in sync automatically.
* You don't need to allocate memory to store your data if you don't want to. Your program reacts to the data as it streams in.

## Install

You'll need [Node][node] with [NPM][npm]. Once you've got that:

```sh
cd todomvc/architecture-examples/reducers
npm install
```

You'll also need [Browserify][].

```sh
npm install -g browserify
```

## Usage

```sh
cd todomvc/architecture-examples/reducers
npm run browserify
```

Unfortunately [Browserify][browserify] watch is [broken on OSX 10.7][watch bug], but
there is a [fix][watch fix] that did not made it to upstream yet. As a
temporary workaround you could use that fix to get watch working:

```
git clone https://github.com/substack/node-browserify.git
cd node-browserify
curl https://github.com/substack/node-browserify/pull/190.patch | git am
npm install -g
```

[node]:http://nodejs.org/
[npm]:http://npmjs.org/
[browserify]:https://github.com/substack/node-browserify
[watch bug]:https://github.com/substack/node-browserify/issues/166
[watch fix]:https://github.com/substack/node-browserify/pull/190

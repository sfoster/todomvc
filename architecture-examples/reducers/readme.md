# [TodoMVC](http://todomvc.com) using reducers

## Install

```sh
npm install
```

## Usage

```sh
npm run browserify
```

Unfortunately [browserify][] watch is [broken on OSX 10.7][watch bug], but
there is a [fix][watch fix] that did not made it to upstream yet. As a
temporary workaround you could use that fix to get watch working:

```
git clone https://github.com/substack/node-browserify.git
cd node-browserify
curl https://github.com/substack/node-browserify/pull/190.patch | git am
npm install -g
```


[browserify]:https://github.com/substack/node-browserify
[watch bug]:https://github.com/substack/node-browserify/issues/166
[watch fix]:https://github.com/substack/node-browserify/pull/190

<p align="center">
<img src="./public/icon.png" width="200px"/>
</p>

# moyu

A mininal JavaScript frontend UI framework, build for fun. Still in process...

A very BETA release: https://www.npmjs.com/package/@moyujs/moyu <br/>

Installation:

```
npm i @moyujs/moyu
```

Objectives:

- [ ] Virtual DOM

  - [x] vDOM object [h.js](./packages/runtime/src/h.js)
  - [x] Mount vDOM [mount-dom.js](./packages/runtime/src/mount-dom.js)
  - [x] Destroy DOM [destroy-dom.js](./packages/runtime/src/destroy-dom.js)
  - [ ] Documentations
  - [ ] Testings

- [ ] State Management

  - [x] Dispatcher [dispatcher.js](./packages/runtime/src/dispatcher.js)
  - [x] CreateApp function
  - [ ] Documentations
  - [ ] Testings

- [ ] Reconciliation

  - [x] Array difference detection and modification sequence generation [arrays.js](./packages/runtime/src/utils/arrays.js)
  - [x] Object difference detection [objects.js](./packages/runtime/src/utils/objects.js)
  - [x] DOM patching [patch-dom.js](./packages/runtime/src/patch-dom.js)
  - [ ] Documentation
  - [x] Testing [**tests**](./packages/runtime/src/__tests__/)

- [ ] Stateful Component

  - [ ] Components definition [component.js](./packages/runtime/src/component.js)

- [ ] Examples
  - [x] tictactoe @0.0.2

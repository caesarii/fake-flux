# 一种 Flux 实现

### Dispatch
- register
- unregister
- waitFor
- dispatch
- isDispatching



dispatcher 的功能: register callback, dispatch action and invoke callback

store 的功能: emit change when dispatch, add listener for change event



### Dispatch

```
const dispatch = {
    _callbacks = [],

    register(callback) {
        _callbacks.push(callback)
    }

    dispatch(payload) {
        _callback[type].forEach(callback => {callback(payload)})
    }
}
```

### store

class Store {
    constructor() {
        this._state = this.getInitialState()
        dispatch.register(this.reduce)
    }

    getInitialState() {

    }

    getState() {
        return this._state
    }

    reduce(state, action) {
        const newState = state

        // ...

        return newState
    }
}

#### container
class View exends React.component {
    getStores() {

    }

    calculateState() {

    }

}

### create
function create() {

}
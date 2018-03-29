const flux = require('../dist/Flux')
const fluxUtils = require('../dist/FluxUtils')

const {Dispatcher} = flux
const {Container: {create, }, Store, ReduceStore, } = fluxUtils
const log = console.log

const testDispatcher = () => {
        const testRegisterAndDispatch = () => {
        const d = new Dispatcher()
    
        const callback1 = (payload) => {
            console.log('callback 1', payload)
        }
        
        const callback2 = (payload) => {
            console.log('callback 2', payload)
        }
        d.register(callback1)
        d.register(callback2)
        
        const action1 = {
            type: 'one',
            data: 'action 1'
        }
        
        const action2 = {
            type: 'two',
            data: 'action 2'
        }
        d.dispatch(action1)
        d.dispatch(action2)
    }
    
        const testAction = () => {
            const d = new Dispatcher()
        
            const callback1 = (payload) => {
                if(payload.type === 'one') {
                    console.log('callback 1', payload)
                }
            }
            
            const callback2 = (payload) => {
                if(payload.type === 'two') {
                    console.log('callback 2', payload)
                }
            }
            d.register(callback1)
            d.register(callback2)
            
            const action1 = {
                type: 'one',
                data: 'action 1'
            }
            
            const action2 = {
                type: 'two',
                data: 'action 2'
            }
            d.dispatch(action1)
            d.dispatch(action2)
        }
        
        const testUnregister = () => {
            const d = new Dispatcher()
        
            const callback1 = (payload) => {
                console.log('callback 1', payload)
            }
            
            const id1 = d.register(callback1)
            
            const action1 = {
                type: 'one',
                data: 'action 1'
            }
            
            d.dispatch(action1)
            
            d.unregister(id1)
            
            d.dispatch(action1)
        }
        
        const testIsdispatching = () => {
            const d = new Dispatcher()
        
            const callback1 = (payload) => {
                console.log('callback 1', payload)
                console.log('isDispatching', d.isDispatching())
            }
            
            const id1 = d.register(callback1)
            
            const action1 = {
                type: 'one',
                data: 'action 1'
            }
            
            console.log('isDispatching', d.isDispatching())
            d.dispatch(action1)
            console.log('isDispatching', d.isDispatching())
        }
    
        const testWaitFor = () => {
            const d = new Dispatcher()
        
            const callback1 = (payload) => {
                d.waitFor([id2])
                console.log('callback 1', payload)
            }
            
            const callback2 = (payload) => {
                console.log('callback 2', payload)
            }
            
            const id1 = d.register(callback1)
            const id2 = d.register(callback2)
            
            console.log('id', id1, id2)
            
            const action1 = {
                type: 'one',
                data: 'action 1'
            }
            
            d.dispatch(action1)
            
            
        }
        
        testRegisterAndDispatch()
    
        testAction()
    
        testUnregister()
    
        testIsdispatching()
    
        testWaitFor()
    }
    
const testReduceStore = () => {
        const testGetState = () => {
            const d = new Dispatcher()
            
            class Store extends ReduceStore {
                constructor(d) {
                    super(d)
                    
                }
                
                getInitialState() {
                    return {
                        name: 'qinghe',
                    }
                }
                
                reduce(state, action) {
                    const {type, data} = action
                    switch(type) {
                        case 'click':
                            log('action click', data)
                            return {...state, ...data}
                        case 'dblclick':
                            log('action dblclick', data)
                            return {...state, ...data}
                        default:
                            state
                    }
                }
            }
            
            const s = new Store(d)
            
            
            const initailState = s.getInitialState()
            log('init state', initailState)
            
            const actionClick = {
                type: 'click',
                data: {
                    click: 'click event'
                }
            }
            d.dispatch(actionClick)
            
            const newState = s.getState()
            console.log('new state', newState)
        }
    
    
        const testStoreChange = () => {
            const d = new Dispatcher()
        
            const log = console.log
            
            class Store extends ReduceStore {
                constructor(d) {
                    super(d)
                    
                }
                
                getInitialState() {
                    return {
                        name: 'qinghe',
                    }
                }
                
                reduce(state, action) {
                    const {type, data} = action
                    switch(type) {
                        case 'click':
                            log('action click', data)
                            return {...state, ...data}
                        case 'dblclick':
                            log('action dblclick', data)
                          
                            return {...state, ...data}
                        default:
                            state
                    }
                }
            }
            
            const s = new Store(d)
            
            const callbackStoreChange = () => {
                console.log('callback store change')
            }
            
            s.addListener(callbackStoreChange)
            
            const actionClick = {
                type: 'click',
                data: {
                    click: 'click event'
                }
            }
            d.dispatch(actionClick)
        }
        
        testGetState()
    
        testStoreChange()
    }
    
const testStore = () => {
        const testEmitter = () => {
            const d = new Dispatcher()
    
            const fluxStore = new Store(d)
            fluxStore.addListener(() => {
                log('callback store change')
            })
            
            fluxStore.__emitChange()
        }
    
        testEmitter()
    }
    
if(require.main === module) {
    testDispatcher()
    
    testReduceStore()
    
    testStore()
}
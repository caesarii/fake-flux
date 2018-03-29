
const FluxStore = require('./FluxStore')
import Dispatcher from '../Dispatcher'
// Store 的基类
// 核心就是 _onDispatch 方法, 该方法将注册到 dispatcher
// 在 dispatch 之后, onDispatch 将调用 reduce 更新状态, 并触发 store change 事件
class FluxReduceStore extends FluxStore {
    constructor(dispatcher) {
        super(dispatcher)
        this._state = this.getInitialState()
    }
    
    // 返回 store 的初始状态
    // 在 store 创建时调用一次
    // 子类必须实现该方法
    getInitialState() {
    
    }
    
    // 返回 store 的全部状态
    // 如果 state 不是 immutable, 子类应该实现该方法, 避免暴露 _state
    getState() {
        return this._state
    }
    
    // 根据 action 返回状态
    // 子类必须实现该方法
    reduce(state, action) {
    
    }
    
    // 比较两个 state 对象是否相同
    // 如果 state 不是 immutable, 子类应该实现该方法
    areEqual(one, two) {
        return one === two
    }
    
    // 在 store 初始化时注册为 dispatcher 的回调
    __onDispatch(action) {
        // TODO 应该对 changed 和 emitter 进行封装
        // before change
        this.__setChanged(false)
        
        // reduce state
        const startState = this._state
        // endState 不能是 undefined
        const endState = this.reduce(startState, action)
        
        // 更新状态: 更新状态的方式以 新状态 代替 旧状态
        // 通过 areEqual 可以改变更新方式
        if(!this.areEqual(startState, endState)) {
            this._state = endState
            this.__setChanged(true)
        }
        
        // 触发 change 事件
        if(this.hasChanged()) {
            this.__emitChange()
        }
    }
}

module.exports = FluxReduceStore

if(require.main === module) {
    const Dispatcher = require('../Dispatcher')
    const log = console.log

    const testGetState = () => {
        const d = new Dispatcher()
        
        class Store extends FluxReduceStore {
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
        
        class Store extends FluxReduceStore {
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
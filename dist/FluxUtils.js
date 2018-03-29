/**
 * Flux v3.1.3
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["FluxUtils"] = factory();
	else
		root["FluxUtils"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	module.exports.Container = __webpack_require__(1);
	module.exports.ReduceStore = __webpack_require__(4);
	module.exports.Store = __webpack_require__(5);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	        var source = arguments[i];for (var key in source) {
	            if (Object.prototype.hasOwnProperty.call(source, key)) {
	                target[key] = source[key];
	            }
	        }
	    }return target;
	};

	function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	        throw new TypeError('Cannot call a class as a function');
	    }
	}

	function _inherits(subClass, superClass) {
	    if (typeof superClass !== 'function' && superClass !== null) {
	        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
	    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var FluxContainerSubscripts = __webpack_require__(2);
	// const {Component} = require('react')
	// const shallowEqual = require('shallowEqual')

	var DEFAULT_OPTIONS = {
	    pure: true,
	    withProps: false,
	    withContext: false
	};

	// Base 是一个 ReactComponent, 有 getStores 和 calculateState 两个静态方法
	// getStores 返回 FluxStore 的数组
	// getState 返回 state 对象
	// create 创建了 Base 的子类, 通过子类调用父类的生命周期函数

	function create(Base) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    // options
	    var realOptions = _extends({}, DEFAULT_OPTIONS, options);

	    var calculateState = function calculateState(state, maybeProps, maybeContext) {
	        var props = realOptions.withProps ? maybeProps : undefined;
	        var context = realOptions.withContext ? maybeContext : undefined;
	        return Base.calculateState(state, props, context);
	    };

	    var getStores = function getStores(maybeProps, maybeContext) {
	        var props = realOptions.withProps ? maybeProps : undefined;
	        var context = realOptions.withContext ? maybeContext : undefined;
	        return Base.getStores(props, context);
	    };

	    // 为什么会有 context 参数

	    var ContainerClass = (function (_Base) {
	        _inherits(ContainerClass, _Base);

	        function ContainerClass(props, context) {
	            var _this = this;

	            _classCallCheck(this, ContainerClass);

	            _Base.call(this, props, context);
	            this._subscriptions = new FluxContainerSubscripts();
	            // 设置 stores
	            this._subscriptions.setStores(getStores(props));
	            // 注册 subscription 的回调
	            this._subscriptions.addListener(function () {
	                _this.setState(function (prevState, currentProps) {
	                    calculateState(prevState, currentProps, context);
	                });
	            });

	            // ?
	            var calculatedState = calculateState(undefined, props, context);
	            this.state = _extends({}, this.state || {}, calculatedState);
	        }

	        // TODO pure container

	        // update container name

	        ContainerClass.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
	            if (_Base.prototype.componentWillReceiveProps) {
	                _Base.prototype.componentWillReceiveProps.call(this, nextProps, nextContext);
	            }

	            if (realOptions.withProps || realOptions.withContext) {
	                // update store and state
	                this._subscriptions.setStores(getStores(nextProps, nextContext));
	                this.setState(function (prevState) {
	                    return calculateState(prevState, nextProps, nextContext);
	                });
	            }
	        };

	        ContainerClass.prototype.componentWillUnmount = function componentWillUnmount() {
	            if (_Base.prototype.componentWillUnmount) {
	                _Base.prototype.componentWillUnmount.call(this);
	            }

	            this._subscriptions.reset();
	        };

	        return ContainerClass;
	    })(Base);

	    var componentName = Base.displayName || Base.name;
	    ContainerClass.displayName = 'FluxContainer(' + componentName + ')';
	    return ContainerClass;
	}

	module.exports = { create: create };

	// TODO delete ?

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	// import FluxStore from 'FluxStore'
	'use strict';

	function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	        throw new TypeError('Cannot call a class as a function');
	    }
	}

	var FluxStoreGroup = __webpack_require__(3);

	function shallowArrayEqual(a, b) {
	    if (a === b) {
	        return true;
	    }

	    if (a.length !== b.length) {
	        return false;
	    }

	    for (var i = 0; i < a.length; i++) {
	        if (a[i] !== b[i]) {
	            return false;
	        }
	    }
	    return true;
	}

	// FluxContainerSubscriptions 用于组织一组 store 与 一个 container 的状态更新

	var FluxContainerSubscriptions = (function () {
	    function FluxContainerSubscriptions() {
	        _classCallCheck(this, FluxContainerSubscriptions);

	        this._callbacks = [];
	        this._storeGroup = null;
	        this._stores = null;
	        // 所有 store change 事件的回调句柄
	        this.tokens = [];
	    }

	    FluxContainerSubscriptions.prototype.setStores = function setStores(stores) {
	        var _this = this;

	        // subscriptions 是对 store 进行组织, 不考虑 state 的变化?
	        // 如果当前 stores 与之前的 stores 相同 (浅比较) 则不更新
	        if (this._stores && shallowArrayEqual(this._stores, stores)) {
	            return;
	        }

	        this._stores = stores;
	        this._resetTokens();
	        this._resetStoreGroup();

	        var changed = false;
	        // 注册所有 store 的 change 事件
	        this._tokens = stores.map(function (store) {
	            store.addListener(function () {
	                changed = true;
	            });
	        });

	        // 所有 store 更新完之后的回调
	        var callCallbacks = function callCallbacks() {
	            if (changed) {
	                _this._callbacks.forEach(function (fn) {
	                    return fn();
	                });
	                changed = false;
	            }
	        };

	        // 在 store change 之后
	        this._storeGroup = new FluxStoreGroup(stores, callCallbacks);
	    };

	    FluxContainerSubscriptions.prototype.addListener = function addListener(fn) {
	        this._callbacks.push(fn);
	    };

	    FluxContainerSubscriptions.prototype.reset = function reset() {
	        this._resetTokens();
	        this._resetStoreGroup();
	        this._resetCallbacks();
	        this._resetStores();
	    };

	    FluxContainerSubscriptions.prototype._resetTokens = function _resetTokens() {
	        if (this._tokens) {
	            this._tokens.forEach(function (token) {
	                return token.remove();
	            });
	            this._tokens = null;
	        }
	    };

	    FluxContainerSubscriptions.prototype._resetStoreGroup = function _resetStoreGroup() {
	        if (this._storeGroup) {
	            this._storeGroup.release();
	            this._storeGroup = null;
	        }
	    };

	    FluxContainerSubscriptions.prototype._resetStores = function _resetStores() {
	        this._stores = null;
	    };

	    FluxContainerSubscriptions.prototype._resetCallbacks = function _resetCallbacks() {
	        this._callbacks = [];
	    };

	    return FluxContainerSubscriptions;
	})();

	module.exports = FluxContainerSubscriptions;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	// import Dispatcher from 'Dispatcher'
	// import FluxStore from 'FluxStore'
	"use strict";

	function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	        throw new TypeError("Cannot call a class as a function");
	    }
	}

	function _getUniformDispatcher(stores, Dispatcher) {
	    // 所有 store 应该使用 同一个 dispatcher
	    var dispatcher = stores[0].getDispatcher();
	    return dispatcher;
	}

	// FluxStoreGroup 类组织 store 的执行顺序
	// 每次 dispatch 时, 先对 stores 指定的一组 store 进行更新, 然后执行 callback

	var FluxStoreGroup = (function () {
	    function FluxStoreGroup(stores, callback) {
	        var _this = this;

	        _classCallCheck(this, FluxStoreGroup);

	        this._dispatcher = _getUniformDispatcher(stores);

	        // store 的 dispatch token
	        var storeTokens = stores.map(function (store) {
	            return store.getDispatchToken();
	        });
	        this._dispatchToken = this._dispatcher.register(function (payload) {
	            _this._dispatcher.waitFor(storeTokens);
	            callback();
	        });
	    }

	    FluxStoreGroup.prototype.release = function release() {
	        this._dispatcher.unregister(this._dispatchToken);
	    };

	    return FluxStoreGroup;
	})();

	module.exports = FluxStoreGroup;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	// import Dispatcher from 'Dispatcher'
	'use strict';

	function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	        throw new TypeError('Cannot call a class as a function');
	    }
	}

	function _inherits(subClass, superClass) {
	    if (typeof superClass !== 'function' && superClass !== null) {
	        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
	    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var FluxStore = __webpack_require__(5);
	// Store 的基类
	// 核心就是 _onDispatch 方法, 该方法将注册到 dispatcher
	// 在 dispatch 之后, onDispatch 将调用 reduce 更新状态, 并触发 store change 事件

	var FluxReduceStore = (function (_FluxStore) {
	    _inherits(FluxReduceStore, _FluxStore);

	    function FluxReduceStore(dispatcher) {
	        _classCallCheck(this, FluxReduceStore);

	        _FluxStore.call(this, dispatcher);
	        this._state = this.getInitialState();
	    }

	    // 返回 store 的初始状态
	    // 在 store 创建时调用一次
	    // 子类必须实现该方法

	    FluxReduceStore.prototype.getInitialState = function getInitialState() {};

	    // 返回 store 的全部状态
	    // 如果 state 不是 immutable, 子类应该实现该方法, 避免暴露 _state

	    FluxReduceStore.prototype.getState = function getState() {
	        return this._state;
	    };

	    // 根据 action 返回状态
	    // 子类必须实现该方法

	    FluxReduceStore.prototype.reduce = function reduce(state, action) {};

	    // 比较两个 state 对象是否相同
	    // 如果 state 不是 immutable, 子类应该实现该方法

	    FluxReduceStore.prototype.areEqual = function areEqual(one, two) {
	        return one === two;
	    };

	    // 在 store 初始化时注册为 dispatcher 的回调

	    FluxReduceStore.prototype.__onDispatch = function __onDispatch(action) {
	        // TODO 应该对 changed 和 emitter 进行封装
	        // before change
	        this.__setChanged(false);

	        // reduce state
	        var startState = this._state;
	        // endState 不能是 undefined
	        var endState = this.reduce(startState, action);

	        // 更新状态: 更新状态的方式以 新状态 代替 旧状态
	        // 通过 areEqual 可以改变更新方式
	        if (!this.areEqual(startState, endState)) {
	            this._state = endState;
	            this.__setChanged(true);
	        }

	        // 触发 change 事件
	        if (this.hasChanged()) {
	            this.__emitChange();
	        }
	    };

	    return FluxReduceStore;
	})(FluxStore);

	module.exports = FluxReduceStore;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	// import Dispatcher from 'Dispatcher'
	// TODO 用 nodejs eventemitter 进行测试
	// !!!!!!!!!!!! 更新 addListener 中的 on 为 addListener
	'use strict';

	function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	        throw new TypeError('Cannot call a class as a function');
	    }
	}

	var _require = __webpack_require__(6);

	var EventEmitter = _require.EventEmitter;

	// const Events = require('events')
	// class EventEmitter extends Events { }

	// FluxReduceStore 的 基类
	// 核心就是初始化时将 FluxReduceStore 的 _onDispatch 注册到 dispatcher
	// 提供订阅 store change 事件的 addListenr api
	// 以及供 FluxReduceStore 调用的 hasChanged, setChanged, emitChange 方法

	// 实际使用时继承 FluxReduceStore

	var FluxStore = (function () {
	    function FluxStore(dispatcher) {
	        var _this = this;

	        _classCallCheck(this, FluxStore);

	        // 子类可用的属性
	        this.__className = this.constructor.name;

	        this.__changed = false;
	        this.__changeEvent = 'change';
	        this.__dispatcher = dispatcher;
	        this.__emitter = new EventEmitter();

	        // 私有属性

	        // 将 __onDispatch 注册为 dispatcher 的回调 返回callback id
	        this._dispatchToken = dispatcher.register(function (payload) {
	            _this.__onDispatch(payload);
	        });
	    }

	    // 子类必须实现该方法
	    // 初始化时该 callback 注册到 dispatcher
	    // 该方法是 store 接受新数据的唯一方法

	    FluxStore.prototype.__onDispatch = function __onDispatch(payload) {};

	    // 获取 dispatcher

	    FluxStore.prototype.getDispatcher = function getDispatcher() {
	        return this.__dispatcher;
	    };

	    // 获取

	    FluxStore.prototype.getDispatchToken = function getDispatchToken() {
	        return this._dispatchToken;
	    };

	    // 判断 store 在最近的 dispatch 后是否已更新

	    FluxStore.prototype.hasChanged = function hasChanged() {
	        return this.__changed;
	    };

	    FluxStore.prototype.__setChanged = function __setChanged(bool) {
	        this.__changed = bool;
	    };

	    FluxStore.prototype.__emitChange = function __emitChange() {
	        this.__emitter.emit(this.__changeEvent);
	    };

	    // 注册 change 事件
	    // 返回 token 对象, token.remove() 将移除注册

	    FluxStore.prototype.addListener = function addListener(callback) {
	        return this.__emitter.addListener(this.__changeEvent, callback);
	    };

	    return FluxStore;
	})();

	module.exports = FluxStore;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	var fbemitter = {
	  EventEmitter: __webpack_require__(7),
	  EmitterSubscription: __webpack_require__(8)
	};

	module.exports = fbemitter;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule BaseEventEmitter
	 * @typechecks
	 */

	'use strict';

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	}

	var EmitterSubscription = __webpack_require__(8);
	var EventSubscriptionVendor = __webpack_require__(10);

	var emptyFunction = __webpack_require__(12);
	var invariant = __webpack_require__(11);

	/**
	 * @class BaseEventEmitter
	 * @description
	 * An EventEmitter is responsible for managing a set of listeners and publishing
	 * events to them when it is told that such events happened. In addition to the
	 * data for the given event it also sends a event control object which allows
	 * the listeners/handlers to prevent the default behavior of the given event.
	 *
	 * The emitter is designed to be generic enough to support all the different
	 * contexts in which one might want to emit events. It is a simple multicast
	 * mechanism on top of which extra functionality can be composed. For example, a
	 * more advanced emitter may use an EventHolder and EventFactory.
	 */

	var BaseEventEmitter = (function () {
	  /**
	   * @constructor
	   */

	  function BaseEventEmitter() {
	    _classCallCheck(this, BaseEventEmitter);

	    this._subscriber = new EventSubscriptionVendor();
	    this._currentSubscription = null;
	  }

	  /**
	   * Adds a listener to be invoked when events of the specified type are
	   * emitted. An optional calling context may be provided. The data arguments
	   * emitted will be passed to the listener function.
	   *
	   * TODO: Annotate the listener arg's type. This is tricky because listeners
	   *       can be invoked with varargs.
	   *
	   * @param {string} eventType - Name of the event to listen to
	   * @param {function} listener - Function to invoke when the specified event is
	   *   emitted
	   * @param {*} context - Optional context object to use when invoking the
	   *   listener
	   */

	  BaseEventEmitter.prototype.addListener = function addListener(eventType, listener, context) {
	    return this._subscriber.addSubscription(eventType, new EmitterSubscription(this._subscriber, listener, context));
	  };

	  /**
	   * Similar to addListener, except that the listener is removed after it is
	   * invoked once.
	   *
	   * @param {string} eventType - Name of the event to listen to
	   * @param {function} listener - Function to invoke only once when the
	   *   specified event is emitted
	   * @param {*} context - Optional context object to use when invoking the
	   *   listener
	   */

	  BaseEventEmitter.prototype.once = function once(eventType, listener, context) {
	    var emitter = this;
	    return this.addListener(eventType, function () {
	      emitter.removeCurrentListener();
	      listener.apply(context, arguments);
	    });
	  };

	  /**
	   * Removes all of the registered listeners, including those registered as
	   * listener maps.
	   *
	   * @param {?string} eventType - Optional name of the event whose registered
	   *   listeners to remove
	   */

	  BaseEventEmitter.prototype.removeAllListeners = function removeAllListeners(eventType) {
	    this._subscriber.removeAllSubscriptions(eventType);
	  };

	  /**
	   * Provides an API that can be called during an eventing cycle to remove the
	   * last listener that was invoked. This allows a developer to provide an event
	   * object that can remove the listener (or listener map) during the
	   * invocation.
	   *
	   * If it is called when not inside of an emitting cycle it will throw.
	   *
	   * @throws {Error} When called not during an eventing cycle
	   *
	   * @example
	   *   var subscription = emitter.addListenerMap({
	   *     someEvent: function(data, event) {
	   *       console.log(data);
	   *       emitter.removeCurrentListener();
	   *     }
	   *   });
	   *
	   *   emitter.emit('someEvent', 'abc'); // logs 'abc'
	   *   emitter.emit('someEvent', 'def'); // does not log anything
	   */

	  BaseEventEmitter.prototype.removeCurrentListener = function removeCurrentListener() {
	    !!!this._currentSubscription ?  true ? invariant(false, 'Not in an emitting cycle; there is no current subscription') : invariant(false) : undefined;
	    this._subscriber.removeSubscription(this._currentSubscription);
	  };

	  /**
	   * Returns an array of listeners that are currently registered for the given
	   * event.
	   *
	   * @param {string} eventType - Name of the event to query
	   * @return {array}
	   */

	  BaseEventEmitter.prototype.listeners = function listeners(eventType) /* TODO: Array<EventSubscription> */{
	    var subscriptions = this._subscriber.getSubscriptionsForType(eventType);
	    return subscriptions ? subscriptions.filter(emptyFunction.thatReturnsTrue).map(function (subscription) {
	      return subscription.listener;
	    }) : [];
	  };

	  /**
	   * Emits an event of the given type with the given data. All handlers of that
	   * particular type will be notified.
	   *
	   * @param {string} eventType - Name of the event to emit
	   * @param {*} Arbitrary arguments to be passed to each registered listener
	   *
	   * @example
	   *   emitter.addListener('someEvent', function(message) {
	   *     console.log(message);
	   *   });
	   *
	   *   emitter.emit('someEvent', 'abc'); // logs 'abc'
	   */

	  BaseEventEmitter.prototype.emit = function emit(eventType) {
	    var subscriptions = this._subscriber.getSubscriptionsForType(eventType);
	    if (subscriptions) {
	      var keys = Object.keys(subscriptions);
	      for (var ii = 0; ii < keys.length; ii++) {
	        var key = keys[ii];
	        var subscription = subscriptions[key];
	        // The subscription may have been removed during this event loop.
	        if (subscription) {
	          this._currentSubscription = subscription;
	          this.__emitToSubscription.apply(this, [subscription].concat(Array.prototype.slice.call(arguments)));
	        }
	      }
	      this._currentSubscription = null;
	    }
	  };

	  /**
	   * Provides a hook to override how the emitter emits an event to a specific
	   * subscription. This allows you to set up logging and error boundaries
	   * specific to your environment.
	   *
	   * @param {EmitterSubscription} subscription
	   * @param {string} eventType
	   * @param {*} Arbitrary arguments to be passed to each registered listener
	   */

	  BaseEventEmitter.prototype.__emitToSubscription = function __emitToSubscription(subscription, eventType) {
	    var args = Array.prototype.slice.call(arguments, 2);
	    subscription.listener.apply(subscription.context, args);
	  };

	  return BaseEventEmitter;
	})();

	module.exports = BaseEventEmitter;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 * 
	 * @providesModule EmitterSubscription
	 * @typechecks
	 */

	'use strict';

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== 'function' && superClass !== null) {
	    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var EventSubscription = __webpack_require__(9);

	/**
	 * EmitterSubscription represents a subscription with listener and context data.
	 */

	var EmitterSubscription = (function (_EventSubscription) {
	  _inherits(EmitterSubscription, _EventSubscription);

	  /**
	   * @param {EventSubscriptionVendor} subscriber - The subscriber that controls
	   *   this subscription
	   * @param {function} listener - Function to invoke when the specified event is
	   *   emitted
	   * @param {*} context - Optional context object to use when invoking the
	   *   listener
	   */

	  function EmitterSubscription(subscriber, listener, context) {
	    _classCallCheck(this, EmitterSubscription);

	    _EventSubscription.call(this, subscriber);
	    this.listener = listener;
	    this.context = context;
	  }

	  return EmitterSubscription;
	})(EventSubscription);

	module.exports = EmitterSubscription;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule EventSubscription
	 * @typechecks
	 */

	'use strict';

	/**
	 * EventSubscription represents a subscription to a particular event. It can
	 * remove its own subscription.
	 */

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	}

	var EventSubscription = (function () {

	  /**
	   * @param {EventSubscriptionVendor} subscriber the subscriber that controls
	   *   this subscription.
	   */

	  function EventSubscription(subscriber) {
	    _classCallCheck(this, EventSubscription);

	    this.subscriber = subscriber;
	  }

	  /**
	   * Removes this subscription from the subscriber that controls it.
	   */

	  EventSubscription.prototype.remove = function remove() {
	    if (this.subscriber) {
	      this.subscriber.removeSubscription(this);
	      this.subscriber = null;
	    }
	  };

	  return EventSubscription;
	})();

	module.exports = EventSubscription;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 * 
	 * @providesModule EventSubscriptionVendor
	 * @typechecks
	 */

	'use strict';

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	}

	var invariant = __webpack_require__(11);

	/**
	 * EventSubscriptionVendor stores a set of EventSubscriptions that are
	 * subscribed to a particular event type.
	 */

	var EventSubscriptionVendor = (function () {
	  function EventSubscriptionVendor() {
	    _classCallCheck(this, EventSubscriptionVendor);

	    this._subscriptionsForType = {};
	    this._currentSubscription = null;
	  }

	  /**
	   * Adds a subscription keyed by an event type.
	   *
	   * @param {string} eventType
	   * @param {EventSubscription} subscription
	   */

	  EventSubscriptionVendor.prototype.addSubscription = function addSubscription(eventType, subscription) {
	    !(subscription.subscriber === this) ?  true ? invariant(false, 'The subscriber of the subscription is incorrectly set.') : invariant(false) : undefined;
	    if (!this._subscriptionsForType[eventType]) {
	      this._subscriptionsForType[eventType] = [];
	    }
	    var key = this._subscriptionsForType[eventType].length;
	    this._subscriptionsForType[eventType].push(subscription);
	    subscription.eventType = eventType;
	    subscription.key = key;
	    return subscription;
	  };

	  /**
	   * Removes a bulk set of the subscriptions.
	   *
	   * @param {?string} eventType - Optional name of the event type whose
	   *   registered supscriptions to remove, if null remove all subscriptions.
	   */

	  EventSubscriptionVendor.prototype.removeAllSubscriptions = function removeAllSubscriptions(eventType) {
	    if (eventType === undefined) {
	      this._subscriptionsForType = {};
	    } else {
	      delete this._subscriptionsForType[eventType];
	    }
	  };

	  /**
	   * Removes a specific subscription. Instead of calling this function, call
	   * `subscription.remove()` directly.
	   *
	   * @param {object} subscription
	   */

	  EventSubscriptionVendor.prototype.removeSubscription = function removeSubscription(subscription) {
	    var eventType = subscription.eventType;
	    var key = subscription.key;

	    var subscriptionsForType = this._subscriptionsForType[eventType];
	    if (subscriptionsForType) {
	      delete subscriptionsForType[key];
	    }
	  };

	  /**
	   * Returns the array of subscriptions that are currently registered for the
	   * given event type.
	   *
	   * Note: This array can be potentially sparse as subscriptions are deleted
	   * from it when they are removed.
	   *
	   * TODO: This returns a nullable array. wat?
	   *
	   * @param {string} eventType
	   * @return {?array}
	   */

	  EventSubscriptionVendor.prototype.getSubscriptionsForType = function getSubscriptionsForType(eventType) {
	    return this._subscriptionsForType[eventType];
	  };

	  return EventSubscriptionVendor;
	})();

	module.exports = EventSubscriptionVendor;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var validateFormat = function validateFormat(format) {};

	if (true) {
	  validateFormat = function validateFormat(format) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  };
	}

	function invariant(condition, format, a, b, c, d, e, f) {
	  validateFormat(format);

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

	module.exports = invariant;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * 
	 */

	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	var emptyFunction = function emptyFunction() {};

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};

	module.exports = emptyFunction;

/***/ })
/******/ ])
});
;
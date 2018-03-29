/**
 * Flux v3.1.3
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Flux"] = factory();
	else
		root["Flux"] = factory();
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

	module.exports.Dispatcher = __webpack_require__(1);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	
	// dispatcher
	// register callback
	// dispatch action and invoke callback

	'use strict';

	function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	        throw new TypeError('Cannot call a class as a function');
	    }
	}

	var Dispatcher = (function () {
	    function Dispatcher() {
	        _classCallCheck(this, Dispatcher);

	        // 所有的 dispatch callback
	        this._callbacks = {};

	        // 是否正在 dispatch
	        this._isDispatching = false;

	        // 已经调用的回调
	        this._isHandled = {};

	        // 正在调用的回调
	        this._isPending = {};

	        // callback id
	        this._lastId = 1;

	        // payload
	        // TODO payload 怎么传进来
	        this._pendingPayload = null;

	        // 常量
	        this._prefix = 'ID_';
	    }

	    // 调用 callback, 保存状态

	    Dispatcher.prototype._invokeCallback = function _invokeCallback(id) {
	        // 正在调用
	        this._isPending[id] = true;
	        // 调用
	        this._callbacks[id](this._pendingPayload);
	        // 已调用
	        this._isHandled[id] = true;
	    };

	    // 设置 dispatching 状态

	    Dispatcher.prototype._startDispatching = function _startDispatching(payload) {
	        // 设置 callback 的状态
	        for (var id in this._callbacks) {
	            this._isPending[id] = false;
	            this._isHandled[id] = false;
	        }

	        // 设置 dispatcher 的状态
	        this._pendingPayload = payload;
	        this._isDispatching = true;
	    };

	    // 清除 dispatching 的状态

	    Dispatcher.prototype._stopDispatching = function _stopDispatching() {
	        delete this._pendingPayload;
	        this._isDispatching = false;
	    };

	    // 将 callback 注册为 dispatch 的回调
	    // 返回 token, 供 waitFor() 使用

	    Dispatcher.prototype.register = function register(callback) {
	        var id = this._prefix + this._lastId++;
	        this._callbacks[id] = callback;
	        return id;
	    };

	    // 取消注册

	    Dispatcher.prototype.unregister = function unregister(id) {
	        delete this._callbacks[id];
	    };

	    // 组织 callback 的执行顺序, 当前 callback 在执行的 callbacks 后执行
	    // 该方法只能由 callback 调用
	    // 可以指定多个等待的callback, 所以参数一个 id array

	    Dispatcher.prototype.waitFor = function waitFor(ids) {
	        for (var i = 0; i < ids.length; i++) {
	            var id = ids[i];

	            // 正在调用
	            if (this._isPending[id]) {
	                continue;
	            }

	            // 调用前置 callback
	            // 前置 callback 是指当前 callback 在等待的 callback
	            this._invokeCallback(id);
	        }
	    };

	    // 将事件分发到所有回调

	    Dispatcher.prototype.dispatch = function dispatch(payload) {
	        //
	        this._startDispatching(payload);
	        try {
	            // 调用所有的回调
	            for (var id in this._callbacks) {
	                // 已经在调用
	                if (this._isPending[id]) {
	                    continue;
	                }
	                // 调用
	                this._invokeCallback(id);
	            }
	        } finally {
	            this._stopDispatching();
	        }
	    };

	    // 是否正在 dispatch

	    Dispatcher.prototype.isDispatching = function isDispatching() {
	        return this._isDispatching;
	    };

	    return Dispatcher;
	})();

	module.exports = Dispatcher;

/***/ })
/******/ ])
});
;
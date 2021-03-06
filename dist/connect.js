'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = connect;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _state = require('./state');

var _state2 = _interopRequireDefault(_state);

var _config = require("./config");

var allowConsole = function allowConsole(_) {
  return (0, _config.isDev)() && !_config.muteConsole && typeof console !== 'undefined';
};

function noop() {}

/**
 * connect的作用在于，将给定的react class和指定的datasource连接。
 * 当state上发出'change'事件时，react实例对象能触发.
 */

function connect(clazz, data) {
  var datasource = data || _state2['default'];
  var on = function on(eventname, callback) {
    datasource.on(eventname, callback);
    return {
      remove: function remove() {
        datasource.removeListener(eventname, callback);
      }
    };
  };

  var origMidMount = clazz.prototype.componentDidMount || noop;
  var name = clazz.name;
  var handler, mHandler;
  clazz.prototype.componentDidMount = function () {
    var _this = this;

    handler = on('change', function () {
      /*eslint-disable no-console */
      allowConsole() && console.time && console.time(name + '渲染耗时');
      if (_this.__isUnmounted) return; // prevent forceUpdate an unmounted component
      _this.forceUpdate(function () {
        allowConsole() && console.timeEnd && console.timeEnd(name + '渲染耗时');
      });
      /*eslint-enable */
    });
    mHandler = on('message', function (data) {
      if (/no-update/.test(data.type)) {
        allowConsole() && console.log('调用了state的update方法但是未能触发页面更新,原因是传入值和已有值相同。 数据更新路径为' + data.path.join('/') + ", 传入值为" + JSON.stringify(data.value, null, 2));
      }
    });
    return origMidMount.call(this);
  };
  var origWillUmount = clazz.prototype.componentWillUnmount || noop;
  clazz.prototype.componentWillUnmount = function () {
    handler && handler.remove();
    mHandler && mHandler.remove();
    this.__isUnmounted = true;
    return origWillUmount.call(this);
  };

  return clazz;
}

module.exports = exports['default'];
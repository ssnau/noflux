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
  var handler;
  clazz.prototype.componentDidMount = function () {
    var _this = this;

    handler = on('change', function () {
      /*eslint-disable no-console */
      allowConsole() && console.time && console.time('全文档重渲染耗时');
      _this.forceUpdate(function () {
        allowConsole() && console.timeEnd && console.timeEnd('全文档重渲染耗时');
      });
      /*eslint-enable */
    });
    return origMidMount.call(this);
  };
  var origWillUmount = clazz.prototype.componentWillUnmount || noop;
  clazz.prototype.componentWillUnmount = function () {
    handler && handler.remove();
    return origWillUmount.call(this);
  };

  return clazz;
}

module.exports = exports['default'];
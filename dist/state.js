'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dataton = require('dataton');

var _dataton2 = _interopRequireDefault(_dataton);

// load initial state
var initialState = typeof window !== 'undefined' ? window._appState : {};

var state = new _dataton2['default'](initialState);
exports['default'] = state;

if (typeof window !== 'undefined') {
  window._state = state; // for debug
}
module.exports = exports['default'];
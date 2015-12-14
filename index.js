var _connect = require('./dist/connect');
var state = require('./dist/state');
var pure = require('./dist/pure2');
function connect(data) {
  // 如果传入的是Component Class，则直接connect它
  if (data && data.prototype && data.prototype.render) return _connect(data, state);
  return function(clazz) {
    return _connect(clazz, data);
  }
}
module.exports = {
  // decorators
  Connect: connect,
  connect: connect,
  pure: pure,
  state: state,
  State: require('dataton')
};

var connect = require('./dist/connect');
function connect(data) {
  // 如果传入的是Component Class，则直接connect它
  if (data && data.prototype && data.prototype.render) return connect(data);
  return function(clazz) {
    return connect(clazz, data);
  }
}
module.exports = {
  // decorators
  Connect: connect,
  connect: connect,
  state: require('./dist/state'),
  State: require('dataton')
};

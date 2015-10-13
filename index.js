var connect = require('./dist/connect');
module.exports = {
  // decorators
  Connect: function (data) {
    // 如果传入的是Component Class，则直接connect它
    if (data && data.prototype && data.prototype.render) return connect(data);
    return function(clazz) {
      return connect(clazz, data);
    }
  },
  state: require('./dist/state'),
  State: require('dataton')
};

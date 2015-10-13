module.exports = {
  // decorators
  Connect: function (data) {
    return function(clazz) {
      require('./dist/connect')(clazz, data);
    }
  },

  state: require('./dist/state'),
  State: require('state2')
};

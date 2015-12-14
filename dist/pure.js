'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function each(obj, fn) {
  Object.keys(obj).forEach(function (key) {
    fn(key, obj[key]);
  });
}

function noop() {}

function isCursor(val) {
  return typeof val === 'function' && val.get && val.update;
}

function shallowCompare(instance, nextProps, nextState) {
  return !shallowEqual(instance.props, nextProps) || !shallowEqual(instance.state, nextState);
}

/**
 * Performs equality by iterating through keys on an object and returning
 * false when any key has values which are not strictly equal between
 * objA and objB. Returns true when the values of all keys are strictly equal.
 *
 * @return {boolean}
 */
function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || !equal(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

function equal(a, b) {
  if (isCursor(a) && isCursor(b)) return a() === b();
  return a === b;
}

function scu(nextProps, nextState) {
  return shallowCompare(this, nextProps, nextState);
}

function pure(Clazz) {
  var React = require('react');
  if (Clazz.prototype.shouldComponentUpdate === scu) return Clazz;
  Clazz.prototype.shouldComponentUpdate = scu;

  // 包装一层

  var Wrapper = (function (_React$Component) {
    _inherits(Wrapper, _React$Component);

    function Wrapper() {
      _classCallCheck(this, Wrapper);

      _get(Object.getPrototypeOf(Wrapper.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Wrapper, [{
      key: 'render',
      value: function render() {
        var props = {};
        each(this.props, function (key, val) {
          props[key] = val;
          if (isCursor(val)) props['_cursor_val_' + key] = val();
        });
        return React.createElement(Clazz, props);
      }
    }]);

    return Wrapper;
  })(React.Component);

  return Wrapper;
}

module.exports = pure;
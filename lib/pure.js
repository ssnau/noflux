function each(obj, fn) {
    Object.keys(obj).forEach(function(key) {
       fn(key, obj[key]); 
    });
}

function noop(){}

function isCursor(val) {
    return typeof val === 'function' && val.get && val.update;
}

function shallowCompare(instance, nextProps, nextState) {
  return (
    !shallowEqual(instance.props, nextProps) ||
    !shallowEqual(instance.state, nextState)
  );
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
  

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
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
  Clazz.prototype.shouldComponentUpdate = scu;

  // 包装一层
  class Wrapper extends React.Component {
    render() {
      var props = {};
      each(this.props, function (key, val) {
        props[key] = val;
        if (isCursor(val)) props['_cursor_val_' + key]  = val();
      });
      return React.createElement(Clazz, props);
    }
  }
  return Wrapper;
}

module.exports = pure;

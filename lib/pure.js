const PROP = "__pure_props";
const NEXTPROP = "__pure_next_props";

function each(obj, fn) {
    Object.keys(obj).forEach(function(key) {
       fn(key, obj[key]); 
    });
}

function noop(){}

function isCursor(val) {
    return typeof val === 'function' && val.get && val.update;
}

/**
 * Performs equality by iterating through keys on an object and returning
 * false when any key has values which are not strictly equal between
 * objA and objB. Returns true when the values of all keys are strictly equal.
 *
 * @return {boolean}
 */
function shallowEqual(objA, objB) {
  if (objA === objB) return true;

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

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


function assignTo(iteratee, receiver) {
  each(iteratee, function (key, val) {
    receiver[key] = val;
    if (isCursor(val)) receiver['_cursor_val_' + key]  = val();
  });
}

function pure(Clazz) {
  if (typeof window === 'undefined') return Clazz;
  const rewrites = {
    'componentWillReceiveProps': function pureComponentWillReceiveProps(props) {
      this[NEXTPROP] = {};
      assignTo(props, this[NEXTPROP]); // sorry, `props` is readonly..
    },
    'shouldComponentUpdate': function pureShouldComponentUpdate(nextProps, nextState) {
      return (
        !shallowEqual(this[PROP] || {}, this[NEXTPROP] || {}) ||
        !shallowEqual(this.state, nextState)
      );
    },
    'componentWillMount': function pureComponentWillMount() {
      this[PROP] = {};
      assignTo(this.props, this[PROP]); // sorry, `this.props` is readonly..
    }
  };

  const proto = Clazz.prototype;
  each(rewrites, function (key, fn) {
    var originalFn = proto[key] || noop;
    proto[key] = function (a, b, c) {
      var val = originalFn.call(this, a, b, c);
      if (val === true || val === false) return val && fn.call(this, a, b, c);
      return fn.call(this, a, b);
    };
  });

  return Clazz;
}

module.exports = pure;

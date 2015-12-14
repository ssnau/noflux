import state from './state';
import {isDev, muteConsole} from "./config";

const allowConsole = _ => isDev() && !muteConsole && typeof console !== 'undefined';

function noop(){}

/**
 * connect的作用在于，将给定的react class和指定的datasource连接。
 * 当state上发出'change'事件时，react实例对象能触发.
 */
export default function connect(clazz, data) {
  var datasource = data || state;
  var on = function(eventname, callback) {
    datasource.on(eventname, callback);
    return {
      remove() {
        datasource.removeListener(eventname, callback);
      }
    }
  };

  var origMidMount = clazz.prototype.componentDidMount || noop;
  var name = clazz.name;
  var handler, mHandler;
  clazz.prototype.componentDidMount = function() {
    handler = on('change', () => {
      /*eslint-disable no-console */
      allowConsole() && console.time && console.time(name + '渲染耗时');
      if (this.__isUnmounted) return; // prevent forceUpdate an unmounted component
      this.forceUpdate(() => {
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

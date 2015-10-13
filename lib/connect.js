import state from './state';
import {isDev, muteConsole} from "./config";
import React from "react";

const allowConsole = isDev && !muteConsole && typeof console !== 'undefined';

if (typeof window !== 'undefined') window.React = React;

function noop(){}

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
  var handler;
  clazz.prototype.componentDidMount = function() {
    handler = on('change', () => {
      /*eslint-disable no-console */
      allowConsole && console.time && console.time('全文档重渲染耗时');
      this.forceUpdate(() => {
        allowConsole && console.timeEnd && console.timeEnd('全文档重渲染耗时');
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

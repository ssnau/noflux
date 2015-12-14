var jsdom = require('jsdom');
global.document = jsdom.jsdom('<html><body></body></html>');
global.window = document.defaultView;
global.navigator = window.navigator = {};
global.DEBUG = false;
global.navigator.userAgent = 'NodeJs JsDom';
global.navigator.appVersion = '';

window.SYNC_TIMEOUT = true;

/*
require('blanket')({
    pattern: 'dist'
});
*/

var expect = require('expect.js');
var sinon = require('sinon');
var assert = require('assert');
require('../dist/config').muteConsole = true; // mute console first
var noflux = require('../');
var state = noflux.state;
var React = require('react');
// mute console

var TestUtils = require('react-addons-test-utils');

describe('decorate', function () {

  it('Connect decorate should make the component fluxify', function () {
    var Connect = noflux.Connect;
    var state = noflux.state;
    var nameCursor = state.cursor('name');
    nameCursor.update('jack');

    @Connect
    class App extends React.Component {
      render() {
        return <h1 id={nameCursor()}></h1>;
      }
    }
    var component = TestUtils.renderIntoDocument(<App />);
    var node = TestUtils.findRenderedDOMComponentWithTag(component, 'h1')
    assert.equal(node.id, 'jack');
    state.cursor('name').update('john'); // will make the component rerender
    assert.equal(node.id, 'john');
  });

  it('you can connect to any datasource you want', function () {

    var Connect = noflux.Connect;
    var state = new noflux.State();
    var gstate = noflux.state;
    state.load({});
    var nameCursor = state.cursor('name');
    nameCursor.update('jack');

    @Connect(state)
    class App extends React.Component {
      render() {
        return <h1 id={nameCursor()}></h1>;
      }
    }
    var component = TestUtils.renderIntoDocument(<App />);
    var node = TestUtils.findRenderedDOMComponentWithTag(component, 'h1')
    assert.equal(node.id, 'jack');
    state.cursor('name').update('john'); // will make the component rerender
    gstate.cursor('name').update('ppp');
    assert.equal(node.id, 'john');
  });

  it('pure render only redraw when cursor value changes', function () {
    var pure = noflux.pure;
    var connect = noflux.connect;
    var state = new noflux.State();
    state.load({name: 'jack'});

    var itemRenderCount = 0;
    var appRenderCount = 0;

    @pure
    class Item extends React.Component {
      render() {
        itemRenderCount++;
        return <h1> hello </h1>
      }
    }
    
    @connect(state)
    class App extends React.Component {
      render() {
        appRenderCount++;
        return <Item data={state.cursor('name')} />
      }
    }

    var component = TestUtils.renderIntoDocument(<App />);
    assert.equal(appRenderCount, 1);
    assert.equal(itemRenderCount, 1);
    state.set('___', 100);  // a dumb property to force redraw
    assert.equal(appRenderCount, 2);
    assert.equal(itemRenderCount, 1); // item would not redraw
    state.set('name', 'johnson');
    assert.equal(appRenderCount, 3);
    assert.equal(itemRenderCount, 2); // item would not redraw
  });
});

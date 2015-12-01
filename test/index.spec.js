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
});

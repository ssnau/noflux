var jsdom = require('jsdom');
global.document = jsdom.jsdom('<html><body></body></html>');
global.window = document.defaultView;
global.navigator = window.navigator = {};
global.DEBUG = false;
global.navigator.userAgent = 'NodeJs JsDom';
global.navigator.appVersion = '';

window.SYNC_TIMEOUT = true;

require('blanket')({
    pattern: 'dist'
});

var expect = require('expect.js');
var sinon = require('sinon');
var assert = require('assert');
//require('../dist/config').muteConsole = true; // mute console first
var noflux = require('../');
var state = noflux.state;
var React = require('react/addons');
// mute console

var TestUtils = React.addons.TestUtils;

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
    assert.equal(node.getDOMNode().id, 'jack');
    state.cursor('name').update('john'); // will make the component rerender
    assert.equal(node.getDOMNode().id, 'john');
  });
});
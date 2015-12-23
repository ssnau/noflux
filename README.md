[![Build Status](https://travis-ci.org/ssnau/noflux.svg?branch=master)](https://travis-ci.org/ssnau/noflux)

noflux
--------

a simple top down data flow implementation.


install
----

```
npm install noflux
```

usage
-----

```
import {connect, state} from "noflux";
import React from "react";

state.load({
  name: 'jack'
});

@connect
export default class extends React.Component {
    render() {
        return (
            <div>
                <input onChange={e => state.set('name', e.target.value)} />
                <p> hello, my name is {state.get('name')} </p>
            </div>
        )
    }
}
```

The page will be refresh once the state changes.


API
-----

### connect

a function works as decrocation to bind a React class with `state`.
`state` will emit `change` event after its modification and the instance
of the class will be re-rendered.

### pure

a function works as decrocation to make a React class as a pure render component even though you pass cursors
as props.

### state

A instance of [dataton](http://npmjs.com/package/dataton) which implemented Copy-On-Write technique. You can:

- `load`: load data into state.
- `set`: set specific key-value for state.
- `get`: get the correspond value for the provided key.
- `cursor`: get the `cursor` from the provided path.



License
----

MIT


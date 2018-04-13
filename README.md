# Swill SDK

## Installation

_Prerequisites_:
- Node.js 8.11+
- npm 5.6+

1. Clone this repository
```shell
 git clone https://github.com/jonrhall/swill-sdk
```
2. Install
```shell
 npm install
```

## Some questions

### What is this?

A software development kit (SDK) for users who want to develop their own apps for a [CraftBeerPi3](https://github.com/Manuel83/craftbeerpi3) instance.

### Why is this needed?

CraftBeerPi3's API is complex and hard to manage on its own. This project aims to lower the barrier to entry for developers who want more control out of their existing CBPi instance beyond what it currently offers.


### Who would use it?

Anyone who loves CraftBeerPi3 already and wants to develop an app that controls or listens to CraftBeerPi3 in some custom way. That could be as simple as aNode app to create brewing notifications, or as complex as an entirely new, custom interface that you create for your own CraftBeerPi3 installation.

## Usage

Swill SDK can be used as both a Node module and a client-side library. When `npm install` is run, the client sdk is automatically bundled into `lib/swill-sdk.min.js`.

Keep in mind, you will always need a running CraftBeerPi3 instance for Swill SDK to talk to.

### Client-side

All that is needed to use Swill SDK in the browser is to include it in a script tag in your app:
```html
<script src="swill-sdk.min.js"></script>
```
The sdk itself will be available on the on global scope via `window.SwillSDK`.

### Node.js

Install the sdk as a dependency of your node project:
```shell
 npm i -D https://github.com/jonrhall/swill-sdk
```

Require it as part of your project:
```javascript
const SwillSDK = require('swill-sdk');

... do something
```

## Example SDK client

```javascript
// Import the library
const SwillSDK = require('swill-sdk');

// Instantiate a sdk client
const sdk = SwillSDK();

// Do basic things, like listen for events you think you'd like to do something with.
// Listen for a SWITCH_ACTOR event:
sdk.socketClient.on('SWITCH_ACTOR', data => {
  // Do something
  console.log(data);
});

// More basic things, like querying the actual CBPi API.
// Execute GET request:
const systemDump = await sdk.httpClient.get('/system/dump');

// Control specific resources, like actors, and get their configuration.
// Get the actors available:
const actors = await sdk.resources.actors.getActors();
```

## Configuration

By default, Swill SDK assumes your CraftBeerPi3 HTTP and websocket servers are both located at `http://localhost:5000`. This is normally fine if you haven't configured custom ports and routing for your CBPi instance.

If you are running the SDK on another machine, host or port entirely, you will need to tell the SDK where to look. Those overrides are provided in the form of a configuration object you pass to Swill SDK when you instantiate:
```javascript
const SwillSDK = require('swill-sdk');
const sdk = SwillSDK({
  httpAddress: 'http://<some-ip>:<some-port>',
  socketAddress: 'http://<some-ip>:<some-port>'
});
```

## CraftBeerPi3 compatibility

Currently, Swill SDK only support [CraftBeerPi3 v3.0](https://github.com/Manuel83/craftbeerpi3/releases/tag/3.0) installations. It is our belief that CraftBeerPi 3.0 is the best, most stable release of the app to date.

### Why?

CBPi v3.1 introduces a lot of changes that have not yet been fully fleshed out, nor are fully compatible with 3.0. Furthermore, it is still marked as an Alpha release and has stability problems. We do not recommend using this version of the software at this time.

CBPi v2.x and earlier are old releases and should be seen as deprecated in favor of CBPi v3.0.

## Try it out!

Just want to try out the SDK, without the fuss of creating a separate Node package or UI project? You can!

Make sure you've got a CraftBeerPi3 instance running locally, then run the development server (if you want to test the client-side library) or the Node sample (if you want to test the Node.js module).

### Development server

Inside of the install location for Swill SDK, if you run the command `npm run dev:server` you will spawn a continuously running development server. Open your browser to `http://<ip-address>:8080/index.html` and open the browser's development console. Here is a sample set of commands you can run:
```javascript
> const sdk = SwillSDK({socketAddress:`http://${window.location.hostname}:5000`,httpAddress:`http://${window.location.hostname}:5000`});
> undefined
> await sdk.resources.actors.getActors();
> // See what happens next :)
```

### Node sample

Inside the install location, run `node` and then follow these commands:
```javascript
> const SwillSDK = require('./');
undefined
> const sdk = SwillSDK();
undefined
> (async () => {console.log(await sdk.resources.actors.getActors())})()
> // See what happens next :)
```

## Gotchas

### CORS
If you are using the client-side SDK and you are not running your resources on the same host and port as CraftBeerPi3 (generally by dropping your files directly in the `craftbeerpi3/modules/ui/static/` folder), you will run into CORS (Cross-Origin Request Scripting) request issues with the CraftBeerPi3 server.

For example, this will happen when you attempt to run the [development server](#development-server).

By default, CraftBeerPi3 does not support requests from origins other than its own. This can be remedied a few ways. Either move your files to the folder mentioned above so that they run on the same host and port as CBPi, or do the following to enable CORS support in CraftBeerPi3.

#### Installing Flask-CORS
1. From inside your CraftBeerPi3 directory (normally something like `~/craftbeerpi3/`), install [Flask-CORS](http://flask-cors.readthedocs.io/en/latest/)
```shell
 pip install -U flask-cors
```
2. Edit your `modules/__init__.py` file and add the following
```python
import json
import pprint
import sys, os
from flask import Flask, render_template, redirect
from flask_socketio import SocketIO, emit
from flask_cors import CORS # ADD THIS

...

from modules.core.db import get_db

CORS(app) # AND ALSO ADD THIS

@app.route('/')
def index():
    return redirect('ui')

...
```
3. Restart your CBPi instance:
```shell
sudo /etc/init.d/craftbeerpiboot stop && sudo /etc/init.d/craftbeerpiboot start
```
4. CORS should now be supported, connect your clients

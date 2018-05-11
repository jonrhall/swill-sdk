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

Anyone who loves CraftBeerPi3 already and wants to develop an app that controls or listens to CraftBeerPi3 in some custom way. That could be as simple as Node app to create brewing notifications, or as complex as an entirely new custom interface that you create for your own CraftBeerPi3 installation.

## CraftBeerPi3 compatibility

Currently, Swill SDK only supports [CraftBeerPi3 v3.0](https://github.com/Manuel83/craftbeerpi3/releases/tag/3.0) installations. It is our belief that CraftBeerPi 3.0 is the best, most stable release of the app to date.

### Why?

CBPi v3.1 introduces a lot of changes that have not yet been fully fleshed out, nor are fully compatible with 3.0. Furthermore, it is still marked as an Alpha release and has stability problems. We do not recommend using this version of the software at this time.

CBPi v2.x and earlier are old releases and should be seen as deprecated in favor of CBPi v3.0.

## Try it out!

Just want to try out the SDK, without the fuss of creating a separate package or project? You can!

Make sure you've got a CraftBeerPi3 instance running locally, then [run the Node sample](../../wiki/Usage#nodejs).

## Deploying your app with Swill SDK

_If you use Swill SDK as a Node app, you can ignore this section._

If you plan on making your app available in a web browser, you'll either need to host/deploy it to your own personal server, or use your Raspberry Pi and CraftBeerPi to do it for you. Keep in mind that if you go deploy it yourself, you will need to [install CORS for CraftBeerPi](#cors) in order for any web clients to accept responses from the CBPi server in the first place.

It is generally recommended that you run your code bundled with the SDK, copied into the same folder that CraftBeerPi3 hosts its resources from (normally something like `/path/to/craftbeerpi3/modules/ui/static`). Files dropped into that location are available from the same host and port URL that you access CraftBeerPi3 from, by default `http://<raspi-address:5000/ui/static`.

## Gotchas

### CORS

If you are using the client-side SDK and you are not running your resources on the same host and port as CraftBeerPi3 (generally by dropping your files directly in the `craftbeerpi3/modules/ui/static/` folder), you will run into CORS (Cross-Origin Resource Sharing) request issues with the CraftBeerPi3 server.

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

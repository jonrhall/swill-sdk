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

## Learn More

Want to learn more? [Visit the wiki for more information!](../../wiki)

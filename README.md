# erbify

Selectively replace erb-style environment variables with plain strings. Got a reference to your .env file in your js? This'll hook you up with a replacement without the messing with rails pre-compiling your stuff.
Available as a standalone CLI tool and a
[Browserify](http://browserify.org) v2 transform. Based off of [envify](https://github.com/hughsk/envify)


## Installation ##

ATM for use with builder project only.

- Clone from bitbucket into `erbify` folder on same level as builder project
- `npm install` on builder project
- done


## Usage ##

From root of builder project:

`browserify ENTRY-POINT -t ./node_modules/erbify/index.js -o browserified.js`

Or using browserify-rails

```Rails.Application.configure do
config.browserify_rails.commandline_options = ["-t ./node_modules/erbify/index.js"]```
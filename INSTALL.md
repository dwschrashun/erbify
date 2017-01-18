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
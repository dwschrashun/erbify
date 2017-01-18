# erbify

A [Browserify](http://browserify.org) transform used to selectively replace variables used in erb files with values defined your .env file.

Got a reference to your .env file in your js? This'll hook you up with a replacement without messing with having rails pre-compile your stuff.

Many thanks to [envify](https://github.com/hughsk/envify) for the jump off.


## Installation ##

`npm install git://github.com/dwschrashun/erbify.git`


## Usage ##

From root of builder project:

`browserify ENTRY-POINT -t ./node_modules/erbify/index.js -o browserified.js`

Or using [browserify-rails](https://github.com/browserify-rails/browserify-rails)

```
Rails.Application.configure do
  config.browserify_rails.commandline_options = ["-t ./node_modules/erbify/index.js"]
end
```

Follows dotenv conventions for .env file location and naming. If you have an environment specific .env file to load in addition to your global .env file, specify the environment name using the "stage" option.

`config.browserify_rails.commandline_options = ["-t ./node_modules/erbify/index.js --stage='production'"]`

You can optionally pass in the path to the directory where your .env file is located, using the 'envDir' option (this is probably a good idea):

`config.browserify_rails.commandline_options = ["-t ./node_modules/erbify/index.js --envDir='#{Dir.pwd}'"]`
# 360Me-Backend

a [Sails](http://sailsjs.org) application

## Requirements
* Node.js
* MongoDB
* Sails.js (install with ```sudo npm install -g sails```)
* local.js
config/local.js is not included for security reasons, be sure to add this. Here is an example -
```javascript
module.exports = {
  // Secret values
  linkedin: {
    api: 'my-api-key',
    secret: 'my-secret-api-key'
  }
}
```

## Running
1. Start mongodb ```$ mongo```
2. Start server ```$ sails lift```

*Note: Choose option 1 if asked about db migration*

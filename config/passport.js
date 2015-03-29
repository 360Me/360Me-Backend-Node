/**
 * Passport configuration
 *
 * This is the configuration for your Passport.js setup and where you
 * define the authentication strategies you want your application to employ.
 *
 * I have tested the service with all of the providers listed below - if you
 * come across a provider that for some reason doesn't work, feel free to open
 * an issue on GitHub.
 *
 * Also, authentication scopes can be set through the `scope` property.
 *
 * For more information on the available providers, check out:
 * http://passportjs.org/guide/providers/
 */

module.exports.passport = {

  linkedin: {
    name: 'LinkedIn',
    protocol: 'oauth2',
    strategy: require('passport-linkedin').Strategy,
    options: {
      consumerKey: '7552m8x0v33q2i',
      consumerSecret: 'VA46Cq8IUc3YtdrM',
      callbackURL: 'http://127.0.0.1:1337/auth/linkedin/callback'
    }
  }

};

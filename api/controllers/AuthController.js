/**
 * Authentication Controller
 *
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */

var LinkedIn = require('node-linkedin')(sails.config.linkedin.api, sails.config.linkedin.secret, 'http://localhost:1337/auth/linkedin/callback');

var AuthController = {

  logout: function (req, res) {
    req.logout();

    // mark the user as logged out for auth purposes
    req.session.authenticated = false;

    res.redirect('/');
  },

  /**
   * Authorize with LinkedIn OAuth 2.0
   *
   * @param {Object} req
   * @param {Object} res
   */
  linkedin: function (req, res) {
    LinkedIn.auth.authorize(res, ['r_basicprofile']);
  },

  /**
   * Create a authentication callback endpoint
   *
   * @param {Object} req
   * @param {Object} res
   */
  callback: function (req, res) {
    if (!req.query.code) return handleAuthError(res, 'No authorization code supplied.');

    LinkedIn.auth.getAccessToken(res, req.query.code, function (err, token) {
        if (err) return handleAuthError(res, err);

        /**
         * Results have something like:
         * {"expires_in":5184000,"access_token":". . . ."}
         */


        /*
         * Create user or update user's token
         */
        var linkedinApi = LinkedIn.init(JSON.parse(token).access_token);
        // Get profile of token owner
        linkedinApi.people.me(function (err, profile) {
          if (err) return handleAuthError(res, err);
         // profile = JSON.parse(profile);
          // Try and find user
          User.findOne({ linkedinId: profile.id }, function (err, user) {
            if (err) return handleAuthError(res, err);

            if (!user) {
              // Create user
              User.create({
                linkedinId: profile.id,
                token: token.access_token,
                tokenExpires: token.expires_in,
                firstName: profile.firstName,
                lastName: profile.lastName,
                headline: profile.headline,
                numConnections: profile.numConnections
              }, function (err, user) {
                if (err) return handleAuthError(res, err);

                return res.redirect('http://localhost:8080/#/auth?token=' + user.token);
              });
            } else {
               // Save updated user (mainly for token but other fields may have changed since last login)
                var tokenObject = JSON.parse(token);
                user.token = tokenObject.access_token;
                user.tokenExpires = tokenObject.expires_in;
                user.save(function (err, updatedUser) {
                  if (err) return handleAuthError(res, err);
                 return res.redirect('http://localhost:8080/#/auth?token=' + user.token);
                });
            }
          });
        });
    });
  },
   /**
   * Provide endpoint for webapp to request user object/verify token
   *
   * @param {Object} req
   * @param {Object} res
   */
  user: function (req, res) {
    var token = req.headers.token;

    User.findOne({ token: token }, function (err, user) {
      if (err) console.log(err);

      if (!user) {
        return res.json({ status: '403', error: 'You are not permitted to perform this action.'});
      }
      // Send user object
      return res.json({ user: user });
    });
  }
};

module.exports = AuthController;

function handleAuthError (res, error) {
  // Log error
  console.log(error);
  // Send error response
  return res.redirect('http://localhost:8080/?error=1');
}

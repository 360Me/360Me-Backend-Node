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
                token: token,
                firstName: profile.firstName,
                lastName: profile.lastName,
                headline: profile.headline,
                numConnections: profile.numConnections
              }, function (err, user) {
                if (err) return handleAuthError(res, err);

                res.json({ user: user });
              });
            } else {
               // Save updated user (mainly for token but other fields may have changed since last login)
                user.token = JSON.parse(token);
                user.save(function (err, updatedUser) {
                  if (err) return handleAuthError(res, err);
                  return res.json({ user: user });
                });
            }
          });
        });





        //return res.json({ hey: "Pop pop!" });
        //return res.redirect('http://localhost:8080/');
    });
  }
};

module.exports = AuthController;

function handleAuthError (res, error) {
  // Log error
  console.log(error);
  // Send error response
  res.json({ error: 'Error authenticating.' });
}

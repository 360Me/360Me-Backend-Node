/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  /*
   * See if req.token exists and is valid
   */

  var token = req.headers.token;

  User.findOne({ token: token }, function (err, user) {
    if (err) console.log(err);

    if (!user) {
      return res.json({ status: '403', error: 'You are not permitted to perform this action.'});
    }

    return next();
  });

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  //return res.forbidden('You are not permitted to perform this action.');
};

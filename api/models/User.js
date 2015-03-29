var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    linkedinId: { type: 'string', unique: true, required: true },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    headline: { type: 'string' },
    pictureUrl: { type: 'string' },
    numConnections: { type: 'integer' },

    /** A subset of a user's connections that are also using the app */
    //coworkers: { collection: 'Connection', via: 'coworkers'},
     /** All of user's LinkedIn connections; may or may not be using app  */
   // connections: { collection: 'Connection', via: 'users' },

    /** OAuth2 token we get from LinkedIn */
    token: { type: 'json' }
    /** JWT we generate
        apiToken: { collection: 'Token', via: 'user' },
    **/

  }
};

module.exports = User;

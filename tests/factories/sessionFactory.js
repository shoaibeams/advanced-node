const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = user => {
  // When we are working with mongoose models, they always have
  //this _id property. The mongoose model id property is not
  // actually a string. It's a js object that contains the user's id.
  // hence the use of toString() below

  const sessionObject = {
    passport: {
      user: user._id.toString()
    }
  };

  // to convert session object into session string
  const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');

  const sig = keygrip.sign('session=' + session);

  return { session, sig };
};

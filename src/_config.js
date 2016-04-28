var config = {};

config.mongoURI = {
  test: 'mongodb://localhost/link-meat',
  development: 'mongodb://localhost/link-meat',
  production: process.env.MONGODB_URI
};

config.SALT_WORK_FACTOR = 1;
config.TOKEN_SECRET = '\x07q\xa1\xb0\xa0\xa7x\xda\xb2\xa9+g|\xd5\x9d\xd9\x9f\x12\xc4-I\x12Q\xfc';

module.exports = config;

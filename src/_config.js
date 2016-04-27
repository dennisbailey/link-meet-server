var config = {};

config.mongoURI = {
  test: 'mongodb://localhost/link-meat',
  development: 'mongodb://localhost/link-meat',
  production: 'mongodb://heroku_31f0dcgs:ca4qba84avk0tcsl24kl986l54@ds021681.mlab.com:21681/heroku_31f0dcgs'
};

config.TOKEN_SECRET = '\x07q\xa1\xb0\xa0\xa7x\xda\xb2\xa9+g|\xd5\x9d\xd9\x9f\x12\xc4-I\x12Q\xfc';

module.exports = config;
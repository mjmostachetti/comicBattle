var oio = require('../lib-cov/client');

oio.ApiProtocol = process.env.ORCHESTRATE_API_PROTOCOL || 'https:'
oio.ApiEndPoint = process.env.ORCHESTRATE_API_ENDPOINT || 'api.orchestrate.io'

var token = process.env.ORCHESTRATE_API_KEY || 'sample_token';

module.exports = function() {
  return oio(token);
}

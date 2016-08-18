var updateNotifier = require('update-notifier')
var pkg = require('../../package.json')

module.exports = function() {
  delete process.env.npm_config_username
  delete process.env.npm_package_name
  delete process.env.npm_config_heading
  var notifier = updateNotifier({
    pkg: pkg,
    updateCheckInterval: 2 * 1000
  })
  notifier.notify()
}

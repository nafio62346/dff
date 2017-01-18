(function () {
	const chai = require('chai');
	chai.should();
	global.expect = chai.expect;
	global.assert = chai.assert;

	const td = require('testdouble');
	const quibble = require('quibble');
	global.td = td;

	beforeEach(() => {
		// Not pretty, but easier than getting coffee
		global.RocketChat = {
			models: {
				Users: {}
			},
			settings: {
				get: function () {
					return '';
				}
			}
		};
		td.reset();
		// for wallaby to reset properly
		quibble.ignoreCallsFromThisFile(require.main.filename);
	});
})();

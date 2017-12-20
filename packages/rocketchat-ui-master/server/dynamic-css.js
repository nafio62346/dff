/* eslint-disable */

'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var debounce = function debounce(func, wait, immediate) {
		var timeout = void 0;
		return function () {
			var _this = this;

			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			var later = function later() {
				timeout = null;
				!immediate && func.apply(_this, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			callNow && func.apply(this, args);
		};
	};
	var cssVarPoly = {
		test: function test() {
			return window.CSS && window.CSS.supports && window.CSS.supports('(--foo: red)');
		},
		init: function init() {
			if (this.test()) {
				return;
			}
			console.time('cssVarPoly');
			cssVarPoly.ratifiedVars = {};
			cssVarPoly.varsByBlock = [];
			cssVarPoly.oldCSS = [];

			cssVarPoly.findCSS();
			cssVarPoly.updateCSS();
			console.timeEnd('cssVarPoly');
		},
		findCSS: function findCSS() {
			var styleBlocks = Array.prototype.concat.apply([], document.querySelectorAll('#css-variables, link[type="text/css"].__meteor-css__'));

			// we need to track the order of the style/link elements when we save off the CSS, set a counter
			var counter = 1;

			// loop through all CSS blocks looking for CSS variables being set
			styleBlocks.map(function (block) {
				// console.log(block.nodeName);
				if (block.nodeName === 'STYLE') {
					var theCSS = block.innerHTML;
					cssVarPoly.findSetters(theCSS, counter);
					cssVarPoly.oldCSS[counter++] = theCSS;
				} else if (block.nodeName === 'LINK') {
					var url = block.getAttribute('href');
					cssVarPoly.oldCSS[counter] = '';
					cssVarPoly.getLink(url, counter, function (counter, request) {
						cssVarPoly.findSetters(request.responseText, counter);
						cssVarPoly.oldCSS[counter++] = request.responseText;
						cssVarPoly.updateCSS();
					});
				}
			});
		},


		// find all the "--variable: value" matches in a provided block of CSS and add them to the master list
		findSetters: function findSetters(theCSS, counter) {
			// console.log(theCSS);
			cssVarPoly.varsByBlock[counter] = theCSS.match(/(--[^:; ]+:..*?;)/g);
		},


		// run through all the CSS blocks to update the variables and then inject on the page
		updateCSS: debounce(function () {
			// first lets loop through all the variables to make sure later vars trump earlier vars
			cssVarPoly.ratifySetters(cssVarPoly.varsByBlock);

			// loop through the css blocks (styles and links)
			cssVarPoly.oldCSS.filter(function (e) {
				return e;
			}).forEach(function (css, id) {
				var newCSS = cssVarPoly.replaceGetters(css, cssVarPoly.ratifiedVars);
				var el = document.querySelector('#inserted' + id);
				if (el) {
					// console.log("updating")
					el.innerHTML = newCSS;
				} else {
					// console.log("adding");
					var style = document.createElement('style');
					style.type = 'text/css';
					style.innerHTML = newCSS;
					style.classList.add('inserted');
					style.id = 'inserted' + id;
					document.getElementsByTagName('head')[0].appendChild(style);
				}
			});
		}, 100),

		// parse a provided block of CSS looking for a provided list of variables and replace the --var-name with the correct value
		replaceGetters: function replaceGetters(oldCSS, varList) {
			return oldCSS.replace(/var\((--.*?)\)/gm, function (all, variable) {
				return varList[variable];
			});
		},


		// determine the css variable name value pair and track the latest
		ratifySetters: function ratifySetters(varList) {
			// loop through each block in order, to maintain order specificity
			varList.filter(function (curVars) {
				return curVars;
			}).forEach(function (curVars) {
				// const curVars = varList[curBlock] || [];
				curVars.forEach(function (theVar) {
					// console.log(theVar);
					// split on the name value pair separator
					var matches = theVar.split(/:\s*/);
					// console.log(matches);
					// put it in an object based on the varName. Each time we do this it will override a previous use and so will always have the last set be the winner
					// 0 = the name, 1 = the value, strip off the ; if it is there
					cssVarPoly.ratifiedVars[matches[0]] = matches[1].replace(/;/, '');
				});
			});
			Object.keys(cssVarPoly.ratifiedVars).filter(function (key) {
				return cssVarPoly.ratifiedVars[key].indexOf('var') > -1;
			}).forEach(function (key) {
				cssVarPoly.ratifiedVars[key] = cssVarPoly.ratifiedVars[key].replace(/var\((--.*?)\)/gm, function (all, variable) {
					return cssVarPoly.ratifiedVars[variable];
				});
			});
		},

		// get the CSS file (same domain for now)
		getLink: function getLink(url, counter, success) {
			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.overrideMimeType('text/css;');
			request.onload = function () {
				if (request.status >= 200 && request.status < 400) {
					// Success!
					// console.log(request.responseText);
					if (typeof success === 'function') {
						success(counter, request);
					}
				} else {
					// We reached our target server, but it returned an error
					console.warn('an error was returned from:', url);
				}
			};

			request.onerror = function () {
				// There was a connection error of some sort
				console.warn('we could not get anything from:', url);
			};

			request.send();
		}
	};
	var stateCheck = setInterval(function () {
		if (document.readyState === 'complete' && typeof Meteor !== 'undefined') {
			clearInterval(stateCheck);
			// document ready
			cssVarPoly.init();
		}
	}, 100);

	DynamicCss = typeof DynamicCss !== 'undefined' ? DynamicCss : {};
	DynamicCss.test = function () {
		return window.CSS && window.CSS.supports && window.CSS.supports('(--foo: red)');
	};
	DynamicCss.run = debounce(function () {
		var replace = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

		if (replace) {
			// const variables = RocketChat.models.Settings.findOne({_id:'theme-custom-variables'}, {fields: { value: 1}});
			var colors = RocketChat.settings.collection.find({ _id: /theme-color-rc/i }, { fields: { value: 1, editor: 1 } }).fetch().filter(function (color) {
				return color && color.value;
			});

			if (!colors) {
				return;
			}
			var css = colors.map(function (_ref) {
				var _id = _ref._id;
				var value = _ref.value;
				var editor = _ref.editor;

				if (editor === 'expression') {
					return '--' + _id.replace('theme-color-', '') + ': var(--' + value + ');';
				}
				return '--' + _id.replace('theme-color-', '') + ': ' + value + ';';
			}).join('\n');
			document.querySelector('#css-variables').innerHTML = ':root {' + css + '}';
		}
		cssVarPoly.init();
	}, 1000);
};

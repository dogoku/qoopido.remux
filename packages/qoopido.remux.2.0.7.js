/*!
* Qoopido REMux: an REM and JS based approach to responsive web design
*
* Source:  Qoopido REMux
* Version: 2.0.7
* Date:    2013-06-30
* Author:  Dirk Lüth <info@qoopido.com>
* Website: https://github.com/dlueth/qoopido.remux
*
* Copyright (c) 2013 Dirk Lüth
*
* Licensed under the MIT and GPL license.
*  - http://www.opensource.org/licenses/mit-license.php
*  - http://www.gnu.org/copyleft/gpl.html
*/
;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
		return window.qoopido.shared.module.initialize('remux', pDefinition, arguments, true);
	};

	if(typeof define === 'function' && define.amd) {
		define([ './emitter' ], definition);
	} else {
		definition(window.qoopido.emitter);
	}
}(function(mPrototype, namespace, window, document, undefined) {
	'use strict';

	var prototype, style,
		html        = document.getElementsByTagName('html')[0],
		base        = 16,
		state       = { fontsize: null, layout: null, ratio: { } },
		current     = { fontsize: null, layout: null },
		delay       = null;

	prototype = mPrototype.extend({
		_constructor: function _constructor() {
			var self          = this,
				pBase         = parseInt(html.getAttribute('data-base'), 10),
				delayedUpdate = function delayedUpdate() {
					if(delay !== null) {
						window.clearTimeout(delay);
					}

					delay = window.setTimeout(function() {
						self.updateState();
					}, 20);
				};

			prototype._parent._constructor.call(self);

			if(isNaN(pBase) === false) {
				base = pBase;
			}

			style      = document.createElement('style');
			style.type = 'text/css';

			document.getElementsByTagName('head')[0].appendChild(style);

			window.addEventListener('resize', delayedUpdate, false);
			window.addEventListener('orientationchange', delayedUpdate, false);

			self.updateState();
		},
		getState: function getState() {
			return state;
		},
		updateState: function updateState() {
			var self = this;

			state.fontsize = parseInt(window.getComputedStyle(html).getPropertyValue('font-size'), 10);
			state.layout   = window.getComputedStyle(html, ':after').getPropertyValue('content') || null;

			if(state.fontsize !== current.fontsize || state.layout !== current.layout) {
				current.fontsize     = state.fontsize;
				current.layout       = state.layout;

				state.ratio.device   = (window.devicePixelRatio || 1);
				state.ratio.fontsize = state.fontsize / base;
				state.ratio.total    = state.ratio.device * state.ratio.fontsize;

				self.emit('statechange', state);
			}

			return self;
		},
		addLayout: function addLayout(pId, pLayout) {
			var parameter, id, layout, size, breakpoint, query,
				self = this;

			if(arguments.length > 1) {
				parameter      = { };
				parameter[pId] = pLayout;
			} else {
				parameter = arguments[0];
			}

			for(id in parameter) {
				layout = parameter[id];

				for(size = layout.min; size <= layout.max; size++) {
					breakpoint = Math.round(layout.width * (size / base));
					query      = '@media screen and (min-width: ' + breakpoint + 'px) { html { font-size: ' + size + 'px; } html:after { content: "' + id + '"; display: none; } }';

					if(style.styleSheet){
						style.styleSheet.cssText += query;
					} else {
						style.appendChild(document.createTextNode(query));
					}
				}
			}

			self.updateState();

			return self;
		}
	});

	return prototype;
}, window));
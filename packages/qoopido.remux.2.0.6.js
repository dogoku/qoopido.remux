/*!
* Qoopido REMux: an REM and JS based approach to responsive web design
*
* Source:  Qoopido REMux
* Version: 2.0.6
* Date:    2013-06-28
* Author:  Dirk Lüth <info@qoopido.com>
* Website: https://github.com/dlueth/qoopido.remux
*
* Copyright (c) 2013 Dirk Lüth
*
* Licensed under the MIT and GPL license.
*  - http://www.opensource.org/licenses/mit-license.php
*  - http://www.gnu.org/copyleft/gpl.html
*/
;(function(pDefinition, pShim, window, document, undefined) {
	'use strict';

	pShim();

	var root       = 'qoopido',
		definition = function definition() {
			return initialize('base', pDefinition, arguments);
		},
		initialize = function initialize(pNamespace, pDefinition, pArgs, pSingleton) {
			var namespace = pNamespace.split('/'),
				id        = namespace[namespace.length - 1],
				pointer   = window[root] = window[root] || {},
				modules   = window[root].modules = window[root].modules || {};

			for(var i = 0; namespace[i + 1] !== undefined; i++) {
				pointer[namespace[i]] = pointer[namespace[i]] || {};

				pointer = pointer[namespace[i]];
			}

			namespace = namespace.join('/');

			[].push.apply(pArgs, [ namespace, window, document, undefined ]);

			return (pSingleton === true) ? (pointer[id] = modules[namespace] = pDefinition.apply(null, pArgs).create()) : (pointer[id] = modules[namespace] = pDefinition.apply(null, pArgs));
		};

	initialize('shared/module/initialize',
		function(module, namespace) {
			if(typeof define === 'function' && define.amd) {
				define(namespace, module);
			}

			return module;
		},
		[initialize]);

	if(typeof define === 'function' && define.amd) {
		define(definition);
	} else {
		definition();
	}
}(
	function(namespace, window, document, undefined) {
		'use strict';

		return {
			create: function create() {
				var instance = Object.create(this, Object.getOwnPropertyDescriptors(this));

				if(instance._constructor) {
					instance._constructor.apply(instance, arguments);
				}

				instance.create = instance.extend = undefined;

				return instance;
			},
			extend: function extend(properties) {
				properties         = properties || {};
				properties._parent = Object.create(this, Object.getOwnPropertyDescriptors(this));

				return Object.create(this, Object.getOwnPropertyDescriptors(properties));
			}
		};
	},
	function(undefined) {
		'use strict';

		var valueNull                       = null,
			stringFunction                  = 'function',
			stringObject                    = 'object',
			stringUndefined                 = 'undefined',
			stringHasOwnProperty            = 'hasOwnProperty',
			stringProto                     = '__proto__',
			stringPrototype                 = 'prototype',
			stringDefineProperty            = 'defineProperty',
			stringDefineProperties          = 'defineProperties',
			stringGetOwnPropertyDescriptor  = 'getOwnPropertyDescriptor',
			stringGetOwnPropertyDescriptors = 'getOwnPropertyDescriptors',
			stringGetOwnPropertyNames       = 'getOwnPropertyNames',
			pointerObjectPrototype          = Object[stringPrototype],
			supportsProto                   = (pointerObjectPrototype[stringProto] === valueNull),
			supportsAccessors               = pointerObjectPrototype[stringHasOwnProperty]('__defineGetter__'),
			fallbackDefineProperty, fallbackDefineProperties, fallbackGetOwnPropertyDescriptor;

		function Blueprint() {}
		function checkDefineProperty(object) { try { Object[stringDefineProperty](object, 'sentinel', {}); return ('sentinel' in object); } catch (exception) {}}
		function checkGetOwnPropertyDescriptor(object) { try { object.sentinel = 0; return (Object[stringGetOwnPropertyDescriptor](object, 'sentinel').value === 0); } catch (exception) {}}

		if(!Object.keys) {
			var buggy   = true,
				exclude = [	'toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor' ],
				key;

			for(key in { 'toString': valueNull }) {
				buggy = false;
			}

			Object.keys = function keys(object) {
				var result = [],
					name;

				if((typeof object !== stringObject && typeof object !== stringFunction) || object === valueNull) {
					throw new TypeError('Object.keys called on a non-object');
				}

				for(name in object) {
					if(object[stringHasOwnProperty](name)) {
						result.push(name);
					}
				}

				if(buggy === true) {
					var i;

					for(i = 0; (name = exclude[i]) !== undefined; i++) {
						if(object[stringHasOwnProperty](name)) {
							result.push(name);
						}
					}
				}

				return result;
			};
		}

		if(Object[stringDefineProperty]) {
			if(!(checkDefineProperty({})) || !(typeof document === stringUndefined || checkDefineProperty(document.createElement('div')))) {
				fallbackDefineProperty   = Object[stringDefineProperty];
				fallbackDefineProperties = Object[stringDefineProperties];
			}

			if(!(checkGetOwnPropertyDescriptor({})) || !(typeof document === stringUndefined || checkGetOwnPropertyDescriptor(document.createElement('div')))) {
				fallbackGetOwnPropertyDescriptor = Object[stringGetOwnPropertyDescriptor];
			}
		}

		if(!Object[stringDefineProperty] || fallbackDefineProperty !== valueNull) {
			Object[stringDefineProperty] = function defineProperty(object, property, descriptor) {
				if((typeof object !== stringObject && typeof object !== stringFunction) || object === valueNull) {
					throw new TypeError('Object[stringDefineProperty] called on non-object: ' + object);
				}

				if((typeof descriptor !== stringObject && typeof descriptor !== stringFunction) || descriptor === valueNull) {
					throw new TypeError('Property description must be an object: ' + descriptor);
				}

				if(fallbackDefineProperty !== valueNull) {
					try {
						return fallbackDefineProperty.call(Object, object, property, descriptor);
					} catch (exception) {}
				}

				if(descriptor[stringHasOwnProperty]('value')) {
					if(supportsAccessors && (object.__lookupGetter__(property) || object.__lookupSetter__(property))) {
						var prototype = object[stringProto];

						object[stringProto] = pointerObjectPrototype;

						delete object[property];

						object[property] = descriptor.value;

						object[stringProto] = prototype;
					} else {
						object[property] = descriptor.value;
					}
				} else {
					if(supportsAccessors === false) {
						throw new TypeError('getters & setters can not be defined on this javascript engine');
					}

					if(descriptor[stringHasOwnProperty]('get')) {
						object.__defineGetter__(property, descriptor.get);
					}

					if(descriptor[stringHasOwnProperty]('set')) {
						object.__defineSetter__(property, descriptor.set);
					}
				}

				return object;
			};
		}

		if(!Object[stringDefineProperties] || fallbackDefineProperties !== valueNull) {
			Object[stringDefineProperties] = function defineProperties(object, properties) {
				var property;

				if(fallbackDefineProperties) {
					try {
						return fallbackDefineProperties.call(Object, object, properties);
					} catch (exception) {}
				}

				for(property in properties) {
					if(properties[stringHasOwnProperty](property) && property !== '__proto__') {
						Object[stringDefineProperty](object, property, properties[property]);
					}
				}

				return object;
			};
		}

		if(!Object[stringGetOwnPropertyDescriptor] || fallbackGetOwnPropertyDescriptor !== valueNull) {
			Object[stringGetOwnPropertyDescriptor] = function getOwnPropertyDescriptor(object, property) {
				var descriptor =  { enumerable: true, configurable: true };

				if((typeof object !== stringObject && typeof object !== stringFunction) || object === valueNull) {
					throw new TypeError('Object[stringGetOwnPropertyDescriptor] called on non-object: ' + object);
				}

				if(fallbackGetOwnPropertyDescriptor !== valueNull) {
					try {
						return fallbackGetOwnPropertyDescriptor.call(Object, object, property);
					} catch (exception) {}
				}

				if(!object[stringHasOwnProperty](property)) {
					return;
				}

				if(supportsAccessors === true) {
					var prototype = object[stringProto],
						getter, setter;

					object[stringProto] = pointerObjectPrototype;

					getter = object.__lookupGetter__(property);
					setter = object.__lookupSetter__(property);

					object[stringProto] = prototype;

					if(getter || setter) {
						if(getter) {
							descriptor.get = getter;
						}

						if(setter) {
							descriptor.set = setter;
						}

						return descriptor;
					}
				}

				descriptor.value    = object[property];
				descriptor.writable = true;

				return descriptor;
			};
		}

		if(!Object[stringGetOwnPropertyDescriptors]) {
			Object[stringGetOwnPropertyDescriptors] = function(object) {
				var descriptors = {},
					propertiers = Object[stringGetOwnPropertyNames](object),
					i, property;

				for(i = 0; (property = propertiers[i]) !== undefined; i++) {
					descriptors[property] = Object[stringGetOwnPropertyDescriptor](object, property);
				}

				return descriptors;
			};
		}

		if(!Object[stringGetOwnPropertyNames]) {
			Object[stringGetOwnPropertyNames] = function getOwnPropertyNames(object) {
				return Object.keys(object);
			};
		}

		if(!Object.create) {
			var createEmpty;

			if(supportsProto || typeof document === stringUndefined) {
				createEmpty = function() { return { '__proto__': valueNull }; };
			} else {
				createEmpty = function() {
					var iframe = document.createElement('iframe'),
						parent = document.body || document.documentElement,
						empty;

					iframe.style.display = 'none';
					parent.appendChild(iframe);
					iframe.src = 'javascript:';

					empty = iframe.contentWindow.pointerObjectPrototype;

					delete empty.constructor;
					delete empty.hasOwnProperty;
					delete empty.propertyIsEnumerable;
					delete empty.isPrototypeOf;
					delete empty.toLocaleString;
					delete empty.toString;
					delete empty.valueOf;
					empty[stringProto] = valueNull;

					parent.removeChild(iframe);
					iframe = valueNull;

					Blueprint[stringPrototype] = empty;

					createEmpty = function () {
						return new Blueprint();
					};

					return new Blueprint();
				};
			}

			Object.create = function create(prototype, properties) {
				var object;

				function Type() {}

				if(prototype === valueNull) {
					object = createEmpty();
				} else {
					if(typeof prototype !== stringObject && typeof prototype !== stringFunction) {
						throw new TypeError('Object prototype may only be an Object or null');
					}

					Type[stringPrototype] = prototype;

					object = new Type();
					object[stringProto] = prototype;
				}

				if(properties !== void 0) {
					Object[stringDefineProperties](object, properties);
				}

				return object;
			};
		}
	},
	window, document
));
;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
			return window.qoopido.shared.module.initialize('emitter', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ './base' ], definition);
	} else {
		definition(window.qoopido.base);
	}
}(function(mPrototype, namespace, window, document, undefined) {
	'use strict';

	var excludeMethods = /^(_|extend$|create$|on$|one$|off$|emit$|get.+)/;

	return mPrototype.extend({
		_mapped:   null,
		_listener: null,
		_constructor: function _constructor() {
			var self = this,
				method;

			self._listener = {};
			self._mapped = {};

			for(method in self) {
				if(typeof self[method] === 'function' && excludeMethods.test(method) === false) {
					self[method] = self._map(method);
				}
			}
		},
		_map: function _map(method) {
			var self  = this,
				event = method.charAt(0).toUpperCase() + method.slice(1);

			self._mapped[method] = self[method];

			return function() {
				var args = Array.prototype.slice.call(arguments),
					returnValue;

				self.emit.apply(self, ['pre' + event, args]);
				returnValue = self._mapped[method].apply(self, args);
				self.emit.apply(self, ['post' + event, returnValue, args]);

				return returnValue;
			};
		},
		on: function on(event, listener) {
			var self = this;

			if(event !== undefined && listener !== undefined) {
				(self._listener[event] = self._listener[event] || []).push(listener);
			}

			return self;
		},
		one: function one(event, listener) {
			var self = this;

			if(event !== undefined && listener !== undefined) {
				listener.once = true;

				self.on(event, listener);
			}

			return self;
		},
		off: function off(event, listener) {
			var self = this,
				i;

			if(event !== undefined) {
				self._listener[event] = self._listener[event] || [];

				if(listener) {
					while((i = self._listener[event].indexOf(listener)) !== -1) {
						self._listener[event].splice(i, 1);
					}
				} else {
					self._listener[event].length = 0;
				}
			}

			return self;
		},
		emit: function emit(event) {
			var self = this,
				args = Array.prototype.slice.call(arguments).splice(1),
				i, listener;

			if(event !== undefined) {
				self._listener[event] = self._listener[event] || [];

				for(i = 0; (listener = self._listener[event][i]) !== undefined; i++) {
					listener.apply(self, args);

					if(listener.once === true) {
						self._listener[event].splice(i, 1);
						i--;
					}
				}
			}

			return self;
		}
	});
}, window));
;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
		return window.qoopido.shared.module.initialize('remux', pDefinition, arguments);
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
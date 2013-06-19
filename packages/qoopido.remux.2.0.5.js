/*!
* Qoopido REMux: an REM and JS based approach to responsive web design
*
* Source:  Qoopido REMux
* Version: 2.0.5
* Date:    2013-06-19
* Author:  Dirk Lüth <info@qoopido.com>
* Website: https://github.com/dlueth/qoopido.remux
*
* Copyright (c) 2013 Dirk Lüth
*
* Licensed under the MIT and GPL license.
*  - http://www.opensource.org/licenses/mit-license.php
*  - http://www.gnu.org/copyleft/gpl.html
*/
;(function(definition, shim, window, document, undefined) {
	'use strict';

	shim();

	var namespace  = 'qoopido/base',
		initialize = function initialize() {
			return window.qoopido.shared.prepareModule(namespace, definition, arguments);
		};

	window.qoopido                      = window.qoopido || {};
	window.qoopido.modules              = window.qoopido.modules || {};
	window.qoopido.shared               = window.qoopido.shared || {};
	window.qoopido.shared.prepareModule = function prepareModule(pNamespace, pDefinition, pArgs, pSingleton) {
		var id      = (namespace = pNamespace.split('/')).splice(namespace.length - 1, 1)[0],
			pointer = window,
			modules = window.qoopido.modules;

		for(var i = 0; namespace[i] !== undefined; i++) {
			pointer[namespace[i]] = pointer[namespace[i]] || {};

			pointer = pointer[namespace[i]];
		}

		[].push.apply(pArgs, [ window, document, undefined ]);

		return (pSingleton === true) ? (pointer[id] = modules[pNamespace] = pDefinition.apply(null, pArgs).create()) : (pointer[id] = modules[pNamespace] = pDefinition.apply(null, pArgs));
	};

	if(typeof define === 'function' && define.amd) {
		define(initialize);
	} else {
		initialize();
	}
}(
	function(window, document, undefined) {
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
	function() {
		'use strict';

		var Empty                               = function Empty() {},
			valueNull                           = null,
			stringFunction                      = 'function',
			stringObject                        = 'object',
			stringUndefined                     = 'undefined',
			pointerFunctionCall                 = Function.prototype.call,
			pointerObjectPrototype              = Object.prototype,
			supportsProto                       = (pointerObjectPrototype.__proto__ === valueNull),
			helperOwns, helperCheckDefineProperty, helperCheckGetOwnPropertyDescriptor, supportsAccessors, helperDefineGetter, helperDefineSetter, helperLookupGetter, helperLookupSetter, fallbackDefineProperty, fallbackDefineProperties, fallbackGetOwnPropertyDescriptor;

		if(Function.prototype.bind === undefined) {
			Function.prototype.bind = function bind(that) {
				var target = this,
					args   = [].slice.call(arguments, 1),
					bound;

				if(typeof target !== stringFunction) {
					throw new TypeError('Function.prototype.bind called on incompatible ' + target);
				}

				bound = function() {
					if(this instanceof bound) {
						var result = target.apply(this, args.concat([].slice.call(arguments, 0)));

						if(Object(result) === result) {
							return result;
						}

						return this;
					} else {
						return target.apply(that, args.concat([].slice.call(arguments, 0)));
					}
				};

				if(target.prototype) {
					Empty.prototype = target.prototype;
					bound.prototype       = new Empty();
					Empty.prototype = valueNull;
				}

				return bound;
			};
		}

		helperOwns                          = pointerFunctionCall.bind(pointerObjectPrototype.hasOwnProperty);
		helperCheckDefineProperty           = function helperCheckDefineProperty(object) { try { Object.defineProperty(object, 'sentinel', {}); return ('sentinel' in object); } catch (exception) {}};
		helperCheckGetOwnPropertyDescriptor = function helperCheckGetOwnPropertyDescriptor(object) { try { object.sentinel = 0; return (Object.getOwnPropertyDescriptor(object, 'sentinel').value === 0); } catch (exception) {}};

		if(Object.keys === undefined) {
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
					if(helperOwns(object, name)) {
						result.push(name);
					}
				}

				if(buggy === true) {
					var i;

					for(i = 0; (name = exclude[i]) !== undefined; i++) {
						if(helperOwns(object, name)) {
							result.push(name);
						}
					}
				}

				return result;
			};
		}

		if((supportsAccessors = helperOwns(pointerObjectPrototype, '__defineGetter__')) === true) {
			helperDefineGetter = pointerFunctionCall.bind(pointerObjectPrototype.__defineGetter__);
			helperDefineSetter = pointerFunctionCall.bind(pointerObjectPrototype.__defineSetter__);
			helperLookupGetter = pointerFunctionCall.bind(pointerObjectPrototype.__lookupGetter__);
			helperLookupSetter = pointerFunctionCall.bind(pointerObjectPrototype.__lookupSetter__);
		}

		if(Object.defineProperty) {
			if(!(helperCheckDefineProperty({})) || !(typeof document === 'undefined' || helperCheckDefineProperty(document.createElement('div')))) {
				fallbackDefineProperty   = Object.defineProperty;
				fallbackDefineProperties = Object.defineProperties;
			}

			if(!(helperCheckGetOwnPropertyDescriptor({})) || !(typeof document === 'undefined' || helperCheckGetOwnPropertyDescriptor(document.createElement('div')))) {
				fallbackGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
			}
		}

		if(Object.defineProperty === undefined || fallbackDefineProperty !== valueNull) {
			Object.defineProperty = function defineProperty(object, property, descriptor) {
				if((typeof object !== stringObject && typeof object !== stringFunction) || object === valueNull) {
					throw new TypeError('Object.defineProperty called on non-object: ' + object);
				}

				if((typeof descriptor !== stringObject && typeof descriptor !== stringFunction) || descriptor === valueNull) {
					throw new TypeError('Property description must be an object: ' + descriptor);
				}

				if(fallbackDefineProperty !== valueNull) {
					try {
						return fallbackDefineProperty.call(Object, object, property, descriptor);
					} catch (exception) {}
				}

				if(helperOwns(descriptor, 'value')) {
					if(supportsAccessors && (helperLookupGetter(object, property) || helperLookupSetter(object, property))) {
						var prototype = object.__proto__;

						object.__proto__ = pointerObjectPrototype;

						delete object[property];

						object[property] = descriptor.value;

						object.__proto__ = prototype;
					} else {
						object[property] = descriptor.value;
					}
				} else {
					if(supportsAccessors === false) {
						throw new TypeError('getters & setters can not be defined on this javascript engine');
					}

					if(helperOwns(descriptor, 'get')) {
						helperDefineGetter(object, property, descriptor.get);
					}

					if(helperOwns(descriptor, 'set')) {
						helperDefineSetter(object, property, descriptor.set);
					}
				}

				return object;
			};
		}

		if(Object.defineProperties === undefined || fallbackDefineProperties !== valueNull) {
			Object.defineProperties = function defineProperties(object, properties) {
				var property;

				if(fallbackDefineProperties) {
					try {
						return fallbackDefineProperties.call(Object, object, properties);
					} catch (exception) {}
				}

				for(property in properties) {
					if(helperOwns(properties, property) && property !== '__proto__') {
						Object.defineProperty(object, property, properties[property]);
					}
				}

				return object;
			};
		}

		if(Object.getOwnPropertyDescriptor === undefined || fallbackGetOwnPropertyDescriptor !== valueNull) {
			Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
				var descriptor =  { enumerable: true, configurable: true };

				if((typeof object !== stringObject && typeof object !== stringFunction) || object === valueNull) {
					throw new TypeError('Object.getOwnPropertyDescriptor called on non-object: ' + object);
				}

				if(fallbackGetOwnPropertyDescriptor !== valueNull) {
					try {
						return fallbackGetOwnPropertyDescriptor.call(Object, object, property);
					} catch (exception) {}
				}

				if(!helperOwns(object, property)) {
					return;
				}

				if(supportsAccessors === true) {
					var prototype = object.__proto__,
						getter, setter;

					object.__proto__ = pointerObjectPrototype;

					getter = helperLookupGetter(object, property);
					setter = helperLookupSetter(object, property);

					object.__proto__ = prototype;

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

		if(Object.getOwnPropertyDescriptors === undefined) {
			Object.getOwnPropertyDescriptors = function(object) {
				var descriptors = {},
					propertiers = Object.getOwnPropertyNames(object),
					i, property;

				for(i = 0; (property = propertiers[i]) !== undefined; i++) {
					descriptors[property] = Object.getOwnPropertyDescriptor(object, property);
				}

				return descriptors;
			};
		}

		if(Object.getOwnPropertyNames === undefined) {
			Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
				return Object.keys(object);
			};
		}

		if(Object.create === undefined) {
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
					empty.__proto__ = valueNull;

					parent.removeChild(iframe);
					iframe = valueNull;

					Empty.prototype = empty;

					createEmpty = function () {
						return new Empty();
					};

					return new Empty();
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

					Type.prototype = prototype;

					object = new Type();
					object.__proto__ = prototype;
				}

				if(properties !== void 0) {
					Object.defineProperties(object, properties);
				}

				return object;
			};
		}
	},
	window, document
));
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido/emitter',
		initialize = function initialize() {
			return window.qoopido.shared.prepareModule(namespace, definition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ './base' ], initialize);
	} else {
		initialize(window.qoopido.base);
	}
}(function(mPrototype, window, document, undefined) {
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
}, window, document));
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido/remux',
		initialize = function initialize() {
			return window.qoopido.shared.prepareModule(namespace, definition, arguments, true);
		};

	if(typeof define === 'function' && define.amd) {
		define([ './emitter' ], initialize);
	} else {
		initialize(window.qoopido.emitter);
	}
}(function(mPrototype, window, document, undefined) {
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
}, window, document));
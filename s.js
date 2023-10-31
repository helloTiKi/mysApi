! function() {
	Array.prototype.find || Object.defineProperty(Array.prototype, "find", {
		value: function(e) {
			if (null == this) throw new TypeError('"this" is null or not defined');
			var t = Object(this),
				r = t.length >>> 0;
			if ("function" != typeof e) throw new TypeError("predicate must be a function");
			for (var n = arguments[1], i = 0; i < r;) {
				var a = t[i];
				if (e.call(n, a, i, t)) return a;
				i++
			}
		}
	}), Array.prototype.includes || Object.defineProperty(Array.prototype, "includes", {
		value: function(e, t) {
			if (null == this) throw new TypeError('"this" is null or not defined');
			var r = Object(this),
				n = r.length >>> 0;
			if (0 === n) return !1;
			for (var i, a, o = 0 | t, u = Math.max(o >= 0 ? o : n - Math.abs(o), 0); u < n;) {
				if ((i = r[u]) === (a = e) || "number" == typeof i && "number" == typeof a && isNaN(i) && isNaN(a)) return !0;
				u++
			}
			return !1
		}
	}), Array.prototype.some || (Array.prototype.some = function(e) {
		if (null == this) throw new TypeError("Array.prototype.some called on null or undefined");
		if ("function" != typeof e) throw new TypeError;
		for (var t = Object(this), r = t.length >>> 0, n = arguments.length >= 2 ? arguments[1] : void 0, i = 0; i < r; i++)
			if (i in t && e.call(n, t[i], i, t)) return !0;
		return !1
	}), Array.prototype.findIndex || Object.defineProperty(Array.prototype, "findIndex", {
		value: function(e) {
			if (null == this) throw new TypeError('"this" is null or not defined');
			var t = Object(this),
				r = t.length >>> 0;
			if ("function" != typeof e) throw new TypeError("predicate must be a function");
			for (var n = arguments[1], i = 0; i < r;) {
				var a = t[i];
				if (e.call(n, a, i, t)) return i;
				i++
			}
			return -1
		}
	}), Array.prototype.reduce || Object.defineProperty(Array.prototype, "reduce", {
		value: function(e) {
			if (null === this) throw new TypeError("Array.prototype.reduce called on null or undefined");
			if ("function" != typeof e) throw new TypeError(e + " is not a function");
			var t, r = Object(this),
				n = r.length >>> 0,
				i = 0;
			if (arguments.length >= 2) t = arguments[1];
			else {
				for (; i < n && !(i in r);) i++;
				if (i >= n) throw new TypeError("Reduce of empty array with no initial value");
				t = r[i++]
			}
			for (; i < n;) i in r && (t = e(t, r[i], i, r)), i++;
			return t
		}
	}), Array.prototype.flat || Object.defineProperty(Array.prototype, "flat", {
		configurable: !0,
		value: function e() {
			var t = isNaN(arguments[0]) ? 1 : Number(arguments[0]);
			return t ? Array.prototype.reduce.call(this, function(r, n) {
				return Array.isArray(n) ? r.push.apply(r, e.call(n, t - 1)) : r.push(n), r
			}, []) : Array.prototype.slice.call(this)
		},
		writable: !0
	}), Promise.allSettled || (Promise.allSettled = function(e) {
		var t = e.map(function(e) {
			return Promise.resolve(e)
				.then(function(e) {
					return {
						status: "fulfilled",
						value: e
					}
				}, function(e) {
					return {
						status: "rejected",
						reason: e
					}
				})
		});
		return Promise.all(t)
	});
	var e = "pre-cache:",
		t = "runtime-cache",
		r = {
			1: "ios",
			2: "android",
			3: "pc",
			4: "web",
			5: "wap",
			8: "CloudAndroid",
			9: "CloudPC",
			10: "CloudMacOS"
		},
		n = /\.(json|html)(\?[^#]*)?(#.*)?$/i;
	var i = {
			fetch: function(e) {
				var t = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {})
					.fetchOptions;
				return fetch(e, t)
					.then(function(e) {
						if (200 !== e.status) {
							var t = new Error("Fetch Failed");
							throw t.response = e, t
						}
						return e
					})
			}
		},
		a = function(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		},
		o = function() {
			function e(e, t) {
				for (var r = 0; r < t.length; r++) {
					var n = t[r];
					n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
				}
			}
			return function(t, r, n) {
				return r && e(t.prototype, r), n && e(t, n), t
			}
		}(),
		u = function(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		},
		c = function(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		},
		s = function() {
			return function(e, t) {
				if (Array.isArray(e)) return e;
				if (Symbol.iterator in Object(e)) return function(e, t) {
					var r = [],
						n = !0,
						i = !1,
						a = void 0;
					try {
						for (var o, u = e[Symbol.iterator](); !(n = (o = u.next())
							.done) && (r.push(o.value), !t || r.length !== t); n = !0);
					} catch (e) {
						i = !0, a = e
					} finally {
						try {
							!n && u.return && u.return()
						} finally {
							if (i) throw a
						}
					}
					return r
				}(e, t);
				throw new TypeError("Invalid attempt to destructure non-iterable instance")
			}
		}(),
		h = function(e) {
			if (Array.isArray(e)) {
				for (var t = 0, r = Array(e.length); t < e.length; t++) r[t] = e[t];
				return r
			}
			return Array.from(e)
		};

	function l() {
		var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
			t = arguments[1];
		return e.reduce(function(e, t) {
			return e.then(t)
		}, Promise.resolve(t))
	}

	function f() {
		var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
			t = arguments[1];
		e.map(function(e) {
			return e.cacheDidUpdate(t)
		})
	}

	function p() {
		var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
			t = arguments[1];
		e.map(function(e) {
			return e.afterUpdateCache(t)
		})
	}
	var d = function() {
		function e() {
			a(this, e)
		}
		return o(e, [{
			key: "beforeCache",
			value: function(e, t) {
				return t
			}
		}, {
			key: "beforeResponse",
			value: function(e, t) {
				return t
			}
		}, {
			key: "cacheDidUpdate",
			value: function(e) {}
		}, {
			key: "afterUpdateCache",
			value: function(e) {}
		}]), e
	}();

	function v(e) {
		for (var t = location.search.substring(1)
			.split("&"), r = 0; r < t.length; r++) {
			var n = t[r].split("=");
			if (n[0] === e) return decodeURIComponent ? decodeURIComponent(n[1]) : n[1]
		}
		return null
	}

	function m() {
		var e = v("platform");
		return Number.isNaN(+e) ? e : r[e]
	}

	function g() {
		var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
			t = arguments[1];
		return "string" == typeof e && "string" == typeof t && e.toLowerCase()
			.includes(t.toLowerCase())
	}

	function y(e) {
		return new Promise(function(t) {
			return setTimeout(t, e)
		})
	}
	var w = 2e3;

	function b(e) {
		if (!e) return Promise.resolve(null);
		var t = Date.now();
		return function e(t, r) {
				return Promise.resolve(t)
					.then(function(n) {
						return n()
							.then(function(n) {
								return n || y(r)
									.then(function() {
										return e(t, r)
									})
							})
					})
			}(function() {
				return r = e, self.clients.matchAll({
						type: "window"
					})
					.then(function() {
						var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
						return Date.now() - t > w ? Promise.reject(Error("find resulting window timeout")) : e.find(function(e) {
							return r === e.id
						})
					});
				var r
			}, 100)
			.catch(function() {
				return null
			})
	}

	function R(e, t) {
		if (!e || !t) return !1;
		var r = function(e) {
				return e ? e.split("&")
					.map(function(e) {
						var t = e.split("=");
						return {
							key: t[0],
							value: t[1]
						}
					}) : []
			},
			n = e.split("?")[0],
			i = e.split("?")[1],
			a = t.split("?")[0],
			o = t.split("?")[1];
		if (n !== a) return !1;
		var u = r(i),
			c = r(o);
		return u.every(function(e) {
			return c.some(function(t) {
				return t.key = e.key && t.value === e.value
			})
		})
	}

	function C(e) {
		return e.reduce(function(e, t) {
			var r, n = t.url || t;
			return n && "string" == typeof n && (r = n, !e.some(function(e) {
				return (e.url || e) === r
			})) && e.push(t), e
		}, [])
	}

	function O() {
		if (self.isIos) {
			var e = new Headers;
			return e.append("Cache-Control", "max-age=0"), {
				headers: e
			}
		}
		return {
			cache: "no-cache"
		}
	}

	function x(e) {
		return e.split("?")[0].split("#")[0]
	}

	function A(e) {
		var t = e.cacheName,
			r = e.request,
			n = e.matchOptions,
			i = void 0 === n ? {} : n,
			a = e.plugins,
			o = void 0 === a ? [] : a,
			u = t ? caches.open(t) : Promise.resolve(caches);
		return u.then(function(e) {
			var t, n = (t = r.url, i.ignoreSearch ? x(r.url) : t);
			return e.match(n)
				.then(function(e) {
					if (e && 200 === e.status) return function() {
						var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
							t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
							r = t.request,
							n = t.cachedResponse;
						return l(e.map(function(e) {
							return function(t) {
								return e.beforeResponse(r, t)
							}
						}), n)
					}(o, {
						request: r,
						cachedResponse: e
					});
					throw new Error("cache match failed：" + n)
				})
		})
	}
	var P = {
		put: function(e) {
			var t = e.cacheName,
				r = e.request,
				n = e.response,
				i = e.event,
				a = e.plugins,
				o = void 0 === a ? [] : a,
				u = e.cacheOptions,
				c = void 0 === u ? {} : u;
			! function() {
				var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
					t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
					r = t.request,
					n = t.response;
				l(e.map(function(e) {
					return function(t) {
						return e.beforeCache(r, t)
					}
				}), n)
			}(o, {
				request: r,
				response: n
			});
			var s = c.ignoreSearch ? x(r.url) : r.url,
				h = function(e) {
					return [p, f].map(function(r) {
						return r(o, {
							cacheName: t,
							event: i,
							newResponse: n,
							oldResponse: e
						})
					})
				},
				d = {
					ignoreSearch: c.ignoreSearch
				};
			return caches.open(t)
				.then(function(e) {
					return A({
							cacheName: t,
							request: r,
							matchOptions: d
						})
						.then(h)
						.catch(function() {
							A({
									request: r,
									matchOptions: d
								})
								.then(h)
								.catch(function(e) {
									console.log(t, "putWrapper getCache ", e)
								})
						}), e.put(s, n.clone())
				})
		},
		match: A
	};

	function E() {
		var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
			r = e.fetchOptions,
			n = e.cacheName,
			a = void 0 === n ? t : n,
			o = e.matchOptions,
			u = e.cacheOptions,
			c = arguments[1];
		return function(e) {
			var t = e.request,
				n = e.runtimeCacheRequest,
				s = i.fetch(t, {
					fetchOptions: r
				})
				.then(function(r) {
					P.put({
						cacheName: a,
						request: n || t,
						response: r,
						event: e,
						cacheOptions: u,
						plugins: c
					})
				});
			return function(e) {
					var t = e.request,
						r = e.cacheName,
						n = e.matchOptions,
						i = e.plugins;
					return P.match({
							request: t,
							cacheName: r,
							matchOptions: n,
							plugins: i
						})
						.catch(function() {
							return P.match({
								request: t,
								matchOptions: n,
								plugins: i
							})
						})
						.catch(function(e) {
							console.log("staleWhileRevalidate getCache err: ", e)
						})
				}({
					request: n || t,
					cacheName: a,
					matchOptions: o,
					plugins: c
				})
				.catch(function() {
					return s
				})
		}
	}

	function k(e) {
		var t = e.newResponse.headers.get("content-type");
		return t && t.toLowerCase()
			.includes("application/json") ? e.newResponse.clone()
			.json()
			.then(function(t) {
				return {
					cacheName: e.cacheName,
					updatedURL: e.event.request.url,
					response: t
				}
			}) : Promise.resolve({
				cacheName: e.cacheName,
				updatedURL: e.event.request.url
			})
	}
	var N = function(e) {
			function t() {
				var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
					r = e.headersToCheck,
					n = void 0 === r ? ["content-length", "etag", "last-modified"] : r,
					i = e.generatePayload,
					o = void 0 === i ? k : i;
				a(this, t);
				var u = c(this, (t.__proto__ || Object.getPrototypeOf(t))
					.call(this));
				return u._headersToCheck = n, u._generatePayload = o, u
			}
			return u(t, d), o(t, [{
				key: "cacheDidUpdate",
				value: function(e) {
					this._notifyIfUpdated(e)
				}
			}, {
				key: "afterUpdateCache",
				value: function(e) {
					this._postMessage2Window(e, {
						type: "UPDATE_CACHE"
					})
				}
			}, {
				key: "_notifyIfUpdated",
				value: function(e) {
					var t = this;
					if (e.oldResponse) {
						var r, n, i, a = e.event.resultingClientId;
						if (r = e.oldResponse, n = e.newResponse, (i = this._headersToCheck)
							.some(function(e) {
								return r.headers.has(e) && n.headers.has(e)
							}) && !i.every(function(e) {
								var t = r.headers.has(e) === n.headers.has(e),
									i = r.headers.get(e) === n.headers.get(e);
								return t && i
							})) "navigate" === (e.event.request ? e.event.request.mode : "") ? b(a)
							.then(function(r) {
								!r || self.isSafari ? y(3500)
									.then(function() {
										return t._postMessage2Window(e)
									}) : t._postMessage2Window(e)
							}) : this._postMessage2Window(e)
					}
				}
			}, {
				key: "_postMessage2Window",
				value: function(e) {
					var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
						r = t.type,
						n = void 0 === r ? "CACHE_UPDATED" : r,
						i = t.meta,
						a = void 0 === i ? "mihoyo-sw-broadcast-update" : i;
					this._generatePayload(e)
						.then(function(e) {
							var t = {
								type: n,
								meta: a,
								payload: e
							};
							console.log("sw postMessage2Window"), self.clients.matchAll({
									type: "window"
								})
								.then(function(e) {
									console.log("sw matchWindow windows.length:", e.length);
									for (var r = 0; r < e.length; r++) e[r].postMessage(t)
								})
						})
						.catch(function(e) {
							console.log("BroadCastUpdatePlugin generatePayload err: ", e)
						})
				}
			}]), t
		}(),
		j = function() {
			function e(t) {
				var r = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {})
					.cacheName;
				a(this, e), this.router = t, this.cacheName = r, this.fetchOptions = Object.assign({
					credentials: "same-origin",
					mode: "cors"
				}, O())
			}
			return o(e, [{
				key: "cacheResources",
				value: function() {
					var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
						t = this,
						r = arguments[1],
						i = (arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {})
						.replaceCache;
					return console.log("cacheName", r, e), caches.open(r)
						.then(function(r) {
							return Promise.all(e.map(function(e) {
								var a = e.response,
									o = e.url;
								return "string" == typeof e && (o = e), r.match(o)
									.then(function(e) {
										if (!e || i) {
											if (a && 200 === a.status) return r.put(o, a);
											var u = n.test(o),
												c = new Request(o, t.fetchOptions);
											return r.add(u ? c : o)
												.catch(function() {})
										}
									}), e
							}))
						})
				}
			}, {
				key: "clearExpireCache",
				value: function(e) {
					var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.cacheName;
					if (e && e.length) {
						var r = e.map(function(e) {
							return e.url || e
						});
						caches.open(t)
							.then(function(e) {
								e.keys()
									.then(function(t) {
										t.forEach(function(t) {
											r.some(function(e) {
												return R(e, t.url)
											}) || e.delete(t)
										})
									})
							})
					}
				}
			}, {
				key: "precache",
				value: function(e) {
					return this.cacheResources(e, this.cacheName)
				}
			}, {
				key: "addRoute",
				value: function() {
					var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
						t = E({
							matchOptions: arguments[1],
							fetchOptions: this.fetchOptions
						}, [new N]);
					this.router.registerRoute("precacheRoute", function(t) {
						return e.some(function(e) {
							return e.url === t.url
						})
					}, function(r) {
						return !!e.find(function(e) {
							return e.url === r.request.url
						}) && t(r)
					}), this.clearExpireCache(e)
				}
			}, {
				key: "cacheAndRoutePageCache",
				value: function() {
					var e = this,
						t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
						r = arguments[1];
					return this.precache(t)
						.then(function() {
							return e.addRoute(t, r)
						})
				}
			}], [{
				key: "initEventListener",
				value: function() {
					self.addEventListener("activate", function() {
						console.log("####activate####"), self.clients.claim()
					})
				}
			}]), e
		}();

	function q() {
		var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
			t = e.cacheName,
			r = e.fetchOptions,
			n = e.matchOptions,
			a = arguments[1];
		return function(e) {
			var o = e.request;
			return P.match({
					request: o,
					cacheName: t,
					matchOptions: n,
					plugins: a
				})
				.catch(function() {
					return i.fetch(o, {
						fetchOptions: r
					})
				})
				.catch(function(e) {
					console.log("cacheFirst getCache err: ", e)
				})
		}
	}

	function S(e, t, r) {
		return e.arrayBuffer()
			.then(function(t) {
				var n = function(e, t, r) {
						var n = e.byteLength;
						if (r && r > n || t && t < 0) throw new Error("range-not-satisfiable:" + {
							size: n,
							end: r,
							start: t
						});
						var i = void 0,
							a = void 0;
						return void 0 !== t && void 0 !== r ? (i = t, a = r + 1) : void 0 !== t && void 0 === r ? (i = t, a = n) : void 0 !== r && void 0 === t && (i = n - r, a = n), {
							start: i,
							end: a
						}
					}(t, r.start, r.end),
					i = t.slice(n.start, n.end),
					a = i.byteLength,
					o = new Response(i, {
						status: 206,
						statusText: "Partial Content",
						headers: e.headers
					});
				return o.headers.set("status", "206"), o.headers.set("content-length", String(a)), o.headers.set("content-range", "bytes " + n.start + "-" + (n.end - 1) + "/" + t.byteLength), o
			})
	}

	function _(e, t) {
		if (206 === t.status) return t;
		var r = e.headers.get("range");
		if (!r) throw new Error("no range header");
		return S(t, 0, function(e) {
			var t = e.trim()
				.toLowerCase();
			if (!t.startsWith("bytes=")) throw new Error("unit-must-be-bytes " + t);
			if (t.includes(",")) throw new Error("single-range-only:" + t);
			var r = /(\d*)-(\d*)/.exec(t);
			if (!r || !r[1] && !r[2]) throw new Error("invalid-range-values:" + t);
			return {
				start: "" === r[1] ? void 0 : Number(r[1]),
				end: "" === r[2] ? void 0 : Number(r[2])
			}
		}(r))
	}
	var W = function(e) {
			function t() {
				return a(this, t), c(this, (t.__proto__ || Object.getPrototypeOf(t))
					.apply(this, arguments))
			}
			return u(t, d), o(t, [{
				key: "beforeResponse",
				value: function(e, t) {
					try {
						return t && e.headers.get("range") && self.isSafari ? _(e, t) : t
					} catch (e) {
						return Promise.reject(e)
					}
				}
			}]), t
		}(),
		F = function(r) {
			function i(e) {
				a(this, i);
				var t = c(this, (i.__proto__ || Object.getPrototypeOf(i))
					.call(this, e));
				return t.pages = [], t.pageResources = [], t.pageRuntimeCacheReg = n, j.initEventListener(), t
			}
			return u(i, j), o(i, [{
				key: "cacheAndRoutePageCache",
				value: function() {
					var e = this,
						t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
						r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
						n = t.map(function(t) {
							return {
								runtimeCacheAssets: t.assets.filter(function(t) {
									return e.pageRuntimeCacheReg.test(t)
								}),
								preCacheAssets: t.assets.filter(function(t) {
									return !e.pageRuntimeCacheReg.test(t)
								}),
								url: t.url
							}
						});
					return this.pages = t, this.pageResources = this.pages.reduce(function(e, t) {
						return e.concat(t.assets)
					}, []), this.addRoute(n, r), this.precache(n)
				}
			}, {
				key: "cacheAndRouteRuntimeCache",
				value: function(e, t) {
					var r = this,
						n = e.runtimeCache,
						i = e.routerNameSpace,
						a = void 0 === i ? "pageRuntime" : i,
						o = e.cacheNameSpace;
					console.log("runtimeCache: ", n), this.cacheRuntimeCache({
							runtimeCache: n,
							routerNameSpace: a,
							cacheNameSpace: o
						})
						.then(function(e) {
							e.forEach(function(e) {
								r.routeRuntimeCache(e, t)
							})
						})
				}
			}, {
				key: "precache",
				value: function(r) {
					var n = this,
						i = function(t, r) {
							return n.cacheResources(t.map(function(e) {
								return {
									url: e
								}
							}), e + r)
						},
						a = function(e, t) {
							return n.cacheResources(e.map(function(e) {
								return {
									url: e
								}
							}), t, {
								replaceCache: !0
							})
						},
						o = r.map(function(e) {
							var r = e.runtimeCacheAssets,
								n = void 0 === r ? [] : r,
								o = e.preCacheAssets,
								u = void 0 === o ? [] : o,
								c = e.url;
							return Promise.all([a(n, t), i(u, c)])
						});
					return Promise.all(o)
				}
			}, {
				key: "addRoute",
				value: function(e, t) {
					var r = this;
					this.registerRoute("pagePrecacheRoute", function(e) {
						return r.pageResources.some(function(t) {
							return r.requestUrlIsMatchPageRule(e.url, t)
						})
					}, function(e) {
						var n = e.request.url;
						return r.pageRuntimeCacheReg.test(n) ? E({
							matchOptions: Object.assign({}, t, {
								ignoreSearch: !0
							}),
							cacheOptions: {
								ignoreSearch: !0
							},
							fetchOptions: r.fetchOptions
						}, [new W])(e) : q({
							matchOptions: t,
							fetchOptions: r.fetchOptions
						}, [new W])(e)
					})
				}
			}, {
				key: "cacheRuntimeCache",
				value: function() {
					var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
						t = e.runtimeCache,
						r = e.routerNameSpace,
						n = void 0 === r ? "" : r,
						i = e.cacheNameSpace,
						a = i || "page-runtime-cacheFirst",
						o = i || "page-runtime-staleWhileRevalidate",
						u = [this.cacheResources(t.cacheFirst, a), this.cacheResources(t.staleWhileRevalidate, o, {
							replaceCache: !0
						})];
					return a === o ? this.clearExpireCache(t.cacheFirst.concat(t.staleWhileRevalidate), a) : (this.clearExpireCache(t.cacheFirst, a), this.clearExpireCache(t.staleWhileRevalidate, o)), Promise.all(u)
						.then(function(e) {
							var t = s(e, 2),
								r = t[0],
								i = t[1];
							return [{
								cacheName: a,
								runtimeCache: r,
								strategy: q,
								routerName: n + "CacheFirst"
							}, {
								cacheName: o,
								runtimeCache: i,
								strategy: E,
								routerName: n + "StaleWhileRevalidate",
								plugins: [new N]
							}]
						})
				}
			}, {
				key: "routeRuntimeCache",
				value: function(e, t) {
					var r = this,
						n = e.cacheName,
						i = e.routerName,
						a = e.strategy,
						o = e.runtimeCache,
						u = void 0 === o ? [] : o,
						c = e.plugins;
					if (0 !== u.length) {
						var s, h;
						this.registerRoute(i, (h = u, function(e) {
							return h.some(function(t) {
								return R(t.url, e.url)
							})
						}), (s = u, function(e) {
							var i = s.find(function(t) {
								return R(t.url, e.request.url)
							});
							return !!i && (e.runtimeCacheRequest = new Request(i.url, e.request), a({
								matchOptions: t,
								cacheName: n,
								fetchOptions: r.fetchOptions
							}, c)(e))
						}))
					}
				}
			}, {
				key: "registerRoute",
				value: function(e, t, r) {
					this.router.registerRoute(e, t, r)
				}
			}, {
				key: "clearExpirePageCache",
				value: function() {
					var r = this,
						n = this.pages.map(function(t) {
							return e + t.url
						}),
						i = function(e) {
							var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
							return caches.open(e)
								.then(function(e) {
									return e.keys()
										.then(function(r) {
											return Promise.all(r.filter(function(e) {
													return !t.includes(e.url)
												})
												.map(function(t) {
													return e.delete(t.url)
												}))
										})
								})
						};
					return caches.keys()
						.then(function(a) {
							return Promise.all(a.map(function(a) {
								if (a.startsWith(e)) {
									if (!n.includes(a)) return caches.delete(a);
									var o = r.pages.find(function(t) {
										return t.url === a.split(e)[1]
									}) || {};
									return i(t, o.assets)
										.then(function() {
											return i(a, o.assets)
										})
								}
								return Promise.resolve("no caches to delete")
							}))
						})
				}
			}, {
				key: "requestUrlIsMatchPageRule",
				value: function(e, t) {
					return this.pageRuntimeCacheReg.test(e) ? t === x(e) : t === e
				}
			}]), i
		}();

	function T(e, t) {
		switch (Object.prototype.toString.call(e)) {
			default:
				return !1;
			case "[object String]":
				return t.url === e;
			case "[object RegExp]":
				return t.url.match(e);
			case "[object Function]":
				return e(t)
		}
	}

	function U(e, t) {
		try {
			var r = t(e);
			if (r instanceof Promise) {
				var n = r.then(function(e) {
						if (!(e instanceof Response)) throw Error("返回结果异常");
						return e
					})
					.catch(function(t) {
						return t.response || fetch(e.request.clone())
					})
					.catch(function() {});
				return void e.respondWith(n)
			}
			r instanceof Response && e.respondWith(r)
		} catch (e) {
			console.log(e)
		}
	}
	var L = function() {
			function e(t) {
				a(this, e), this.useProxy = !0, this.routes = [], this.initEventListener(t)
			}
			return o(e, [{
				key: "initEventListener",
				value: function(e) {
					var t = this;
					try {
						self.addEventListener("install", function(t) {
							console.log("####install####"), t.waitUntil(e && e(t))
						}), self.addEventListener("fetch", function(e) {
							if (console.log("fetch routes: ", t.routes.map(function(e) {
									return e.ruleName
								})
								.toString()), t.useProxy)
								for (var r = 0; r < t.routes.length; r++) {
									var n = t.routes[r];
									if (e.request.url.startsWith("https:") && /get/i.test(e.request.method) && T(n.rule, e.request)) {
										U(e, n.handler);
										break
									}
								}
						})
					} catch (e) {
						console.log("initEventListenerError", e)
					}
				}
			}, {
				key: "registerRoute",
				value: function() {
					var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "route-cache",
						t = arguments[1],
						r = arguments[2];
					this.unRegisterRoute(e), this.routes.push({
						ruleName: e,
						rule: t,
						handler: r
					})
				}
			}, {
				key: "unRegisterRoute",
				value: function(e) {
					var t = this.routes.findIndex(function(t) {
						return t.ruleName === e
					}); - 1 !== t && this.routes.splice(t, 1)
				}
			}, {
				key: "setProxy",
				value: function(e) {
					this.useProxy = e
				}
			}]), e
		}(),
		I = {
			"zh-cn": /^zh-cn/i,
			"zh-tw": /^zh-tw/i,
			"en-us": /^en\b/i,
			"fr-fr": /^fr\b/i,
			"de-de": /^de\b/i,
			"es-es": /^es\b/i,
			"pt-pt": /^pt\b/i,
			"ru-ru": /^ru\b/i,
			"ja-jp": /^ja\b/i,
			"ko-kr": /^ko\b/i,
			"th-th": /^th\b/i,
			"vi-vn": /^vi\b/i,
			"id-id": /^id\b/i
		};
	var D = m(),
		M = v("network") || "WiFi";

	function z() {
		var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
			r = t.enable,
			n = t.load_limit,
			i = void 0 === n ? 3 : n,
			a = t.pages,
			o = void 0 === a ? [] : a,
			u = (new Date)
			.getTime(),
			c = o.map(function(e) {
				if (e.assets = e.res_list.map(function(e) {
					return encodeURI(e)
				}), e.runtimeCache = [], e.runtime_cache) try {
					e.runtimeCache = JSON.parse(e.runtime_cache)
				} catch (e) {
					console.log("parseRuntimeCacheString", e)
				}
				return e
			})
			.filter(function(e) {
				return function(e) {
					return g(e.platform, D)
				}(e) && function() {
					var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
						t = e.end_time,
						r = void 0 === t ? "" : t,
						n = e.start_time,
						i = void 0 === n ? "" : n,
						a = new Date(r.replace(/-/g, "/"))
						.getTime(),
						o = new Date(i.replace(/-/g, "/"))
						.getTime();
					return u < a && u >= o
				}(e)
			}),
			s = c.filter(function(e) {
				return function(e) {
					return g(e.network, M)
				}(e)
			});
		return r ? caches.keys()
			.then(function(t) {
				return {
					precachePages: s.filter(function(r) {
						return !!t.includes(e + r.url) || --i >= 0
					}),
					routePages: c,
					enable: r
				}
			}) : {
				precachePages: [],
				routePages: c,
				enable: r
			}
	}

	function V(e) {
		return Promise.allSettled(e)
			.then(function(e) {
				return e.filter(function(e) {
						return "fulfilled" !== e.status && console.log("reason", e.reason), "fulfilled" === e.status
					})
					.map(function(e) {
						return e.value
					})
			})
	}

	function B(e) {
		var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
		return t.split(".")
			.reduce(function(e, t) {
				var r, n, i, a = (n = (r = t)
					.indexOf("["), i = r.indexOf("]"), 0 === n && i > -1 ? r.substring(n + 1, i) : r);
				return Array.isArray(e) && isNaN(Number(t)) ? e.map(function(e) {
						return e ? e[a] : e
					})
					.flat() : e ? e[a] : e
			}, e)
	}

	function H(e, t) {
		if (Array.isArray(e.query)) {
			var r = !0,
				n = e.url.includes("?") ? e.url + "&" : e.url + "?",
				i = e.query.reduce(function(e, n, i) {
					var a = function(e) {
							if ("string" == typeof e) return {
								queryKey: e,
								queryValue: t[e]
							};
							var r = B(t, e.value);
							return {
								queryKey: e.key,
								queryValue: r
							}
						}(n),
						o = a.queryKey,
						u = a.queryValue;
					return u || (r = !1), e + (i ? "&" : "") + o + "=" + u
				}, n);
			return r ? i : ""
		}
		return e.url
	}

	function K() {
		var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
			t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
			r = function(e, t) {
				return e.map(function(e) {
						return function(e, t, r) {
								if (!t) return Array.isArray(e) ? e : [e];
								var n = new RegExp(t, r),
									i = function(e, t) {
										return e.match(t) || []
									},
									a = function(e) {
										return /\.(png|je?pg|gif|svg)/.test(e.split("?")[0])
									};
								return Array.isArray(e) ? e.map(function(e) {
										return i(e, n)
											.filter(a)
									})
									.flat() : i(e, n)
									.filter(a)
							}(B(t, e.key || e), e.regExp, e.flags)
							.map(function(e) {
								return {
									href: e,
									handler: "cacheFirst",
									useCache: !0
								}
							})
					})
					.flat()
			},
			n = function(e, r) {
				return K(e, Object.assign({}, t, {
					$: r
				}))
			},
			i = e.map(function(e) {
				e.href = H(e, t);
				var i = e.href,
					a = e.handler,
					o = void 0 === a ? "cacheFirst" : a,
					u = e.useCache,
					c = {
						href: i,
						handler: o,
						useCache: void 0 === u || u
					},
					s = Promise.resolve([]);
				if (Array.isArray(e.assets) || Array.isArray(e.next)) {
					if (!e.href || !e.href.startsWith("https")) return Promise.resolve(c);
					s = function(e) {
							var t = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {})
								.fetchOptions;
							return fetch(e, t)
								.then(function(e) {
									if (200 !== e.status) throw Error("status:" + e.status);
									return e
								})
						}(e.href)
						.then(function(e) {
							return c.response = e.clone(), e.json()
						})
				}
				if (Array.isArray(e.assets) && Array.isArray(e.next)) return s.then(function(t) {
					var i = r(e.assets, t);
					i.unshift(c);
					var a = i.map(function(e) {
						return Promise.resolve(e)
					});
					return a.push(n(e.next, t)), V(a)
				});
				if (Array.isArray(e.assets)) return s.then(function(t) {
					var n = r(e.assets, t);
					return n.unshift(c), n
				});
				if (Array.isArray(e.next)) {
					var h = s.then(function(t) {
						return n(e.next, t)
					});
					return V([Promise.resolve(c), h])
				}
				return Promise.resolve(c)
			});
		return V(i)
	}

	function J() {
		return (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {})
			.reduce(function(e, t) {
				if (t.query && t.query.length) e.runtimeCache.push(t);
				else {
					var r = e.staticCache[t.handler];
					r && r.push({
						url: t.url
					})
				}
				return e
			}, {
				staticCache: {
					cacheFirst: [],
					staleWhileRevalidate: []
				},
				runtimeCache: []
			})
	}

	function $() {
		var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
			t = arguments[1];
		return e.map(function(e) {
				return function(e, t) {
					var r = {
						cacheFirst: [],
						staleWhileRevalidate: []
					};
					return e.length ? (console.log("parseRuntimeCacheConfig runtimeCaches:", e, t), K(e, t)
						.then(function(e) {
							return e.flat(1 / 0)
								.filter(function(e) {
									return e.useCache && e.href
								})
								.reduce(function(e, t) {
									var r = {
										url: t.href,
										response: t.response
									};
									return e[t.handler] = C(e[t.handler].concat(r)
										.flat()), e
								}, r)
						})) : Promise.resolve(r)
				}(e, t)
			})
			.reduce(function(e, t) {
				return e.then(function(e) {
					var r = e.cacheFirst,
						n = e.staleWhileRevalidate;
					return t.then(function(e) {
						return {
							cacheFirst: r.concat(e.cacheFirst),
							staleWhileRevalidate: n.concat(e.staleWhileRevalidate)
						}
					})
				})
			})
			.then(function(e) {
				var t = e.cacheFirst,
					r = e.staleWhileRevalidate;
				return {
					cacheFirst: C(t),
					staleWhileRevalidate: C(r)
				}
			})
	}

	function G() {
		return "[object process]" === Object.prototype.toString.call("undefined" != typeof process ? process : 0) ? global : "undefined" != typeof window ? window : "undefined" != typeof self ? self : {}
	}
	var X, Q, Y, Z, ee = (X = Date.now(), Q = 0, Y = {
		now: function() {
			var e = Date.now() - X;
			return e < Q && (e = Q), Q = e, e
		},
		timeOrigin: X
	}, (Z = G()
		.performance) && Z.now ? (void 0 === Z.timeOrigin && (Z.timeOrigin = Z.timing && Z.timing.navigationStart || X), Z) : Y);

	function te() {
		return (ee.timeOrigin + ee.now()) / 1e3
	}
	var re = new(function() {
		function e() {
			a(this, e)
		}
		return o(e, [{
			key: "init",
			value: function() {
				var e, t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
				this.dsn = t.dsn, this.isSea = "webstatic-sea.mihoyo.com" === (e = location.host) || /hoyoverse/i.test(e), this.isTest = function(e) {
					return /-test/i.test(e)
				}(location.host), this.createApi(), this.globalObject = G(), this.proxyFetch(), this.initEventListener()
			}
		}, {
			key: "initEventListener",
			value: function() {
				var e = this;
				self.addEventListener("error", function(t) {
					e.captureException(t.error)
				})
			}
		}, {
			key: "proxyFetch",
			value: function() {
				var e = this;
				this.globalObject.originalFetch = this.globalObject.fetch;
				var t = function(t, r) {
					return e.globalObject.originalFetch(t, r)
						.then(function(e) {
							if (e.status >= 300 || e.status < 200) throw new TypeError("proxyFetch:Failed to fetch，status：" + e.status);
							return e
						})
						.catch(function(n) {
							var i = new TypeError("proxyFetch:" + n.message);
							throw e.captureException(i, {
								fetchInfo: {
									url: t.url || t,
									method: r ? r.method : "GET"
								}
							}), n
						})
				};
				this.globalObject.fetch = t
			}
		}, {
			key: "createApi",
			value: function() {
				var e = this.dsn.split("https://")[1].split("@sentry.mihoyo.com/"),
					t = s(e, 2),
					r = t[0],
					n = t[1],
					i = this.isSea ? "https://sentry-sea.hoyoverse.com" : "https://sentry.mihoyo.com";
				this.api = i + "/api/" + n + "/store/?sentry_key=" + r + "&sentry_version=7"
			}
		}, {
			key: "postException",
			value: function(e) {
				return this.globalObject.originalFetch(this.api, {
						method: "post",
						headers: {
							accept: "*/*",
							"accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
							"content-type": "text/plain;charset=UTF-8",
							"sec-fetch-dest": "empty",
							"sec-fetch-mode": "cors",
							"sec-fetch-site": "cross-site"
						},
						body: JSON.stringify(e)
					})
					.catch(function() {})
			}
		}, {
			key: "createData",
			value: function(e, t) {
				var r = t.fetchInfo,
					n = this.globalObject,
					i = n.navigator,
					a = n.location,
					o = i ? i.userAgent : "unknown ua",
					u = a ? a.href : "unknown url",
					c = function() {
						var e = G(),
							t = e.crypto || e.msCrypto;
						if (void 0 !== t && t.getRandomValues) {
							var r = new Uint16Array(8);
							t.getRandomValues(r), r[3] = 4095 & r[3] | 16384, r[4] = 16383 & r[4] | 32768;
							var n = function(e) {
								for (var t = e.toString(16); t.length < 4;) t = "0" + t;
								return t
							};
							return n(r[0]) + n(r[1]) + n(r[2]) + n(r[3]) + n(r[4]) + n(r[5]) + n(r[6]) + n(r[7])
						}
						return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(e) {
							var t = 16 * Math.random() | 0;
							return ("x" === e ? t : 3 & t | 8)
								.toString(16)
						})
					}(),
					h = [];
				if (r) {
					var l = r.method,
						f = r.url,
						p = (void 0 === f ? "" : f)
						.split("?"),
						d = s(p, 1)[0],
						v = Object.prototype.toString.call(d);
					"[object String]" !== v && (d = "unknown request url;url type:" + v), h.push({
						timestamp: te(),
						category: "fetch",
						data: {
							method: (l || "get")
								.toLocaleUpperCase(),
							url: d
						},
						level: "error",
						type: "http"
					})
				}
				return {
					event_id: c,
					request: {
						headers: {
							"User-Agent": o
						},
						url: u
					},
					exception: {
						values: [{
							type: e.name,
							value: e.message,
							mechanism: {
								handled: !0,
								type: "generic"
							}
						}]
					},
					breadcrumbs: h,
					level: "error",
					platform: "javascript",
					timeStamp: te()
				}
			}
		}, {
			key: "captureException",
			value: function(e) {
				var t = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {})
					.fetchInfo,
					r = this.createData(e, {
						fetchInfo: t
					});
				this.postException(r)
			}
		}]), e
	}());
	re.init({
		dsn: "https://690b1e8e41244bb1aafa7bf1b7ef559e@sentry.mihoyo.com/23"
	});
	try {
		var ne = self.navigator ? self.navigator.userAgent : "Safari";
		self.isSafari = (/Safari/i.test(ne) || !!ne.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) && !/Chrome/i.test(ne), self.isIos = /ios/i.test(m()), self.env = "prod";
		var ie = v("gameBiz"),
			ae = function(e) {
				return Object.keys(I)
					.find(function(t) {
						return I[t].test(e)
					}) || "zh-cn"
			}(ie.endsWith("_cn") ? "zh-cn" : v("lang")),
			oe = 1e3 * Math.floor((new Date)
				.getTime() / 1e4) * 10,
			ue = location.origin + "/" + (/beta/.test(self.env) ? "beta/" : "") + "admin/swpreload/" + ie + "/" + ae + ".json?timestamp=" + oe,
			ce = new L,
			se = new F(ce),
			he = [],
			le = fetch(ue, O())
			.then(function(e) {
				return e.json()
			})
			.then(z)
			.then(function(e) {
				var t = e.precachePages,
					r = e.routePages,
					n = e.enable;
				ce.setProxy(n), ce.unRegisterRoute("precacheRoute"), he = t.map(function(e) {
					return J(e.runtimeCache)
						.runtimeCache
				});
				var i = t.reduce(function(e, t) {
					var r, n, i = J(t.runtimeCache)
						.staticCache;
					return (r = e.cacheFirst)
						.push.apply(r, h(i.cacheFirst)), (n = e.staleWhileRevalidate)
						.push.apply(n, h(i.staleWhileRevalidate)), e
				}, {
					cacheFirst: [],
					staleWhileRevalidate: []
				});
				return se.cacheAndRouteRuntimeCache({
					runtimeCache: i,
					routerNameSpace: "pageRuntimeStatic",
					cacheNameSpace: "page-runtime-static"
				}), t && t.length ? se.cacheAndRoutePageCache(t) : se.addRoute(r)
			})
			.catch(function(e) {
				throw se.addRoute([]), e
			})
			.then(function() {
				return se.clearExpirePageCache()
			})
			.then(self.skipWaiting)
			.catch(function(e) {
				return re.captureException(e)
			});
		self.addEventListener("message", function(e) {
			var t = e.data || {},
				r = t.meta,
				n = t.data;
			n.game_biz = n.game_biz || n.gameBiz, "useRuntimeCache" === r && le.then(function() {
				$(he, n)
					.then(function(e) {
						return se.cacheAndRouteRuntimeCache({
							runtimeCache: e
						})
					})
			})
		})
	} catch (e) {
		throw self.isIos && re.captureException(e), e
	}
}();
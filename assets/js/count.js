!(function () {
    "use strict";
    var t = function (t, e, n) {
            var a = t[e];
            return function () {
                for (var e = [], i = arguments.length; i--; ) e[i] = arguments[i];
                return n.apply(null, e), a.apply(t, e);
            };
        },
        e = function () {
            var t = window.doNotTrack,
                e = window.navigator,
                n = window.external,
                a = "msTrackingProtectionEnabled",
                i = t || e.doNotTrack || e.msDoNotTrack || (n && a in n && n[a]());
            return "1" == i || "yes" === i;
        };
    !(function (n) {
        var a = n.screen,
            i = a.width,
            r = a.height,
            o = n.navigator.language,
            c = n.location,
            s = c.hostname,
            u = c.pathname,
            l = c.search,
            d = n.localStorage,
            f = n.document,
            v = n.history,
            p = f.querySelector("script[data-website-id]");
        if (p) {
            var m,
                g,
                h = p.getAttribute.bind(p),
                y = h("data-website-id"),
                w = h("data-host-url"),
                b = "false" !== h("data-auto-track"),
                S = h("data-do-not-track"),
                k = "false" !== h("data-css-events"),
                E = h("data-domains") || "",
                N = E.split(",").map(function (t) {
                    return t.trim();
                }),
                T = /^umami--([a-z]+)--([\w]+[\w-]*)$/,
                q = "[class*='umami--']",
                A = function () {
                    return (d && d.getItem("umami.disabled")) || (S && e()) || (E && !N.includes(s));
                },
                O = w ? ((m = w) && m.length > 1 && m.endsWith("/") ? m.slice(0, -1) : m) : p.src.split("/").slice(0, -1).join("/"),
                j = i + "x" + r,
                L = {},
                _ = "" + u + l,
                x = f.referrer,
                H = function () {
                    return { website: y, hostname: s, screen: j, language: o, url: _ };
                },
                R = function (t, e) {
                    return (
                        Object.keys(e).forEach(function (n) {
                            t[n] = e[n];
                        }),
                        t
                    );
                },
                J = function (t, e) {
                    A() ||
                        (function (t, e, n) {
                            var a = new XMLHttpRequest();
                            a.open("POST", t, !0),
                                a.setRequestHeader("Content-Type", "application/json"),
                                g && a.setRequestHeader("x-umami-cache", g),
                                (a.onreadystatechange = function () {
                                    4 === a.readyState && n(a.response);
                                }),
                                a.send(JSON.stringify(e));
                        })(O + "/api/collect", { type: t, payload: e }, function (t) {
                            return (g = t);
                        });
                },
                M = function (t, e, n) {
                    void 0 === t && (t = _), void 0 === e && (e = x), void 0 === n && (n = y), J("pageview", R(H(), { website: n, url: t, referrer: e }));
                },
                P = function (t, e, n, a) {
                    void 0 === e && (e = "custom"), void 0 === n && (n = _), void 0 === a && (a = y), J("event", R(H(), { website: a, url: n, event_type: e, event_value: t }));
                },
                z = function (t) {
                    var e = t.querySelectorAll(q);
                    Array.prototype.forEach.call(e, B);
                },
                B = function (t) {
                    (t.getAttribute("class") || "").split(" ").forEach(function (e) {
                        if (T.test(e)) {
                            var n = e.split("--"),
                                a = n[1],
                                i = n[2],
                                r = L[e]
                                    ? L[e]
                                    : (L[e] = function () {
                                          "A" === t.tagName
                                              ? (function (t, e) {
                                                    var n = H();
                                                    (n.event_type = e), (n.event_value = t);
                                                    var a = JSON.stringify({ type: "event", payload: n });
                                                    navigator.sendBeacon(O + "/api/collect", a);
                                                })(i, a)
                                              : P(i, a);
                                      });
                            t.addEventListener(a, r, !0);
                        }
                    });
                },
                C = function (t, e, n) {
                    if (n) {
                        x = _;
                        var a = n.toString();
                        (_ = "http" === a.substring(0, 4) ? "/" + a.split("/").splice(3).join("/") : a) !== x && M();
                    }
                };
            if (!n.umami) {
                var D = function (t) {
                    return P(t);
                };
                (D.trackView = M), (D.trackEvent = P), (n.umami = D);
            }
            if (b && !A()) {
                (v.pushState = t(v, "pushState", C)), (v.replaceState = t(v, "replaceState", C));
                var I = function () {
                    "complete" === f.readyState &&
                        (M(),
                        k &&
                            (z(f),
                            new MutationObserver(function (t) {
                                t.forEach(function (t) {
                                    var e = t.target;
                                    B(e), z(e);
                                });
                            }).observe(f, { childList: !0, subtree: !0 })));
                };
                f.addEventListener("readystatechange", I, !0), I();
            }
        }
    })(window);
})();
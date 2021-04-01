! function(e) {
    function t(t) {
        for (var i, s, a = t[0], u = t[1], c = t[2], d = 0, f = []; d < a.length; d++) s = a[d], o[s] && f.push(o[s][0]), o[s] = 0;
        for (i in u) Object.prototype.hasOwnProperty.call(u, i) && (e[i] = u[i]);
        for (l && l(t); f.length;) f.shift()();
        return r.push.apply(r, c || []), n()
    }

    function n() {
        for (var e, t = 0; t < r.length; t++) {
            for (var n = r[t], i = !0, a = 1; a < n.length; a++) {
                var u = n[a];
                0 !== o[u] && (i = !1)
            }
            i && (r.splice(t--, 1), e = s(s.s = n[0]))
        }
        return e
    }
    var i = {},
        o = {
            1: 0,
            2: 0,
            5: 0
        },
        r = [];

    function s(t) {
        if (i[t]) return i[t].exports;
        var n = i[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        return e[t].call(n.exports, n, n.exports, s), n.l = !0, n.exports
    }
    s.m = e, s.c = i, s.d = function(e, t, n) {
        s.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: n
        })
    }, s.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, s.t = function(e, t) {
        if (1 & t && (e = s(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var n = Object.create(null);
        if (s.r(n), Object.defineProperty(n, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var i in e) s.d(n, i, function(t) {
                return e[t]
            }.bind(null, i));
        return n
    }, s.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return s.d(t, "a", t), t
    }, s.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, s.p = "";
    var a = window.shopifySlateJsonp = window.shopifySlateJsonp || [],
        u = a.push.bind(a);
    a.push = t, a = a.slice();
    for (var c = 0; c < a.length; c++) t(a[c]);
    var l = u;
    r.push([34, 0]), n()
}([, , function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = function(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }(n(0));
    t.default = {
        data: function() {
            return {
                variantID: "",
                addedItem: {}
            }
        },
        methods: {
            handleQuickShop: function(e, t) {
            	console.log("handleQuickShop,", this);
                var n = this;
                t && t.preventDefault(), this.variantID = e, this.$nextTick(function() {
                    n.addToCart()
                })
            },
            addToCart: function() {
                var e = this;
                "" !== this.variantID && i.default.ajax("/cart/add.js", {
                    type: "POST",
                    data: {
                        quantity: 1,
                        id: this.variantID
                    },
                    error: function(e) {
                        var t = JSON.parse(e.responseText);
                        alert(t.description)
                    },
                    success: function(t) {
                        var n = JSON.parse(t);
                        console.log(n), (0, i.default)(".cart-feedback__image").attr("src", ""), (0, i.default)(".cart-feedback__image").attr("src", n.image), (0, i.default)(".cart-feedback__image").attr("alt", n.title), (0, i.default)(".cart-feedback__vendor").html(n.vendor), (0, i.default)(".cart-feedback__product-title").html(n.product_title), (0, i.default)(".cart-feedback__size").html(n.variant_title), e.updateCart()
                    }
                })
            },
            updateCart: function() {
                i.default.getJSON("/cart.js", function(e) {
                    (0, i.default)(".header-cart-count").html(e.item_count), (0, i.default)(".header-cart").addClass("actions__cart--has-count"), (0, i.default)(".cart-feedback").addClass("cart-feedback--active"), setTimeout(function() {
                        (0, i.default)(".cart-feedback").removeClass("cart-feedback--active")
                    }, 3e3)
                })
            }
        }
    }
}, , , , function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = n(7),
        o = function(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }(n(2)),
        r = n(9);
    t.default = Vue.component("product-details", {
        mixins: [o.default],
        props: {
            noOptions: Boolean,
            defaultVariant: String,
            isMobile: Boolean,
            hasAnnouncements: Boolean
        },
        components: {
            Carousel: i.Carousel,
            Slide: i.Slide
        },
        data: function() {
            return {
                currency: "CAD",
                currentTab: "styled",
                featuredZoom: !1,
                featuredInd: 0
            }
        },
        mounted: function() {
            document.getElementById("item-designer") && document.getElementById("item-designer").remove(), this.$refs.styled || (this.currentTab = "brand"), this.noOptions && this.defaultVariant && (this.variantID = this.defaultVariant), this.currency = Currency.cookie.read() ? Currency.cookie.read() : "CAD"
        },
        methods: {
            toggleZoom: function(e) {
                this.featuredInd = e || 0, this.featuredZoom = !this.featuredZoom, window.scrollTo(0, 0)
            },
            changeTab: function(e) {
                currentTab = e
            },
            changeVariantPrice: function(e, t) {
                var n = this,
                    i = e ? (0, r.formatMoney)(e, theme.moneyFormat) : null,
                    o = t ? (0, r.formatMoney)(t, theme.moneyFormat) : null;
                i && this.$el.querySelector("[data-compare-price]") && (this.$el.querySelector("[data-compare-price]").innerHTML = i), this.currency = Currency.cookie.read() ? Currency.cookie.read() : "CAD", this.$nextTick(function() {
                    Currency.convertAll("CAD", n.currency, "span.money")
                }), o && this.$el.querySelector("[data-product-price]") && (this.$el.querySelector("[data-product-price]").innerHTML = o)
            }
        }
    })
}, , function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = function(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }(n(0));
    t.default = {
        data: function() {
            return {
                currency: "CAD",
                country: "Canada"
            }
        },
        created: function() {
            this.currency = Currency.cookie.read() ? Currency.cookie.read() : "CAD", this.convertCurrency(), this.getCountry()
        },
        watch: {
            currency: function() {
                this.convertCurrency()
            },
            country: function() {
                var e = this;
                i.default.ajax({
                    dataType: "json",
                    url: "https://restcountries.eu/rest/v2/name/" + encodeURI(this.country),
                    success: function(t) {
                        var n = t[0].currencies[0].code;
                        n && (Currency.cookie.write(n), e.currency = n)
                    }
                })
            }
        },
        methods: {
            convertCurrency: function() {
                this.currency && Currency.convertAll("CAD", this.currency, "span.money")
            },
            getCountry: function() {
                var e = this;
                i.default.ajax({
                    dataType: "json",
                    url: "https://restcountries.eu/rest/v2/currency/" + encodeURI(this.currency),
                    success: function(t) {
                        t[0].name && (e.country = t[0].name)
                    }
                })
            }
        }
    }
}, , , function(e, t, n) {
    "use strict";
    var i = n(22);
    n(6), (0, i.load)("*")
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = c(n(13)),
        o = c(n(14)),
        r = c(n(15)),
        s = c(n(16)),
        a = c(n(17)),
        u = c(n(18));

    function c(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }
    t.default = Vue.component("article-template", {
        components: {
            ImageSection: i.default,
            InstagramSection: o.default,
            ContentSection: r.default,
            SpotifySection: s.default,
            VideoSection: a.default
        },
        props: {
            headerHeight: Number,
            hasAnnouncements: Boolean
        },
        data: function() {
            return {
                scrollPosition: 0,
                images: []
            }
        },
        mounted: function() {
            var e = this;
            this.scrollPosition = window.scrollY, window.addEventListener("scroll", function() {
                e.scrollPosition = window.scrollY
            }), this.images = this.$el.querySelectorAll(".image-section__image img"), this.images.length && new u.default(this.images)
        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.default = Vue.component("image-section", {
        template: "#article-image-section",
        props: {
            image1: String,
            image2: String,
            caption1: String,
            caption2: String,
            alignTo: String,
            hideCaptions: Boolean
        },
        computed: {
            alignment: function() {
                return this.alignTo ? "image-section--" + this.alignTo : ""
            }
        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.default = Vue.component("instagram-section", {
        template: "#article-instagram-section",
        props: {
            id: String,
            height: String
        },
        computed: {
            computedHeight: function() {
                return "padding-top:" + (this.height ? this.height : "125%")
            }
        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.default = Vue.component("content-section", {
        template: "#article-content-section",
        props: {
            alignTo: String
        },
        computed: {
            alignment: function() {
                return this.alignTo ? "content-section--" + this.alignTo : ""
            }
        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.default = Vue.component("spotify-section", {
        template: "#article-spotify-section",
        props: {
            spotify: String
        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.default = Vue.component("video-section", {
        template: "#article-video-section",
        props: {
            youtube: String,
            vimeo: String,
            fullWidth: Boolean
        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = s(n(23)),
        o = s(n(24)),
        r = n(29);

    function s(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }
    var a = function() {
        function e(t) {
            (0, i.default)(this, e), this.el = document.querySelector(".slider-section"), this.images = t, this.index = 0, this._build(), this._init()
        }
        return (0, o.default)(e, [{
            key: "_build",
            value: function() {
                var e = this;
                this.images.forEach(function(t, n) {
                    t.addEventListener("click", e._open.bind(e, n));
                    var i = document.createElement("IMG");
                    i.src = t.src, i.className = "slider-section__image", 0 === n && i.classList.add("active"), e.el.querySelector(".slider-section__content").appendChild(i)
                })
            }
        }, {
            key: "_init",
            value: function() {
                var e = this.el.querySelector("[data-slider-next]"),
                    t = this.el.querySelector("[data-slider-prev]"),
                    n = this.el.querySelector("[data-slider-close]");
                e.addEventListener("click", this._next.bind(this)), t.addEventListener("click", this._prev.bind(this)), n.addEventListener("click", this._close.bind(this))
            }
        }, {
            key: "_next",
            value: function() {
                var e = this.index === this.images.length - 1 ? 0 : this.index + 1;
                this._changeImage(e)
            }
        }, {
            key: "_prev",
            value: function() {
                var e = 0 === this.index ? this.images.length - 1 : this.index - 1;
                this._changeImage(e)
            }
        }, {
            key: "_changeImage",
            value: function(e) {
                var t = this.el.querySelectorAll("img");
                t.forEach(function(e) {
                    e.classList.remove("active")
                }), console.log("removed"), t[e].classList.add("active"), this.index = e
            }
        }, {
            key: "_open",
            value: function(e) {
                e !== this.index && this._changeImage(e), this.el.classList.add("open"), (0, r.disablePageScroll)(), document.addEventListener("keydown", this._handleKeyPress.bind(this))
            }
        }, {
            key: "_close",
            value: function() {
                this.el.classList.remove("open"), (0, r.enablePageScroll)(), document.removeEventListener("keydown", this._handleKeyPress.bind(this))
            }
        }, {
            key: "_handleKeyPress",
            value: function(e) {
                "Escape" !== e.key ? "ArrowLeft" !== e.key ? "ArrowRight" === e.key && this._next() : this._prev() : this._close()
            }
        }]), e
    }();
    t.default = a
}, , , , , , , , , , , , , , , , function(e, t, n) {
    "use strict";
    n(35), n(36), n(37), n(38), n(1), n(39), n(41), n(97);
    var i = n(42);
    n(43), (0, i.focusHash)(), (0, i.bindInPageLinks)(), navigator.cookiesEnabled && (document.documentElement.className = document.documentElement.className.replace("supports-no-cookies", "supports-cookies")), AOS.init({
        easing: "ease-in-out-cubic",
        once: !0,
        offset: 200,
        duration: 600
    })
}, , , , , , , function(e, t, n) {}, , function(e, t, n) {
    "use strict";
    var i = g(n(44)),
        o = g(n(47)),
        r = g(n(48)),
        s = g(n(49)),
        a = g(n(50)),
        u = g(n(51)),
        c = g(n(11)),
        l = g(n(54)),
        d = g(n(12)),
        f = g(n(68)),
        h = g(n(69)),
        m = g(n(70)),
        p = g(n(8)),
        v = n(7);

    function g(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }
    window.homeVue = new Vue({
        el: "#RodenGray",
        delimiters: ["${", "}"],
        mixins: [p.default],
        components: {
            Header: i.default,
            Footer: o.default,
            MobileHeader: a.default,
            Newsletter: r.default,
            ContentModal: s.default,
            Collection: u.default,
            Product: c.default,
            Editorial: l.default,
            Article: d.default,
            Career: f.default,
            Policies: h.default,
            CartItem: m.default,
            Carousel: v.Carousel,
            Slide: v.Slide
        },
        data: function() {
            return {
                isMobile: !1,
                hasAnnouncements: !1,
                newsletterOpen: !1,
                contentModalOpen: !1
            }
        },
        computed: {
            headerHeight: function() {
                return this.isMobile ? 60 : 100
            }
        },
        mounted: function() {
            this.checkMobile(), window.addEventListener("resize", this.checkMobile), document.querySelector(".announcements") && (this.hasAnnouncements = !0), "?newsletter" == window.location.search && (this.newsletterOpen = !0)
        },
        methods: {
            checkMobile: function() {
                this.isMobile = window.matchMedia("screen and ( max-width: 767px )").matches
            },
            handleNewsletter: function(e) {
                this.contentModalOpen && (this.contentModalOpen = !1), this.newsletterOpen = e
            },
            handleContentModal: function(e) {
                this.newsletterOpen && (this.newsletterOpen = !1), this.contentModalOpen = e
            }
        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = s(n(45)),
        o = s(n(46)),
        r = s(n(8));

    function s(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }
    t.default = Vue.component("main-header", {
        mixins: [r.default],
        components: {
            AnnouncementBar: i.default,
            SearchBar: o.default
        },
        data: function() {
            return {
                menuActive: !1,
                menuHeight: 0,
                fragment: ""
            }
        },
        watch: {
            menuHeight: function() {
                this.$refs.menuContent.style.maxHeight = this.menuHeight + "px"
            }
        },
        methods: {
            openMenu: function(e) {
                this.menuActive = !0, this.fragment = e
            },
            closeMenu: function() {
                this.menuActive = !1, this.fragment = ""
            },
            setHeight: function() {
                this.menuHeight = this.$refs.menuContent.scrollHeight
            }
        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.default = Vue.component("announcement-bar", {
        data: function() {
            return {
                current: 0,
                interval: null,
                direction: "left"
            }
        },
        props: {
            announcement1text: String,
            announcement1url: String,
            announcement2text: String,
            announcement2url: String,
            announcement3text: String,
            announcement3url: String
        },
        mounted: function() {
            this.initiateInterval()
        },
        beforeDestroy: function() {
            this.interval && clearInterval(this.interval)
        },
        computed: {
            announcements: function() {
                return [{
                    text: this.announcement1text,
                    url: this.announcement1url
                }, {
                    text: this.announcement2text,
                    url: this.announcement2url
                }, {
                    text: this.announcement3text,
                    url: this.announcement3url
                }].filter(function(e) {
                    return e.text
                })
            },
            announcementType: function() {
                return this.announcements[this.current].url ? "a" : "div"
            }
        },
        methods: {
            initiateInterval: function() {
                var e = this;
                this.announcements.length > 1 && (this.interval = setInterval(function() {
                    e.current = e.current === e.announcements.length - 1 ? 0 : e.current + 1
                }, 6e3))
            },
            prevAnnouncement: function() {
                this.interval && clearInterval(this.interval), this.direction = "right", this.current = this.current === this.announcements.length - 1 ? 0 : this.current + 1, this.initiateInterval()
            },
            nextAnnouncement: function() {
                this.interval && clearInterval(this.interval), this.direction = "left", this.current = 0 === this.current ? this.announcements.length - 1 : this.current - 1, this.initiateInterval()
            }
        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.default = Vue.component("search-bar", {
        mounted: function() {
            this.$refs.searchInput.focus()
        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.default = Vue.component("footer-accordion", {
        data: function() {
            return {
                isOpen: !1,
                isMobile: !1,
                height: 0
            }
        },
        computed: {
            listHeight: function() {
                return this.isMobile ? this.isOpen ? this.height + "px" : "0px" : this.height + "px"
            }
        },
        mounted: function() {
            var e = this;
            this.isMobile = window.matchMedia("(max-width: 767px)").matches, this.height = this.$refs.footerList.scrollHeight, window.addEventListener("resize", function() {
                e.isMobile = window.matchMedia("(max-width: 767px)").matches
            })
        },
        methods: {
            toggle: function() {
                this.isOpen = !this.isOpen
            }
        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.default = Vue.component("newsletter-section", {
        props: {
            newsletterOpen: Boolean,
            timeout: Number
        },
        data: function() {
            return {
                newsletterChecked: !0,
                salesChecked: !0
            }
        },
        mounted: function() {
            var e = this,
                t = sessionStorage.getItem("newsletter"),
                n = document.querySelector(".content-modal");
            t || n || setTimeout(function() {
                e.$emit("handle-newsletter", !0)
            }, this.timeout);
            var i = document.querySelectorAll('a[href$="/?newsletter"]');
            i.length && i.forEach(function(t) {
                t.addEventListener("click", function(n) {
                    t.getAttribute("href").includes("/?newsletter") && (n.preventDefault(), e.$emit("handle-newsletter", !0))
                })
            })
        },
        computed: {
            activeList: function() {
                return this.newsletterChecked && !this.salesChecked ? "PtV3BT" : this.salesChecked && !this.newsletterChecked ? "KWPzx7" : "LGtGsB"
            }
        },
        methods: {
            setSession: function() {
                sessionStorage.setItem("newsletter", !0)
            },
            submitForm: function() {
                this.setSession(), this.$refs.form.submit(), this.closeModal()
            },
            closeModal: function() {
                this.setSession(), this.$emit("handle-newsletter", !1)
            }
        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.default = Vue.component("content-modal-section", {
        props: {
            contentModalOpen: Boolean,
            timeout: Number
        },
        mounted: function() {
            var e = this;
            sessionStorage.getItem("contentModal") || setTimeout(function() {
                e.$emit("handle-content-modal", !0)
            }, this.timeout)
        },
        methods: {
            setSession: function() {
                sessionStorage.setItem("contentModal", !0)
            },
            closeModal: function() {
                this.setSession(), this.$emit("handle-content-modal", !1)
            }
        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = r(n(2)),
        o = r(n(8));

    function r(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }
    t.default = Vue.component("mobile-header", {
        mixins: [i.default, o.default],
        data: function() {
            return {
                menuOpen: !1,
                currentList: "main"
            }
        },
        computed: {
            direction: function() {
                return "main" === this.currentList ? "right" : "left"
            }
        },
        methods: {
            toggleMenu: function() {
                this.menuOpen = !this.menuOpen
            },
            toggleList: function(e) {
                this.currentList = e
            }
        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = s(n(0)),
        o = s(n(52)),
        r = s(n(53));

    function s(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }
    t.default = Vue.component("collection", {
        components: {
            ProductCard: o.default,
            ExtendedFilters: r.default
        },
        props: {
            headerHeight: Number,
            hasAnnouncements: Boolean
        },
        data: function() {
            return {
                scrollPosition: 0,
                filtersInitial: 0,
                sortValue: "",
                filtersOpen: !1
            }
        },
        mounted: function() {
            var e = this;
            this.scrollPosition = window.scrollY, this.filtersInitial = this.$refs.filters.offsetTop, this.setFilters(), window.addEventListener("scroll", function() {
                e.scrollPosition = window.scrollY
            })
        },
        computed: {
            filtersFixed: function() {
                return this.scrollPosition >= this.filtersInitial - this.headerHeight
            }
        },
        watch: {
            sortValue: function() {
                var e = new URLSearchParams(window.location.search);
                e.set("sort_by", this.sortValue), window.location = "?" + e
            }
        },
        methods: {
            setFilters: function() {
                var e = new URLSearchParams(window.location.search);
                e.get("sort_by") && (this.$refs["sort-by"].value = e.get("sort_by"))
            },
            scrollToContent: function() {
                var e = !this.filtersFixed && this.scrollPosition <= this.filtersInitial ? this.filtersInitial - this.headerHeight : 0;
                (0, i.default)("html, body").animate({
                    scrollTop: e
                }, 800)
            },
            updateSort: function(e) {
                this.sortValue = e.target.value
            },
            toggleFilters: function() {
                this.filtersOpen = !this.filtersOpen
            }
        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = function(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }(n(2));
    t.default = Vue.component("product-card", {
        mixins: [i.default],
        props: {
            noOptions: Boolean,
            defaultVariant: String
        },
        data: function() {
            return {
                isActive: !1
            }
        },
        mounted: function() {
            this.noOptions && this.defaultVariant && (this.variantID = this.defaultVariant)

        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.default = Vue.component("extended-filters", {
        props: {
            tags: String
        },
        data: function() {
            return {
                open: !1
            }
        },
        mounted: function() {
            this.open = !0
        },
        computed: {
            groupHeight: function() {
                return this.open ? this.$refs["filter-list"].scrollHeight : 0
            }
        },
        methods: {
            toggleGroup: function() {
                this.open = !this.open
            }
        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = function(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }(n(0)),
        o = n(7);
    t.default = Vue.component("editorial", {
        components: {
            Carousel: o.Carousel,
            Slide: o.Slide
        },
        data: function() {
            return {
                lol: "lololol"
            }
        },
        methods: {
            handleScroll: function(e) {
                var t = this.$refs[e].offsetTop;
                (0, i.default)("html, body").animate({
                    scrollTop: t - document.getElementById("header-main").clientHeight
                }, 700)
            }
        }
    })
}, , , , , , , , , , , , , , function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.default = Vue.component("career", {
        data: function() {
            return {
                isOpen: !1,
                contentHeight: 0
            }
        },
        mounted: function() {
            this.contentHeight = this.$refs.content.scrollHeight
        },
        computed: {
            height: function() {
                return this.isOpen ? this.contentHeight + "px" : 0
            }
        },
        methods: {
            toggle: function() {
                this.isOpen = !this.isOpen
            }
        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.default = Vue.component("policies-template", {
        props: {
            isMobile: Boolean,
            hasAnnouncements: Boolean
        },
        data: function() {
            return {
                currentPolicy: ""
            }
        },
        mounted: function() {
            this.getAnchor()
        },
        methods: {
            getAnchor: function() {
                var e = window.location.href.split("#");
                this.currentPolicy = e.length > 1 ? e[1] : Object.keys(this.$refs)[0]
            },
            changePolicy: function(e) {
                this.currentPolicy = e
            }
        }
    })
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = s(n(0)),
        o = n(9),
        r = s(n(8));

    function s(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }
    t.default = Vue.component("cart-item", {
        mixins: [r.default],
        props: {
            initialQuantity: Number,
            variant: Number,
            available: Number
        },
        data: function() {
            return {
                quantity: 0,
                timeout: null
            }
        },
        created: function() {
            this.quantity = this.initialQuantity
        },
        watch: {
            quantity: function() {
                this.updateTotal()
            }
        },
        methods: {
            updateTotal: function() {
                var e = this;
                i.default.ajax("/cart/change.js", {
                    type: "POST",
                    data: {
                        quantity: this.quantity,
                        id: this.variant
                    },
                    error: function(e) {
                        var t = JSON.parse(e.responseText);
                        alert(t.description)
                    },
                    success: function(t) {
                        for (var n = JSON.parse(t), i = document.getElementById("cart-subtotal"), r = 0; r <= n.items.length - 1; r++) n.items[r].variant_id === e.variant && (e.$refs.itemTotal.innerHTML = '<span class="money">' + (0, o.formatMoney)(n.items[r].final_line_price) + "</span>");
                        i && (i.innerHTML = '<span class="money">' + (0, o.formatMoney)(n.total_price) + "</span>"), e.convertCurrency()
                    }
                })
            }
        }
    })
}, , , , , , , , , , , , , , , , , , , , , , , , , , , function(e, t) {}]);





// Product Filter
$(document).ready ( function () {
    
    $('.nav-search--filter').on('click', function() {
        if( $(window).width() >= 768 ) {
            // $('.nav-search--sort').removeClass('is-active');
            // $('.nav-search--sort-content').removeClass('is-active');
            $('.nav-search--search-content').removeClass('is-active');
            $('.nav-search--search').removeClass('is-active');
            

            if ( $(this).hasClass('is-active') ) {
                $(this).removeClass('is-active');
                $('.snize-product-filters').removeClass('is-active');
                $('.close-filter').remove();
            } else {
                // if( $(window).width() >= 768 ) {
                //     var checkExist = setInterval(function() {
                //        if ($('.snize-filters-sidebar').length) {
                //           console.log("Exists!");
                //           $('.snize-filters-sidebar').append('<button class="button close-filter">Update</button>');    
                //           clearInterval(checkExist);

                //        }
                //     }, 100);
                // }

                if($('.snize-product-filters').hasClass('is-active') ) {
                    $(this).removeClass('is-active');
                    $('.snize-product-filters').removeClass('is-active');
                } else {
                    $(this).addClass('is-active');
                    $('.snize-product-filters').addClass('is-active');               
                }
            }
        }
    });

    $('.nav-search--filter:not(.is-active)').on('click', function() {
        addClose();
    });

    // Add close after a URL change
    function filterChanged(url) {
        var checkChange = setInterval(function() {
           if (url != window.location.href) {
              console.log("changed");
              $('.snize-filters-sidebar').append('<button class="button close-filter">Update</button>');    
              clearInterval(checkChange);
           }
        }, 100);
    }

    // Add close once filter is viewbale
    function addClose() {
        console.log("addClose()");

        var checkExist = setInterval(function() {
           if ($('.snize-filters-sidebar').length) {
              console.log("Exists!");
              $('.snize-filters-sidebar').append('<button class="button close-filter">Update</button>');    
              clearInterval(checkExist);

           }
        }, 100);
    }

    // Hack to listen to click events on certain elements in the filter
    $(document).click(function(event) {
        console.log(event.target);
        var url = window.location.href;

        if($(event.target).hasClass('close-filter')) {
            console.log("click close");
            $('.close-filter').remove();
            $('.snize-filters-sidebar').removeClass('is-active');
            $('.nav-search--filter').removeClass('is-active');
        }

        if($(event.target).hasClass('snize-product-filters-checkbox') ) {
            filterChanged(url);
        }

        // if( $(event.target).hasClass('search--fitler') ) {
        //     $('.snize-ac-results').removeClass('active-search-header');
        //     $('.snize-ac-results').addClass('active-search-filter');
        // }

        // if( $(event.target).hasClass('search--header') ) {
        //     $('.snize-ac-results').removeClass('active-search-filter');
        //     $('.snize-ac-results').addClass('active-search-header');
        // }
    });

    // Hide show place the search suggestions
    $('.mega-menu input').focusin(function() {
        console.log("top");


        var checkExist = setInterval(function() {
            console.log("check");
            if ($('.snize-ac-results').length) {
                $('.snize-ac-results').addClass('active-search-header');
                $('.snize-ac-results').removeClass('active-search-filter');
                clearInterval(checkExist);
            }
        }, 100);

        var checkExist2 = setInterval(function() {
            console.log("check2");
            if (!$('.mega-menu--active').length) {
                console.log("made it here");
                $('.snize-ac-results').hide();        
                clearInterval(checkExist2);
            }
        }, 100);
    });

    $('.nav-search--search input').focusin(function() {
        console.log("bottom");

        var checkExist = setInterval(function() {
            console.log("check");
            if ($('.snize-ac-results').length) {
                $('.snize-ac-results').addClass('active-search-filter');
                $('.snize-ac-results').removeClass('active-search-header');
                clearInterval(checkExist);
            }
        }, 100);


    });

// $('header').mouseleave(function() {
//     console.log('left header');
//     // $('.snize-ac-results').hide();
// });

    // var password = document.querySelector('input[type="text"]');

    // password.addEventListener('focus', (event) => {
    //         console.log("focus");


    //         var checkExist = setInterval(function() {
    //             if (!$('.mega-menu--active').length) {
    //                 console.log("mega-menu--active exists!");
    //                 $('.snize-ac-results').removeClass('active-search-header');
    //                 $('.snize-ac-results').addClass('active-search-filter'); 
    //                 $('.snize-ac-results').hide();
    //                 clearInterval(checkExist);
    //            }
    //         }, 100);


    //     console.log("click focus");
    //     event.target.style.background = 'pink';

    // });

    // password.addEventListener('blur', (event) => {
    //     console.log("click blur");
    //     $('.snize-ac-results').removeClass('active-search-header');
    //     $('.snize-ac-results').addClass('active-search-filter');
    //     event.target.style.background = 'blue';
    // });



    (function(history){
        var pushState = history.pushState;
        history.pushState = function(state) {
        if (typeof history.onpushstate == "function") {
            history.onpushstate({state: state});
        }

        //Custom code here
        $('.snize-filters-sidebar').append('<button class="button close-filter">Update</button>');  

        return pushState.apply(history, arguments);
    }
    })(window.history);


    $('.nav-search--search').on('click', function() {
        // $('.nav-search--sort').removeClass('is-active');
        // $('.nav-search--sort-content').removeClass('is-active');
        // $('.nav-search--filter').removeClass('is-active');

        // if ( $(this).hasClass('is-active') ) {
        //     $(this).removeClass('is-active');
        //     // $('.snize-product-filters').removeClass('is-active');
        //     $('.nav-search--search-content').removeClass('is-active');
        // } else {
        //     $(this).addClass('is-active');
        //     $('.nav-search--search-content').addClass('is-active');
        // }
        
        $('body').addClass('filter-seach');

        if( $(window).width() < 768 ) {
            $('.template-collection').addClass('snize-no-scroll');
            $('.mobile-header').addClass('is-behind');
            $('.template-collection .footer').addClass('is-behind');
            // $('#snize-overlay-mobile-sortby-dialog.snize-overlay').show();
            // $('#snize-modal-mobile-sortby-dialog.snize-modal').show();
       
            if ( $(this).hasClass('is-active') ) {
                $(this).removeClass('is-active');
                // $('.snize-product-filters').removeClass('is-active');
                $('.nav-search--search-content').removeClass('is-active');
            } else {
                $(this).addClass('is-active');
                $('.nav-search--search-content').addClass('is-active');
            }
        }   
    });

    $('.nav-search--sort').on('click', function() {
        if( $(window).width() >= 768 ) {
            if( $('.snize-main-panel-dropdown-content').hasClass('persistent-show') ) {
                // $('.snize-main-panel-dropdown-content').hide();
                $('.snize-main-panel-dropdown-content').removeClass('persistent-show');
                $('.nav-search--sort').removeClass('is-active');


            } else {
                // $('.snize-main-panel-dropdown-content').show();
                $('.snize-main-panel-dropdown-content').addClass('persistent-show');
                $('.nav-search--sort').addClass('is-active');
            }    
        }
        
        if( $(window).width() < 768 ) {
            $('.template-collection').addClass('snize-no-scroll');
            $('#snize-overlay-mobile-sortby-dialog.snize-overlay').show();
            $('#snize-modal-mobile-sortby-dialog.snize-modal').show();

        }    
    });


    // var sortYPos = $('#site-header').height() + $('.collection-hero').height() + 100;
    // // console.log(sortYPos);
    // $('.snize-main-panel-dropdown').css('top', sortYPos);


    $(window).scroll(function (event) {
        stickNav(event);
    });

    window.addEventListener('load', (event) => {
      stickNav(event);
    });

    function stickNav(event) {
        var scroll = $(window).scrollTop();
        var distanceFilterTop = $('#site-header').height() + $('.collection-hero').height();
        
        if(scroll > distanceFilterTop - 100){
            $('.search-nav').addClass('is-sticky');
            $('.snize-search-results').addClass('is-adjusted');
            $('.snize-main-panel-dropdown').addClass('is-sticky');
            $('.snize-product-filters').addClass('is-sticky');
            $('.snize-ac-result').addClass('is-sticky');
        } else {
            $('.search-nav').removeClass('is-sticky');
            $('.snize-search-results').removeClass('is-adjusted');
            $('.snize-main-panel-dropdown').removeClass('is-sticky');
            $('.snize-product-filters').removeClass('is-sticky');
            $('.snize-ac-result').removeClass('is-sticky');
        }
    }


    // Start Collection footer
    if( $(window).width() >= 768 ) {
        $('.template-collection .footer').mouseenter(function() {
            $(this).addClass('is-active');
            $('.footer__list-icon--master').removeClass('fa-angle-down').addClass('fa-angle-up');
        });

        $('.template-collection .footer').mouseleave(function() {
            $(this).removeClass('is-active');
            $('.footer__list-icon--master').removeClass('fa-angle-up').addClass('fa-angle-down');
        });

        $('.fal.footer__list-icon.footer__list-icon--master.fa-angle-up').on('click', function() {
            $('.footer').removeClass('is-active');
            
        });
    }


    if( $(window).width() < 768 ) {
        $('.footer__list-icon--master').on('click', function() {
            
            if( $('.footer').hasClass('is-active') ) {
            
                $('.footer__list-icon--master').addClass('fa-angle-down').removeClass('fa-angle-up');
                $('.footer').removeClass('is-active');    
            } else {
            
                $('.footer').addClass('is-active');   
                $('.footer__list-icon--master').addClass('fa-angle-up').removeClass('fa-angle-down');
            }                          
        });

        $('.snize-close-button--search-content').on('click', function() {
            $('.nav-search--search-content').removeClass('is-active');
            $('.template-collection').removeClass('snize-no-scroll');
            $('.mobile-header').removeClass('is-behind');
            $('.template-collection .footer').removeClass('is-behind');
            $('.nav-search--search').removeClass('is-active');
        })
    }



    // $(window).on("resize", function () {
        // if( $(window).width() >= 768 ) {
        //     var checkExist = setInterval(function() {
        //        if ($('.snize-filters-sidebar').length) {
        //           console.log("Exists!");
        //           $('.snize-filters-sidebar.snize-product-filters').append('<button class="button close-filter">Update</button>');    
        //           clearInterval(checkExist);

        //        }
        //     }, 100);
        // }
    // }).resize();
    




    document.addEventListener('touchmove', function(e) {
        e.preventDefault();

        if( ! document.querySelector('footer').contains(event.target) ) {
            $('.footer__list-icon--master').addClass('fa-angle-down').removeClass('fa-angle-up');
            $('.footer').removeClass('is-active');    
        }

    }, false);
    // End Collection footer



    // $('.snize-main-panel-dropdown-content').mouseleave(function() {
    //     console.log("mouseleave");
    // });

    $('.snize-main-panel-dropdown-content li a').mouseleave(function() {
            console.log("mouseleave link");
    });


    $('.nav-search--filter').on('click', function() {
        $('.snize-main-panel-mobile-filters').trigger('click');
    });


    // $('.actions .actions__icon').mouseenter(function() {
    //     console.log('mousein');
    //     $('.header .search').addClass('is-active');
    // });
        
    $('.actions__item, .nav__item').mouseenter(function() {
        console.log($(this));


        if ( $(this).children('.fa-search').length ) {
            console.log("search");
            $('.header .search').show();
             $('.header .search').addClass('is-active');
            
        } else {
            console.log("not search");
            $('.header .search').hide();
            $('.header .search').removeClass('is-active');
        }

    });
});












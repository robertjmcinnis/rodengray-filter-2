/*! rg-theme 14-08-2014 */
function floatToString(c, a) {
    var b = c.toFixed(a).toString();
    return b.match(/^\.\d+/) ? "0" + b : b
}

function Swipe(container, options) {
    "use strict";

    function setup() {
        slides = element.children, length = slides.length, slides.length < 2 && (options.continuous = !1), browser.transitions && options.continuous && slides.length < 3 && (element.appendChild(slides[0].cloneNode(!0)), element.appendChild(element.children[1].cloneNode(!0)), slides = element.children), slidePos = new Array(slides.length), width = container.getBoundingClientRect().width || container.offsetWidth, element.style.width = slides.length * width + "px";
        for (var pos = slides.length; pos--;) {
            var slide = slides[pos];
            slide.style.width = width + "px", slide.setAttribute("data-index", pos), browser.transitions && (slide.style.left = pos * -width + "px", move(pos, index > pos ? -width : pos > index ? width : 0, 0))
        }
        options.continuous && browser.transitions && (move(circle(index - 1), -width, 0), move(circle(index + 1), width, 0)), browser.transitions || (element.style.left = index * -width + "px"), container.style.visibility = "visible"
    }

    function prev() {
        options.continuous ? slide(index - 1) : index && slide(index - 1)
    }

    function next() {
        options.continuous ? slide(index + 1) : index < slides.length - 1 && slide(index + 1)
    }

    function circle(index) {
        return (slides.length + index % slides.length) % slides.length
    }

    function slide(to, slideSpeed) {
        if (index != to) {
            if (browser.transitions) {
                var direction = Math.abs(index - to) / (index - to);
                if (options.continuous) {
                    var natural_direction = direction;
                    direction = -slidePos[circle(to)] / width, direction !== natural_direction && (to = -direction * slides.length + to)
                }
                for (var diff = Math.abs(index - to) - 1; diff--;) move(circle((to > index ? to : index) - diff - 1), width * direction, 0);
                to = circle(to), move(index, width * direction, slideSpeed || speed), move(to, 0, slideSpeed || speed), options.continuous && move(circle(to - direction), -(width * direction), 0)
            } else to = circle(to), animate(index * -width, to * -width, slideSpeed || speed);
            index = to, offloadFn(options.callback && options.callback(index, slides[index]))
        }
    }

    function move(index, dist, speed) {
        translate(index, dist, speed), slidePos[index] = dist
    }

    function translate(index, dist, speed) {
        var slide = slides[index],
            style = slide && slide.style;
        style && (style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = speed + "ms", style.webkitTransform = "translate(" + dist + "px,0)translateZ(0)", style.msTransform = style.MozTransform = style.OTransform = "translateX(" + dist + "px)")
    }

    function animate(from, to, speed) {
        if (!speed) return void(element.style.left = to + "px");
        var start = +new Date,
            timer = setInterval(function() {
                var timeElap = +new Date - start;
                return timeElap > speed ? (element.style.left = to + "px", delay && begin(), options.transitionEnd && options.transitionEnd.call(event, index, slides[index]), void clearInterval(timer)) : void(element.style.left = (to - from) * (Math.floor(timeElap / speed * 100) / 100) + from + "px")
            }, 4)
    }

    function begin() {
        interval = setTimeout(next, delay)
    }

    function stop() {
        delay = 0, clearTimeout(interval)
    }
    var noop = function() {},
        offloadFn = function(fn) {
            setTimeout(fn || noop, 0)
        },
        browser = {
            addEventListener: !!window.addEventListener,
            touch: "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch,
            transitions: function(temp) {
                var props = ["transitionProperty", "WebkitTransition", "MozTransition", "OTransition", "msTransition"];
                for (var i in props)
                    if (void 0 !== temp.style[props[i]]) return !0;
                return !1
            }(document.createElement("swipe"))
        };
    if (container) {
        var slides, slidePos, width, length, element = container.children[0];
        options = options || {};
        var index = parseInt(options.startSlide, 10) || 0,
            speed = options.speed || 300;
        options.continuous = void 0 !== options.continuous ? options.continuous : !0;
        var interval, isScrolling, delay = options.auto || 0,
            start = {},
            delta = {},
            events = {
                handleEvent: function(event) {
                    switch (event.type) {
                        case "touchstart":
                            this.start(event);
                            break;
                        case "touchmove":
                            this.move(event);
                            break;
                        case "touchend":
                            offloadFn(this.end(event));
                            break;
                        case "webkitTransitionEnd":
                        case "msTransitionEnd":
                        case "oTransitionEnd":
                        case "otransitionend":
                        case "transitionend":
                            offloadFn(this.transitionEnd(event));
                            break;
                        case "resize":
                            offloadFn(setup)
                    }
                    options.stopPropagation && event.stopPropagation()
                },
                start: function(event) {
                    var touches = event.touches[0];
                    start = {
                        x: touches.pageX,
                        y: touches.pageY,
                        time: +new Date
                    }, isScrolling = void 0, delta = {}, element.addEventListener("touchmove", this, !1), element.addEventListener("touchend", this, !1)
                },
                move: function(event) {
                    if (!(event.touches.length > 1 || event.scale && 1 !== event.scale)) {
                        options.disableScroll && event.preventDefault();
                        var touches = event.touches[0];
                        delta = {
                            x: touches.pageX - start.x,
                            y: touches.pageY - start.y
                        }, "undefined" == typeof isScrolling && (isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y))), isScrolling || (event.preventDefault(), stop(), options.continuous ? (translate(circle(index - 1), delta.x + slidePos[circle(index - 1)], 0), translate(index, delta.x + slidePos[index], 0), translate(circle(index + 1), delta.x + slidePos[circle(index + 1)], 0)) : (delta.x = delta.x / (!index && delta.x > 0 || index == slides.length - 1 && delta.x < 0 ? Math.abs(delta.x) / width + 1 : 1), translate(index - 1, delta.x + slidePos[index - 1], 0), translate(index, delta.x + slidePos[index], 0), translate(index + 1, delta.x + slidePos[index + 1], 0)))
                    }
                },
                end: function() {
                    var duration = +new Date - start.time,
                        isValidSlide = Number(duration) < 250 && Math.abs(delta.x) > 20 || Math.abs(delta.x) > width / 2,
                        isPastBounds = !index && delta.x > 0 || index == slides.length - 1 && delta.x < 0;
                    options.continuous && (isPastBounds = !1);
                    var direction = delta.x < 0;
                    isScrolling || (isValidSlide && !isPastBounds ? (direction ? (options.continuous ? (move(circle(index - 1), -width, 0), move(circle(index + 2), width, 0)) : move(index - 1, -width, 0), move(index, slidePos[index] - width, speed), move(circle(index + 1), slidePos[circle(index + 1)] - width, speed), index = circle(index + 1)) : (options.continuous ? (move(circle(index + 1), width, 0), move(circle(index - 2), -width, 0)) : move(index + 1, width, 0), move(index, slidePos[index] + width, speed), move(circle(index - 1), slidePos[circle(index - 1)] + width, speed), index = circle(index - 1)), options.callback && options.callback(index, slides[index])) : options.continuous ? (move(circle(index - 1), -width, speed), move(index, 0, speed), move(circle(index + 1), width, speed)) : (move(index - 1, -width, speed), move(index, 0, speed), move(index + 1, width, speed))), element.removeEventListener("touchmove", events, !1), element.removeEventListener("touchend", events, !1)
                },
                transitionEnd: function(event) {
                    parseInt(event.target.getAttribute("data-index"), 10) == index && (delay && begin(), options.transitionEnd && options.transitionEnd.call(event, index, slides[index]))
                }
            };
        return setup(), delay && begin(), browser.addEventListener ? (browser.touch && element.addEventListener("touchstart", events, !1), browser.transitions && (element.addEventListener("webkitTransitionEnd", events, !1), element.addEventListener("msTransitionEnd", events, !1), element.addEventListener("oTransitionEnd", events, !1), element.addEventListener("otransitionend", events, !1), element.addEventListener("transitionend", events, !1)), window.addEventListener("resize", events, !1)) : window.onresize = function() {
            setup()
        }, {
            setup: function() {
                setup()
            },
            slide: function(to, speed) {
                stop(), slide(to, speed)
            },
            prev: function() {
                stop(), prev()
            },
            next: function() {
                stop(), next()
            },
            stop: function() {
                stop()
            },
            getPos: function() {
                return index
            },
            getNumSlides: function() {
                return length
            },
            kill: function() {
                stop(), element.style.width = "", element.style.left = "";
                for (var pos = slides.length; pos--;) {
                    var slide = slides[pos];
                    slide.style.width = "", slide.style.left = "", browser.transitions && translate(pos, 0, 0)
                }
                browser.addEventListener ? (element.removeEventListener("touchstart", events, !1), element.removeEventListener("webkitTransitionEnd", events, !1), element.removeEventListener("msTransitionEnd", events, !1), element.removeEventListener("oTransitionEnd", events, !1), element.removeEventListener("otransitionend", events, !1), element.removeEventListener("transitionend", events, !1), window.removeEventListener("resize", events, !1)) : window.onresize = null
            }
        }
    }
}

function is_touch_device() {
    return "ontouchstart" in window || "onmsgesturechange" in window
}

function mce_preload_check() {
    if (!(mce_preload_checks > 40)) {
        mce_preload_checks++;
        try {} catch (err) {
            return void setTimeout("mce_preload_check();", 250)
        }
        var script = document.createElement("script");
        script.type = "text/javascript", script.src = "//cdn.shopify.com/s/files/1/0240/7285/t/15/assets/jquery.form-n-validate.js?14799505907240347837", head.appendChild(script);
        try {
            {
                jQuery("#fake-form").validate({})
            }
        } catch (err) {
            return void setTimeout("mce_preload_check();", 250)
        }
        mce_init_form()
    }
}

function mce_init_form() {
    jQuery(document).ready(function($) {
        var options = {
                errorClass: "mce_inline_error",
                errorElement: "div",
                onkeyup: function() {},
                onfocusout: function() {},
                onblur: function() {}
            },
            mce_validator = $(".mc-embedded-subscribe-form").validate(options);
        $(".mc-embedded-subscribe-form").unbind("submit"), options = {
            url: "http://rodengray.us2.list-manage.com/subscribe/post-json?u=81a8db5d2d46720110e454e44&id=89291efd13&c=?",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            beforeSubmit: function() {
                return $(".mce_tmp_error_msg").remove(), $(".datefield", ".mc_embed_signup").each(function() {
                    var fields = new Array,
                        i = 0;
                    $(":text", this).each(function() {
                        fields[i] = this, i++
                    }), $(":hidden", this).each(function() {
                        var bday = !1;
                        2 == fields.length && (bday = !0, fields[2] = {
                            value: 1970
                        }), this.value = "MM" == fields[0].value && "DD" == fields[1].value && ("YYYY" == fields[2].value || bday && 1970 == fields[2].value) ? "" : "" == fields[0].value && "" == fields[1].value && ("" == fields[2].value || bday && 1970 == fields[2].value) ? "" : /\[day\]/.test(fields[0].name) ? fields[1].value + "/" + fields[0].value + "/" + fields[2].value : fields[0].value + "/" + fields[1].value + "/" + fields[2].value
                    })
                }), $(".phonefield-us", ".mc_embed_signup").each(function() {
                    var fields = new Array,
                        i = 0;
                    $(":text", this).each(function() {
                        fields[i] = this, i++
                    }), $(":hidden", this).each(function() {
                        this.value = 3 != fields[0].value.length || 3 != fields[1].value.length || 4 != fields[2].value.length ? "" : "filled"
                    })
                }), mce_validator.form()
            },
            success: mce_success_cb
        }, $(".mc-embedded-subscribe-form").ajaxForm(options)
    })
}

function mce_success_cb(resp) {
    if ($(".mce-success-response").hide(), $(".mce-error-response").hide(), "success" == resp.result) $(".mce-" + resp.result + "-response").show(), $(".mce-" + resp.result + "-response").html(resp.msg + '<a class="button" href="#">Okay</a>'), $(".mce-" + resp.result + "-response .button").click(function(e) {
        e.preventDefault(), $(".mce-" + resp.result + "-response").hide()
    }), $(".mc-embedded-subscribe-form").each(function() {
        this.reset()
    }), gaTrackSubscribe("footer");
    else {
        var msg, index = -1;
        try {
            var parts = resp.msg.split(" - ", 2);
            void 0 == parts[1] ? msg = resp.msg : (i = parseInt(parts[0]), i.toString() == parts[0] ? (index = parts[0], msg = parts[1]) : (index = -1, msg = resp.msg))
        } catch (e) {
            index = -1, msg = resp.msg
        }
        try {
            if (-1 == index) $(".mce-" + resp.result + "-response").show(), $(".mce-" + resp.result + "-response").html(msg + '<a class="button" href="#">Okay</a>'), $(".mce-" + resp.result + "-response .button").click(function(e) {
                e.preventDefault(), $(".mce-" + resp.result + "-response").hide()
            });
            else {
                err_id = "mce_tmp_error_msg", html = '<div id="' + err_id + '" style="' + err_style + '"> ' + msg + "</div>";
                var input_id = ".mc_embed_signup",
                    f = $(input_id);
                "address" == ftypes[index] ? (input_id = ".mce-" + fnames[index] + "-addr1", f = $(input_id).parent().parent().get(0)) : "date" == ftypes[index] ? (input_id = ".mce-" + fnames[index] + "-month", f = $(input_id).parent().parent().get(0)) : (input_id = ".mce-" + fnames[index], f = $().parent(input_id).get(0)), f ? ($(f).append(html), $(input_id).focus()) : ($(".mce-" + resp.result + "-response").show(), $(".mce-" + resp.result + "-response").html(msg))
            }
        } catch (e) {
            $(".mce-" + resp.result + "-response").show(), $(".mce-" + resp.result + "-response").html(msg + '<a class="button" href="#">Okay</a>'), $(".mce-" + resp.result + "-response .button").click(function(e) {
                e.preventDefault(), $(".mce-" + resp.result + "-response").hide()
            })
        }
    }
}! function($, window, document) {
    $.fn.doubleTapToGo = function() {
        return "ontouchstart" in window || navigator.msMaxTouchPoints || navigator.userAgent.toLowerCase().match(/windows phone os 7/i) ? (this.each(function() {
            var curItem = !1;
            $(this).on("click", function(e) {
                var item = $(this);
                item[0] != curItem[0] && (e.preventDefault(), curItem = item)
            }), $(document).on("click touchstart MSPointerDown", function(e) {
                for (var resetItem = !0, parents = $(e.target).parents(), i = 0; i < parents.length; i++) parents[i] == curItem[0] && (resetItem = !1);
                resetItem && (curItem = !1)
            })
        }), this) : !1
    }
}(jQuery, window, document);
var Hogan = {};
! function(Hogan) {
    function findInScope(key, scope, doModelGet) {
        var val;
        return scope && "object" == typeof scope && (void 0 !== scope[key] ? val = scope[key] : doModelGet && scope.get && "function" == typeof scope.get && (val = scope.get(key))), val
    }

    function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {
        function PartialTemplate() {}

        function Substitutions() {}
        PartialTemplate.prototype = instance, Substitutions.prototype = instance.subs;
        var key, partial = new PartialTemplate;
        partial.subs = new Substitutions, partial.subsText = {}, partial.buf = "", stackSubs = stackSubs || {}, partial.stackSubs = stackSubs, partial.subsText = stackText;
        for (key in subs) stackSubs[key] || (stackSubs[key] = subs[key]);
        for (key in stackSubs) partial.subs[key] = stackSubs[key];
        stackPartials = stackPartials || {}, partial.stackPartials = stackPartials;
        for (key in partials) stackPartials[key] || (stackPartials[key] = partials[key]);
        for (key in stackPartials) partial.partials[key] = stackPartials[key];
        return partial
    }

    function coerceToString(val) {
        return String(null === val || void 0 === val ? "" : val)
    }

    function hoganEscape(str) {
        return str = coerceToString(str), hChars.test(str) ? str.replace(rAmp, "&amp;").replace(rLt, "&lt;").replace(rGt, "&gt;").replace(rApos, "&#39;").replace(rQuot, "&quot;") : str
    }
    Hogan.Template = function(codeObj, text, compiler, options) {
        codeObj = codeObj || {}, this.r = codeObj.code || this.r, this.c = compiler, this.options = options || {}, this.text = text || "", this.partials = codeObj.partials || {}, this.subs = codeObj.subs || {}, this.buf = ""
    }, Hogan.Template.prototype = {
        r: function() {
            return ""
        },
        v: hoganEscape,
        t: coerceToString,
        render: function(context, partials, indent) {
            return this.ri([context], partials || {}, indent)
        },
        ri: function(context, partials, indent) {
            return this.r(context, partials, indent)
        },
        ep: function(symbol, partials) {
            var partial = this.partials[symbol],
                template = partials[partial.name];
            if (partial.instance && partial.base == template) return partial.instance;
            if ("string" == typeof template) {
                if (!this.c) throw new Error("No compiler available.");
                template = this.c.compile(template, this.options)
            }
            if (!template) return null;
            if (this.partials[symbol].base = template, partial.subs) {
                partials.stackText || (partials.stackText = {});
                for (key in partial.subs) partials.stackText[key] || (partials.stackText[key] = void 0 !== this.activeSub && partials.stackText[this.activeSub] ? partials.stackText[this.activeSub] : this.text);
                template = createSpecializedPartial(template, partial.subs, partial.partials, this.stackSubs, this.stackPartials, partials.stackText)
            }
            return this.partials[symbol].instance = template, template
        },
        rp: function(symbol, context, partials, indent) {
            var partial = this.ep(symbol, partials);
            return partial ? partial.ri(context, partials, indent) : ""
        },
        rs: function(context, partials, section) {
            var tail = context[context.length - 1];
            if (!isArray(tail)) return void section(context, partials, this);
            for (var i = 0; i < tail.length; i++) context.push(tail[i]), section(context, partials, this), context.pop()
        },
        s: function(val, ctx, partials, inverted, start, end, tags) {
            var pass;
            return isArray(val) && 0 === val.length ? !1 : ("function" == typeof val && (val = this.ms(val, ctx, partials, inverted, start, end, tags)), pass = !!val, !inverted && pass && ctx && ctx.push("object" == typeof val ? val : ctx[ctx.length - 1]), pass)
        },
        d: function(key, ctx, partials, returnFound) {
            var found, names = key.split("."),
                val = this.f(names[0], ctx, partials, returnFound),
                doModelGet = this.options.modelGet,
                cx = null;
            if ("." === key && isArray(ctx[ctx.length - 2])) val = ctx[ctx.length - 1];
            else
                for (var i = 1; i < names.length; i++) found = findInScope(names[i], val, doModelGet), void 0 !== found ? (cx = val, val = found) : val = "";
            return returnFound && !val ? !1 : (returnFound || "function" != typeof val || (ctx.push(cx), val = this.mv(val, ctx, partials), ctx.pop()), val)
        },
        f: function(key, ctx, partials, returnFound) {
            for (var val = !1, v = null, found = !1, doModelGet = this.options.modelGet, i = ctx.length - 1; i >= 0; i--)
                if (v = ctx[i], val = findInScope(key, v, doModelGet), void 0 !== val) {
                    found = !0;
                    break
                }
            return found ? (returnFound || "function" != typeof val || (val = this.mv(val, ctx, partials)), val) : returnFound ? !1 : ""
        },
        ls: function(func, cx, partials, text, tags) {
            var oldTags = this.options.delimiters;
            return this.options.delimiters = tags, this.b(this.ct(coerceToString(func.call(cx, text)), cx, partials)), this.options.delimiters = oldTags, !1
        },
        ct: function(text, cx, partials) {
            if (this.options.disableLambda) throw new Error("Lambda features disabled.");
            return this.c.compile(text, this.options).render(cx, partials)
        },
        b: function(s) {
            this.buf += s
        },
        fl: function() {
            var r = this.buf;
            return this.buf = "", r
        },
        ms: function(func, ctx, partials, inverted, start, end, tags) {
            var textSource, cx = ctx[ctx.length - 1],
                result = func.call(cx);
            return "function" == typeof result ? inverted ? !0 : (textSource = this.activeSub && this.subsText && this.subsText[this.activeSub] ? this.subsText[this.activeSub] : this.text, this.ls(result, cx, partials, textSource.substring(start, end), tags)) : result
        },
        mv: function(func, ctx, partials) {
            var cx = ctx[ctx.length - 1],
                result = func.call(cx);
            return "function" == typeof result ? this.ct(coerceToString(result.call(cx)), cx, partials) : result
        },
        sub: function(name, context, partials, indent) {
            var f = this.subs[name];
            f && (this.activeSub = name, f(context, partials, this, indent), this.activeSub = !1)
        }
    };
    var rAmp = /&/g,
        rLt = /</g,
        rGt = />/g,
        rApos = /\'/g,
        rQuot = /\"/g,
        hChars = /[&<>\"\']/,
        isArray = Array.isArray || function(a) {
            return "[object Array]" === Object.prototype.toString.call(a)
        }
}("undefined" != typeof exports ? exports : Hogan),
function(Hogan) {
    function cleanTripleStache(token) {
        "}" === token.n.substr(token.n.length - 1) && (token.n = token.n.substring(0, token.n.length - 1))
    }

    function trim(s) {
        return s.trim ? s.trim() : s.replace(/^\s*|\s*$/g, "")
    }

    function tagChange(tag, text, index) {
        if (text.charAt(index) != tag.charAt(0)) return !1;
        for (var i = 1, l = tag.length; l > i; i++)
            if (text.charAt(index + i) != tag.charAt(i)) return !1;
        return !0
    }

    function buildTree(tokens, kind, stack, customTags) {
        var instructions = [],
            opener = null,
            tail = null,
            token = null;
        for (tail = stack[stack.length - 1]; tokens.length > 0;) {
            if (token = tokens.shift(), tail && "<" == tail.tag && !(token.tag in allowedInSuper)) throw new Error("Illegal content in < super tag.");
            if (Hogan.tags[token.tag] <= Hogan.tags.$ || isOpener(token, customTags)) stack.push(token), token.nodes = buildTree(tokens, token.tag, stack, customTags);
            else {
                if ("/" == token.tag) {
                    if (0 === stack.length) throw new Error("Closing tag without opener: /" + token.n);
                    if (opener = stack.pop(), token.n != opener.n && !isCloser(token.n, opener.n, customTags)) throw new Error("Nesting error: " + opener.n + " vs. " + token.n);
                    return opener.end = token.i, instructions
                }
                "\n" == token.tag && (token.last = 0 == tokens.length || "\n" == tokens[0].tag)
            }
            instructions.push(token)
        }
        if (stack.length > 0) throw new Error("missing closing tag: " + stack.pop().n);
        return instructions
    }

    function isOpener(token, tags) {
        for (var i = 0, l = tags.length; l > i; i++)
            if (tags[i].o == token.n) return token.tag = "#", !0
    }

    function isCloser(close, open, tags) {
        for (var i = 0, l = tags.length; l > i; i++)
            if (tags[i].c == close && tags[i].o == open) return !0
    }

    function stringifySubstitutions(obj) {
        var items = [];
        for (var key in obj) items.push('"' + esc(key) + '": function(c,p,t,i) {' + obj[key] + "}");
        return "{ " + items.join(",") + " }"
    }

    function stringifyPartials(codeObj) {
        var partials = [];
        for (var key in codeObj.partials) partials.push('"' + esc(key) + '":{name:"' + esc(codeObj.partials[key].name) + '", ' + stringifyPartials(codeObj.partials[key]) + "}");
        return "partials: {" + partials.join(",") + "}, subs: " + stringifySubstitutions(codeObj.subs)
    }

    function esc(s) {
        return s.replace(rSlash, "\\\\").replace(rQuot, '\\"').replace(rNewline, "\\n").replace(rCr, "\\r").replace(rLineSep, "\\u2028").replace(rParagraphSep, "\\u2029")
    }

    function chooseMethod(s) {
        return ~s.indexOf(".") ? "d" : "f"
    }

    function createPartial(node, context) {
        var prefix = "<" + (context.prefix || ""),
            sym = prefix + node.n + serialNo++;
        return context.partials[sym] = {
            name: node.n,
            partials: {}
        }, context.code += 't.b(t.rp("' + esc(sym) + '",c,p,"' + (node.indent || "") + '"));', sym
    }

    function tripleStache(node, context) {
        context.code += "t.b(t.t(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));'
    }

    function write(s) {
        return "t.b(" + s + ");"
    }
    var rIsWhitespace = /\S/,
        rQuot = /\"/g,
        rNewline = /\n/g,
        rCr = /\r/g,
        rSlash = /\\/g,
        rLineSep = /\u2028/,
        rParagraphSep = /\u2029/;
    Hogan.tags = {
        "#": 1,
        "^": 2,
        "<": 3,
        $: 4,
        "/": 5,
        "!": 6,
        ">": 7,
        "=": 8,
        _v: 9,
        "{": 10,
        "&": 11,
        _t: 12
    }, Hogan.scan = function(text, delimiters) {
        function addBuf() {
            buf.length > 0 && (tokens.push({
                tag: "_t",
                text: new String(buf)
            }), buf = "")
        }

        function lineIsWhitespace() {
            for (var isAllWhitespace = !0, j = lineStart; j < tokens.length; j++)
                if (isAllWhitespace = Hogan.tags[tokens[j].tag] < Hogan.tags._v || "_t" == tokens[j].tag && null === tokens[j].text.match(rIsWhitespace), !isAllWhitespace) return !1;
            return isAllWhitespace
        }

        function filterLine(haveSeenTag, noNewLine) {
            if (addBuf(), haveSeenTag && lineIsWhitespace())
                for (var next, j = lineStart; j < tokens.length; j++) tokens[j].text && ((next = tokens[j + 1]) && ">" == next.tag && (next.indent = tokens[j].text.toString()), tokens.splice(j, 1));
            else noNewLine || tokens.push({
                tag: "\n"
            });
            seenTag = !1, lineStart = tokens.length
        }

        function changeDelimiters(text, index) {
            var close = "=" + ctag,
                closeIndex = text.indexOf(close, index),
                delimiters = trim(text.substring(text.indexOf("=", index) + 1, closeIndex)).split(" ");
            return otag = delimiters[0], ctag = delimiters[delimiters.length - 1], closeIndex + close.length - 1
        }
        var len = text.length,
            IN_TEXT = 0,
            IN_TAG_TYPE = 1,
            IN_TAG = 2,
            state = IN_TEXT,
            tagType = null,
            tag = null,
            buf = "",
            tokens = [],
            seenTag = !1,
            i = 0,
            lineStart = 0,
            otag = "{{",
            ctag = "}}";
        for (delimiters && (delimiters = delimiters.split(" "), otag = delimiters[0], ctag = delimiters[1]), i = 0; len > i; i++) state == IN_TEXT ? tagChange(otag, text, i) ? (--i, addBuf(), state = IN_TAG_TYPE) : "\n" == text.charAt(i) ? filterLine(seenTag) : buf += text.charAt(i) : state == IN_TAG_TYPE ? (i += otag.length - 1, tag = Hogan.tags[text.charAt(i + 1)], tagType = tag ? text.charAt(i + 1) : "_v", "=" == tagType ? (i = changeDelimiters(text, i), state = IN_TEXT) : (tag && i++, state = IN_TAG), seenTag = i) : tagChange(ctag, text, i) ? (tokens.push({
            tag: tagType,
            n: trim(buf),
            otag: otag,
            ctag: ctag,
            i: "/" == tagType ? seenTag - otag.length : i + ctag.length
        }), buf = "", i += ctag.length - 1, state = IN_TEXT, "{" == tagType && ("}}" == ctag ? i++ : cleanTripleStache(tokens[tokens.length - 1]))) : buf += text.charAt(i);
        return filterLine(seenTag, !0), tokens
    };
    var allowedInSuper = {
        _t: !0,
        "\n": !0,
        $: !0,
        "/": !0
    };
    Hogan.stringify = function(codeObj) {
        return "{code: function (c,p,i) { " + Hogan.wrapMain(codeObj.code) + " }," + stringifyPartials(codeObj) + "}"
    };
    var serialNo = 0;
    Hogan.generate = function(tree, text, options) {
        serialNo = 0;
        var context = {
            code: "",
            subs: {},
            partials: {}
        };
        return Hogan.walk(tree, context), options.asString ? this.stringify(context, text, options) : this.makeTemplate(context, text, options)
    }, Hogan.wrapMain = function(code) {
        return 'var t=this;t.b(i=i||"");' + code + "return t.fl();"
    }, Hogan.template = Hogan.Template, Hogan.makeTemplate = function(codeObj, text, options) {
        var template = this.makePartials(codeObj);
        return template.code = new Function("c", "p", "i", this.wrapMain(codeObj.code)), new this.template(template, text, this, options)
    }, Hogan.makePartials = function(codeObj) {
        var key, template = {
            subs: {},
            partials: codeObj.partials,
            name: codeObj.name
        };
        for (key in template.partials) template.partials[key] = this.makePartials(template.partials[key]);
        for (key in codeObj.subs) template.subs[key] = new Function("c", "p", "t", "i", codeObj.subs[key]);
        return template
    }, Hogan.codegen = {
        "#": function(node, context) {
            context.code += "if(t.s(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,0,' + node.i + "," + node.end + ',"' + node.otag + " " + node.ctag + '")){t.rs(c,p,function(c,p,t){', Hogan.walk(node.nodes, context), context.code += "});c.pop();}"
        },
        "^": function(node, context) {
            context.code += "if(!t.s(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,1,0,0,"")){', Hogan.walk(node.nodes, context), context.code += "};"
        },
        ">": createPartial,
        "<": function(node, context) {
            var ctx = {
                partials: {},
                code: "",
                subs: {},
                inPartial: !0
            };
            Hogan.walk(node.nodes, ctx);
            var template = context.partials[createPartial(node, context)];
            template.subs = ctx.subs, template.partials = ctx.partials
        },
        $: function(node, context) {
            var ctx = {
                subs: {},
                code: "",
                partials: context.partials,
                prefix: node.n
            };
            Hogan.walk(node.nodes, ctx), context.subs[node.n] = ctx.code, context.inPartial || (context.code += 't.sub("' + esc(node.n) + '",c,p,i);')
        },
        "\n": function(node, context) {
            context.code += write('"\\n"' + (node.last ? "" : " + i"))
        },
        _v: function(node, context) {
            context.code += "t.b(t.v(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));'
        },
        _t: function(node, context) {
            context.code += write('"' + esc(node.text) + '"')
        },
        "{": tripleStache,
        "&": tripleStache
    }, Hogan.walk = function(nodelist, context) {
        for (var func, i = 0, l = nodelist.length; l > i; i++) func = Hogan.codegen[nodelist[i].tag], func && func(nodelist[i], context);
        return context
    }, Hogan.parse = function(tokens, text, options) {
        return options = options || {}, buildTree(tokens, "", [], options.sectionTags || [])
    }, Hogan.cache = {}, Hogan.cacheKey = function(text, options) {
        return [text, !!options.asString, !!options.disableLambda, options.delimiters, !!options.modelGet].join("||")
    }, Hogan.compile = function(text, options) {
        options = options || {};
        var key = Hogan.cacheKey(text, options),
            template = this.cache[key];
        if (template) {
            var partials = template.partials;
            for (var name in partials) delete partials[name].instance;
            return template
        }
        return template = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options), this.cache[key] = template
    }
}("undefined" != typeof exports ? exports : Hogan),
function($) {
    $.fn.hoverIntent = function(handlerIn, handlerOut, selector) {
        var cfg = {
            interval: 100,
            sensitivity: 7,
            timeout: 0
        };
        cfg = "object" == typeof handlerIn ? $.extend(cfg, handlerIn) : $.isFunction(handlerOut) ? $.extend(cfg, {
            over: handlerIn,
            out: handlerOut,
            selector: selector
        }) : $.extend(cfg, {
            over: handlerIn,
            out: handlerIn,
            selector: handlerOut
        });
        var cX, cY, pX, pY, track = function(ev) {
                cX = ev.pageX, cY = ev.pageY
            },
            compare = function(ev, ob) {
                return ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t), Math.abs(pX - cX) + Math.abs(pY - cY) < cfg.sensitivity ? ($(ob).off("mousemove.hoverIntent", track), ob.hoverIntent_s = 1, cfg.over.apply(ob, [ev])) : (pX = cX, pY = cY, ob.hoverIntent_t = setTimeout(function() {
                    compare(ev, ob)
                }, cfg.interval), void 0)
            },
            delay = function(ev, ob) {
                return ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t), ob.hoverIntent_s = 0, cfg.out.apply(ob, [ev])
            },
            handleHover = function(e) {
                var ev = jQuery.extend({}, e),
                    ob = this;
                ob.hoverIntent_t && (ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t)), "mouseenter" == e.type ? (pX = ev.pageX, pY = ev.pageY, $(ob).on("mousemove.hoverIntent", track), 1 != ob.hoverIntent_s && (ob.hoverIntent_t = setTimeout(function() {
                    compare(ev, ob)
                }, cfg.interval))) : ($(ob).off("mousemove.hoverIntent", track), 1 == ob.hoverIntent_s && (ob.hoverIntent_t = setTimeout(function() {
                    delay(ev, ob)
                }, cfg.timeout)))
            };
        return this.on({
            "mouseenter.hoverIntent": handleHover,
            "mouseleave.hoverIntent": handleHover
        }, cfg.selector)
    }
}(jQuery),
function() {
    function e() {}

    function t(e, t) {
        for (var n = e.length; n--;)
            if (e[n].listener === t) return n;
        return -1
    }

    function n(e) {
        return function() {
            return this[e].apply(this, arguments)
        }
    }
    var i = e.prototype,
        r = this,
        o = r.EventEmitter;
    i.getListeners = function(e) {
        var t, n, i = this._getEvents();
        if ("object" == typeof e) {
            t = {};
            for (n in i) i.hasOwnProperty(n) && e.test(n) && (t[n] = i[n])
        } else t = i[e] || (i[e] = []);
        return t
    }, i.flattenListeners = function(e) {
        var t, n = [];
        for (t = 0; e.length > t; t += 1) n.push(e[t].listener);
        return n
    }, i.getListenersAsObject = function(e) {
        var t, n = this.getListeners(e);
        return n instanceof Array && (t = {}, t[e] = n), t || n
    }, i.addListener = function(e, n) {
        var i, r = this.getListenersAsObject(e),
            o = "object" == typeof n;
        for (i in r) r.hasOwnProperty(i) && -1 === t(r[i], n) && r[i].push(o ? n : {
            listener: n,
            once: !1
        });
        return this
    }, i.on = n("addListener"), i.addOnceListener = function(e, t) {
        return this.addListener(e, {
            listener: t,
            once: !0
        })
    }, i.once = n("addOnceListener"), i.defineEvent = function(e) {
        return this.getListeners(e), this
    }, i.defineEvents = function(e) {
        for (var t = 0; e.length > t; t += 1) this.defineEvent(e[t]);
        return this
    }, i.removeListener = function(e, n) {
        var i, r, o = this.getListenersAsObject(e);
        for (r in o) o.hasOwnProperty(r) && (i = t(o[r], n), -1 !== i && o[r].splice(i, 1));
        return this
    }, i.off = n("removeListener"), i.addListeners = function(e, t) {
        return this.manipulateListeners(!1, e, t)
    }, i.removeListeners = function(e, t) {
        return this.manipulateListeners(!0, e, t)
    }, i.manipulateListeners = function(e, t, n) {
        var i, r, o = e ? this.removeListener : this.addListener,
            s = e ? this.removeListeners : this.addListeners;
        if ("object" != typeof t || t instanceof RegExp)
            for (i = n.length; i--;) o.call(this, t, n[i]);
        else
            for (i in t) t.hasOwnProperty(i) && (r = t[i]) && ("function" == typeof r ? o.call(this, i, r) : s.call(this, i, r));
        return this
    }, i.removeEvent = function(e) {
        var t, n = typeof e,
            i = this._getEvents();
        if ("string" === n) delete i[e];
        else if ("object" === n)
            for (t in i) i.hasOwnProperty(t) && e.test(t) && delete i[t];
        else delete this._events;
        return this
    }, i.removeAllListeners = n("removeEvent"), i.emitEvent = function(e, t) {
        var n, i, r, o, s = this.getListenersAsObject(e);
        for (r in s)
            if (s.hasOwnProperty(r))
                for (i = s[r].length; i--;) n = s[r][i], n.once === !0 && this.removeListener(e, n.listener), o = n.listener.apply(this, t || []), o === this._getOnceReturnValue() && this.removeListener(e, n.listener);
        return this
    }, i.trigger = n("emitEvent"), i.emit = function(e) {
        var t = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(e, t)
    }, i.setOnceReturnValue = function(e) {
        return this._onceReturnValue = e, this
    }, i._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, i._getEvents = function() {
        return this._events || (this._events = {})
    }, e.noConflict = function() {
        return r.EventEmitter = o, e
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return e
    }) : "object" == typeof module && module.exports ? module.exports = e : this.EventEmitter = e
}.call(this),
    function(e) {
        function t(t) {
            var n = e.event;
            return n.target = n.target || n.srcElement || t, n
        }
        var n = document.documentElement,
            i = function() {};
        n.addEventListener ? i = function(e, t, n) {
            e.addEventListener(t, n, !1)
        } : n.attachEvent && (i = function(e, n, i) {
            e[n + i] = i.handleEvent ? function() {
                var n = t(e);
                i.handleEvent.call(i, n)
            } : function() {
                var n = t(e);
                i.call(e, n)
            }, e.attachEvent("on" + n, e[n + i])
        });
        var r = function() {};
        n.removeEventListener ? r = function(e, t, n) {
            e.removeEventListener(t, n, !1)
        } : n.detachEvent && (r = function(e, t, n) {
            e.detachEvent("on" + t, e[t + n]);
            try {
                delete e[t + n]
            } catch (i) {
                e[t + n] = void 0
            }
        });
        var o = {
            bind: i,
            unbind: r
        };
        "function" == typeof define && define.amd ? define("eventie/eventie", o) : e.eventie = o
    }(this),
    function(e, t) {
        "function" == typeof define && define.amd ? define(["eventEmitter/EventEmitter", "eventie/eventie"], function(n, i) {
            return t(e, n, i)
        }) : "object" == typeof exports ? module.exports = t(e, require("eventEmitter"), require("eventie")) : e.imagesLoaded = t(e, e.EventEmitter, e.eventie)
    }(this, function(e, t, n) {
        function i(e, t) {
            for (var n in t) e[n] = t[n];
            return e
        }

        function r(e) {
            return "[object Array]" === d.call(e)
        }

        function o(e) {
            var t = [];
            if (r(e)) t = e;
            else if ("number" == typeof e.length)
                for (var n = 0, i = e.length; i > n; n++) t.push(e[n]);
            else t.push(e);
            return t
        }

        function s(e, t, n) {
            if (!(this instanceof s)) return new s(e, t);
            "string" == typeof e && (e = document.querySelectorAll(e)), this.elements = o(e), this.options = i({}, this.options), "function" == typeof t ? n = t : i(this.options, t), n && this.on("always", n), this.getImages(), a && (this.jqDeferred = new a.Deferred);
            var r = this;
            setTimeout(function() {
                r.check()
            })
        }

        function c(e) {
            this.img = e
        }

        function f(e) {
            this.src = e, v[e] = this
        }
        var a = e.jQuery,
            u = e.console,
            h = void 0 !== u,
            d = Object.prototype.toString;
        s.prototype = new t, s.prototype.options = {}, s.prototype.getImages = function() {
            this.images = [];
            for (var e = 0, t = this.elements.length; t > e; e++) {
                var n = this.elements[e];
                "IMG" === n.nodeName && this.addImage(n);
                for (var i = n.querySelectorAll("img"), r = 0, o = i.length; o > r; r++) {
                    var s = i[r];
                    this.addImage(s)
                }
            }
        }, s.prototype.addImage = function(e) {
            var t = new c(e);
            this.images.push(t)
        }, s.prototype.check = function() {
            function e(e, r) {
                return t.options.debug && h && u.log("confirm", e, r), t.progress(e), n++, n === i && t.complete(), !0
            }
            var t = this,
                n = 0,
                i = this.images.length;
            if (this.hasAnyBroken = !1, !i) return void this.complete();
            for (var r = 0; i > r; r++) {
                var o = this.images[r];
                o.on("confirm", e), o.check()
            }
        }, s.prototype.progress = function(e) {
            this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded;
            var t = this;
            setTimeout(function() {
                t.emit("progress", t, e), t.jqDeferred && t.jqDeferred.notify && t.jqDeferred.notify(t, e)
            })
        }, s.prototype.complete = function() {
            var e = this.hasAnyBroken ? "fail" : "done";
            this.isComplete = !0;
            var t = this;
            setTimeout(function() {
                if (t.emit(e, t), t.emit("always", t), t.jqDeferred) {
                    var n = t.hasAnyBroken ? "reject" : "resolve";
                    t.jqDeferred[n](t)
                }
            })
        }, a && (a.fn.imagesLoaded = function(e, t) {
            var n = new s(this, e, t);
            return n.jqDeferred.promise(a(this))
        }), c.prototype = new t, c.prototype.check = function() {
            var e = v[this.img.src] || new f(this.img.src);
            if (e.isConfirmed) return void this.confirm(e.isLoaded, "cached was confirmed");
            if (this.img.complete && void 0 !== this.img.naturalWidth) return void this.confirm(0 !== this.img.naturalWidth, "naturalWidth");
            var t = this;
            e.on("confirm", function(e, n) {
                return t.confirm(e.isLoaded, n), !0
            }), e.check()
        }, c.prototype.confirm = function(e, t) {
            this.isLoaded = e, this.emit("confirm", this, t)
        };
        var v = {};
        return f.prototype = new t, f.prototype.check = function() {
            if (!this.isChecked) {
                var e = new Image;
                n.bind(e, "load", this), n.bind(e, "error", this), e.src = this.src, this.isChecked = !0
            }
        }, f.prototype.handleEvent = function(e) {
            var t = "on" + e.type;
            this[t] && this[t](e)
        }, f.prototype.onload = function(e) {
            this.confirm(!0, "onload"), this.unbindProxyEvents(e)
        }, f.prototype.onerror = function(e) {
            this.confirm(!1, "onerror"), this.unbindProxyEvents(e)
        }, f.prototype.confirm = function(e, t) {
            this.isConfirmed = !0, this.isLoaded = e, this.emit("confirm", this, t)
        }, f.prototype.unbindProxyEvents = function(e) {
            n.unbind(e.target, "load", this), n.unbind(e.target, "error", this)
        }, s
    }), window.requestAnimFrame = function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1e3 / 60)
        }
    }(), window.cancelRequestAnimFrame = function() {
        return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout
    }();
var Intense = function() {
    "use strict";

    function extend(target, source) {
        for (var key in source) key in target || (target[key] = source[key]);
        return target
    }

    function applyProperties(target, properties) {
        for (var key in properties) target.style[key] = properties[key]
    }

    function getFit(source) {
        var heightRatio = window.innerHeight / source.h;
        if (source.w * heightRatio > window.innerWidth) return {
            w: source.w * heightRatio,
            h: source.h * heightRatio,
            fit: !0
        };
        var widthRatio = window.innerWidth / source.w;
        return {
            w: source.w * widthRatio,
            h: source.h * widthRatio,
            fit: !1
        }
    }

    function startTracking(passedElements) {
        var i;
        if (passedElements.length)
            for (i = 0; i < passedElements.length; i++) track(passedElements[i]);
        else track(passedElements)
    }

    function track(element) {
        (element.getAttribute("data-image") || element.src) && element.addEventListener("click", function() {
            init(this)
        }, !1)
    }

    function start() {
        loop()
    }

    function stop() {
        cancelRequestAnimFrame(looper)
    }

    function loop() {
        looper = requestAnimFrame(loop), positionTarget()
    }

    function lockBody() {
        overflowValue = document.body.style.overflow, document.body.style.overflow = "hidden"
    }

    function unlockBody() {
        document.body.style.overflow = overflowValue
    }

    function createViewer(title, caption) {
        var containerProperties = {
            backgroundColor: "rgba(0,0,0,0.8)",
            width: "100%",
            height: "100%",
            position: "fixed",
            top: "0px",
            left: "0px",
            overflow: "hidden",
            zIndex: "999999",
            margin: "0px",
            webkitTransition: "opacity 150ms cubic-bezier( 0, 0, .26, 1 )",
            MozTransition: "opacity 150ms cubic-bezier( 0, 0, .26, 1 )",
            transition: "opacity 150ms cubic-bezier( 0, 0, .26, 1 )",
            opacity: "0"
        };
        container = document.createElement("figure"), container.appendChild(target), applyProperties(container, containerProperties);
        var imageProperties = {
            cursor: 'url( "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3Q0IyNDI3M0FFMkYxMUUzOEQzQUQ5NTMxMDAwQjJGRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3Q0IyNDI3NEFFMkYxMUUzOEQzQUQ5NTMxMDAwQjJGRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdDQjI0MjcxQUUyRjExRTM4RDNBRDk1MzEwMDBCMkZEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdDQjI0MjcyQUUyRjExRTM4RDNBRDk1MzEwMDBCMkZEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+soZ1WgAABp5JREFUeNrcWn9MlVUY/u4dogIapV0gQ0SUO4WAXdT8B5ULc6uFgK3MLFxzFrQFZMtaed0oKTPj1x8EbbZZK5fNCdLWcvxQ+EOHyAQlBgiIVFxAJuUF7YrQ81zOtU+8F+Pe78K1d3s5537f+fE8nPec7z3vOSpJIRkbGwtEEgtdBdVCl0AXQr2hKqgJeg16BdoCrYNWqVSqbif7VQT8YqgB2jTmuDSJNoIcJUJVOVg5EsmH0Oehaj4bGRkZ6uvra2xvb29oamrqbGxs7K2vrx/s7Oy8yffBwcFzdTqdb0REhF9YWFhwSEhIpEajifDw8PAWzY5Cj0GzMUoNUx0R1RQJaJAcgKaw7ujo6O2urq7qysrKioyMjHNDQ0OjU2nP29tbnZ+fv1qv18cFBQWtU6vVs9gN9BvobhDqU5wIKryA5CuoLwj83dzc/NOePXuOlpSUXFNijiUlJS3ct2/fiytWrHgOhGbj0SD0dZD5UREiKOiJJA+axt9Go7F2165deUeOHOmVXCBbt271y8nJyfD3939aPCqCZoCQ2WEiKOQj7HYjzejUqVNFcXFxJdI0SEVFRdKGDRtShbmd5HwEGZM9IupJSHiJBjaazebr2dnZmdNFgsK+2Cf7JgZiEZhsimoSc/oZqh8eHjamp6fvPnTo0O/SDMiOHTsWFRQUHPDy8vLnQEGflZvZpKaFl4WcE7du3epPTU19+/Dhwz3SDMr27dsDioqKcufMmfM45wyIpD3QtPBiC0lgTowcPHgwa6ZJUIiBWIgJP1OB8aVJTQsFnkDSxCUWk60gPj6+VHIjKS8vT8TcSRdLcxhG5g+bpoWH3yF5ube3tw7L33uSGwqW/8/8/Pzoz30PItvuMy080HEZx/CZDQZDgeSmQmzESKwC870jgodcWhPhJx0LDw8vlNxYLl269Cb8Nfp5NP2kuyMiPM8EfvTodkhuLsQoJn4C/VG5ab3CfHd3d41SvpMrhRiBtVrgf01OZBv/nIRID4nIsG6xzBGxs7vK/YSvr2/SVF3xiYL55bVgwYJZp0+f/nOycuvXr38E+xczvOibjvTDLcDg4OBx7GfoD4ZwRPR8gUYbnCUBF3wuHMtPy8rKcmJjY33tleM7lqmpqdnPOo70RazAfNHapFrssaWOjo6Lzg43vj2zPT09febNm7ektLT0C1tk+IzvWIZlWcfR/oC5UWSjSCSUudbW1qvOEqmqqhrcvHnzOzdu3Lhii4ycBMuwLOs42t/ly5etmLUkEsJcbW3tbwq5ETbJ2CLBss70dfbsWSvmpZzsnJTzo6KiEhoaGoaVWlXkwE0mkyXk4+PjE6gUCUpMTMz86urq48gOkIjFWYHfEqf0EkkyJ06cyCMB/iah5OTkTCVIUDQajQf8wl+QNaune/2/c+eOS9olkb+YiYyM9FJ6NGhaHA2OBJV5e6uZI6LVaq2YTSTSz9zatWsfc8X84JzYtGlTJtXeauaorFy5cr7IXieRdubWrFnzpCtIJCYmWpZYKvNKksE/34q5g0RamQsNDV3sKhLy74ySZJYtW2bF3EIidZaFeOnSp5wl0t/fb4aYbJGwRYZlWcfR/mSYL8idRhOcxuTpdBoHBgZuY5Pk0LfrPqdRnE8080Fubm60Aru34QeRoLCMoyQoxCpItFnnCIVBB2kj5GHZj8iw/iDfWJHIaGBgYAyj4u5OghiBdZ00fqby9V0iMK8rSMoYMGZo392JECOwehAztHNipPFjxiGw0UnYuXPnInclQWzEKI0fCH1kL9JoCdAZjcZzAQEB77sjkZ6env3YjK22G6AT8i7DkSzI8KS7kSAmQWJQYL3HabwrjKVK4mQKX9w0g8EQ6i4k9u7dqyUm8TNNYJVsmpbMxL5EkuouxwopKSn+xcXFeeJYoRgkUmVYJyXirgc9ldBnbB302NxYiYJcGc6wgcLCwvysrCztTJgT+xYkzhCTvUPR//9hqBgZkxiZYjao1+vf4vLH4XalKbEP9iVIFIuRME2K9b92MOHCAEOdZS66MJAAAp5iiX0DBI4+ANfUiIhKvMLxOfRVSXaFA2ZQnpmZWefIFY68vLxVMNf4CVc4vuV3wiVXOCZUjkLygXTvpRoTL9Uw9NrS0tJVX1/fc/78+ettbW2WIPXy5cvnRkdHP6rT6QK0Wm0QNkXhGo0mUrjikvTvpZpPQODCFLA4bw6ya06/OnHNqXnGrjnZIyWNXzyjC0GPYIk0fvHM+h+XXzxjnOCcNH7x7KqT/VrSfwQYAOAcX9HTDttYAAAAAElFTkSuQmCC" ) 25 25, no-drop'
        };
        applyProperties(target, imageProperties);
        var captionContainerProperties = {
                fontFamily: '"franklin-gothic-urw", "Helvetica Neue", Helvetica, sans-serif',
                position: "fixed",
                bottom: "0px",
                left: "0px",
                padding: "20px",
                color: "#fff",
                wordSpacing: "0.2px",
                webkitFontSmoothing: "antialiased",
                textShadow: "-1px 0px 1px rgba(0,0,0,0.4)"
            },
            captionContainer = document.createElement("figcaption");
        if (applyProperties(captionContainer, captionContainerProperties), title) {
            var captionTitleProperties = {
                    margin: "0px",
                    padding: "0px",
                    fontWeight: "normal",
                    fontSize: "40px",
                    letterSpacing: "0.5px",
                    lineHeight: "35px",
                    textAlign: "left",
                    color: "#ffffff"
                },
                captionTitle = document.createElement("h1");
            applyProperties(captionTitle, captionTitleProperties), captionTitle.innerHTML = title, captionContainer.appendChild(captionTitle)
        }
        if (caption) {
            var captionTextProperties = {
                    margin: "0px",
                    padding: "0px",
                    fontWeight: "normal",
                    fontSize: "20px",
                    letterSpacing: "0.1px",
                    maxWidth: "500px",
                    textAlign: "left",
                    background: "none",
                    marginTop: "5px"
                },
                captionText = document.createElement("h2");
            applyProperties(captionText, captionTextProperties), captionText.innerHTML = caption, captionContainer.appendChild(captionText)
        }
        container.appendChild(captionContainer), setDimensions(), mouse.xCurr = mouse.xDest = window.innerWidth / 2, mouse.yCurr = mouse.yDest = window.innerHeight / 2, document.body.appendChild(container), setTimeout(function() {
            container.style.opacity = "1"
        }, 10)
    }

    function removeViewer() {
        unlockBody(), unbindEvents(), document.body.removeChild(container)
    }

    function setDimensions() {
        var imageDimensions = getFit(sourceDimensions);
        target.width = imageDimensions.w, target.height = imageDimensions.h, horizontalOrientation = imageDimensions.fit, targetDimensions = {
            w: target.width,
            h: target.height
        }, containerDimensions = {
            w: window.innerWidth,
            h: window.innerHeight
        }, overflowArea = {
            x: containerDimensions.w - targetDimensions.w,
            y: containerDimensions.h - targetDimensions.h
        }
    }

    function init(element) {
        var imageSource = element.getAttribute("data-image") || element.src,
            title = element.getAttribute("data-title"),
            caption = element.getAttribute("data-caption"),
            img = new Image;
        img.onload = function() {
            sourceDimensions = {
                w: img.width,
                h: img.height
            }, target = this, createViewer(title, caption), lockBody(), bindEvents(), loop()
        }, img.src = imageSource
    }

    function bindEvents() {
        container.addEventListener("mousemove", onMouseMove, !1), container.addEventListener("touchmove", onTouchMove, !1), window.addEventListener("resize", setDimensions, !1), window.addEventListener("keyup", onKeyUp, !1), target.addEventListener("click", removeViewer, !1)
    }

    function unbindEvents() {
        container.removeEventListener("mousemove", onMouseMove, !1), container.removeEventListener("touchmove", onTouchMove, !1), window.removeEventListener("resize", setDimensions, !1), window.removeEventListener("keyup", onKeyUp, !1), target.removeEventListener("click", removeViewer, !1)
    }

    function onMouseMove(event) {
        mouse.xDest = event.clientX, mouse.yDest = event.clientY
    }

    function onTouchMove(event) {
        event.preventDefault(), mouse.xDest = event.touches[0].clientX, mouse.yDest = event.touches[0].clientY
    }

    function onKeyUp(event) {
        event.preventDefault(), event.keyCode === KEYCODE_ESC && removeViewer()
    }

    function positionTarget() {
        if (mouse.xCurr += .05 * (mouse.xDest - mouse.xCurr), mouse.yCurr += .05 * (mouse.yDest - mouse.yCurr), horizontalOrientation === !0) {
            if (currentPosition += mouse.xCurr - currentPosition, mouse.xCurr !== lastPosition) {
                var position = parseFloat(currentPosition / containerDimensions.w);
                position = overflowArea.x * position, target.style.webkitTransform = "translate3d(" + position + "px, 0px, 0px)", target.style.MozTransform = "translate3d(" + position + "px, 0px, 0px)", target.style.msTransform = "translate3d(" + position + "px, 0px, 0px)", lastPosition = mouse.xCurr
            }
        } else if (horizontalOrientation === !1 && (currentPosition += mouse.yCurr - currentPosition, mouse.yCurr !== lastPosition)) {
            var position = parseFloat(currentPosition / containerDimensions.h);
            position = overflowArea.y * position, target.style.webkitTransform = "translate3d( 0px, " + position + "px, 0px)", target.style.MozTransform = "translate3d( 0px, " + position + "px, 0px)", target.style.msTransform = "translate3d( 0px, " + position + "px, 0px)", lastPosition = mouse.yCurr
        }
    }

    function main(element) {
        if (!element) throw "You need to pass an element!";
        startTracking(element)
    }
    var looper, lastPosition, sourceDimensions, target, container, overflowValue, KEYCODE_ESC = 27,
        mouse = {
            xCurr: 0,
            yCurr: 0,
            xDest: 0,
            yDest: 0
        },
        horizontalOrientation = !0,
        currentPosition = 0,
        targetDimensions = {
            w: 0,
            h: 0
        },
        containerDimensions = {
            w: 0,
            h: 0
        },
        overflowArea = {
            x: 0,
            y: 0
        };
    return extend(main, {
        resize: setDimensions,
        start: start,
        stop: stop
    })
}();
! function($, window, undefined) {
    "$:nomunge";

    function get_fragment(url) {
        url = url || location.href;
        var index = url.indexOf("#");
        return -1 === index ? "#" : url.substr(index)
    }
    var fake_onhashchange, str_hashchange = "hashchange",
        doc = document,
        special = $.event.special,
        doc_mode = doc.documentMode,
        supports_onhashchange = "on" + str_hashchange in window && (doc_mode === undefined || doc_mode > 7);
    $.fn[str_hashchange] = function(fn) {
        return fn ? this.bind(str_hashchange, fn) : this.trigger(str_hashchange)
    }, $.fn[str_hashchange].delay = 50, special[str_hashchange] = $.extend(special[str_hashchange], {
        setup: function() {
            return supports_onhashchange ? !1 : void $(fake_onhashchange.start)
        },
        teardown: function() {
            return supports_onhashchange ? !1 : void $(fake_onhashchange.stop)
        }
    }), fake_onhashchange = function() {
        function poll() {
            var hash = get_fragment(),
                history_hash = history_get(last_hash);
            hash !== last_hash ? (history_set(last_hash = hash, history_hash), $(window).trigger(str_hashchange)) : history_hash !== last_hash && (location.href = location.href.replace(/#.*/, "") + history_hash), timeout_id = setTimeout(poll, $.fn[str_hashchange].delay)
        }
        var timeout_id, self = {},
            last_hash = get_fragment(),
            fn_retval = function(val) {
                return val
            },
            history_set = fn_retval,
            history_get = fn_retval;
        return self.start = function() {
            timeout_id || poll()
        }, self.stop = function() {
            timeout_id && clearTimeout(timeout_id), timeout_id = undefined
        }, window.attachEvent && !window.addEventListener && !supports_onhashchange && function() {
            var iframe, iframe_src;
            self.start = function() {
                iframe || (iframe_src = $.fn[str_hashchange].src, iframe_src = iframe_src && iframe_src + get_fragment(), iframe = $('<iframe tabindex="-1" title="empty"/>').hide().one("load", function() {
                    iframe_src || history_set(get_fragment()), poll()
                }).attr("src", iframe_src || "javascript:0").insertAfter("body")[0].contentWindow, doc.onpropertychange = function() {
                    try {
                        "title" === event.propertyName && (iframe.document.title = doc.title)
                    } catch (e) {}
                })
            }, self.stop = fn_retval, history_get = function() {
                return get_fragment(iframe.location.href)
            }, history_set = function(hash, history_hash) {
                var iframe_doc = iframe.document,
                    domain = $.fn[str_hashchange].domain;
                hash !== history_hash && (iframe_doc.title = doc.title, iframe_doc.open(), domain && iframe_doc.write('<script>document.domain="' + domain + '"</script>'), iframe_doc.close(), iframe.location.hash = hash)
            }
        }(), self
    }()
}(jQuery, this);
var miniCartTemplate = Hogan.compile('\n  {{#success}}\n    {{#rates}}\n    <option value="{{{price}}}">{{name}}</option>\n    {{/rates}}\n  {{/success}}\n  {{^success}}\n  <option value="0">No Shipping Available</option>\n  {{/success}}\n'),
    cartTemplate = Hogan.compile('\n  {{#success}}\n    {{^rates}}\n    <p id="shipping-rates-feedback" class="{{#success}}success{{/success}}{{^success}}error{{/success}}">\n      We do not ship to this destination.\n    </p>\n    {{/rates}}\n  {{/success}}\n  {{^success}}\n  <p id="shipping-rates-feedback" class="{{#success}}success{{/success}}{{^success}}error{{/success}}">\n    {{errorFeedback}}\n  </p>\n  {{/success}}\n  <div class="rates">\n    <div class="message">\n      <div class="message-center">\n        <h4>Available Rates</h4>\n        <a href="/pages/shopping-with-us#about-shipping-rates">Service Details</a>\n      </div>\n    </div>\n    <div class="list">\n      <ul>\n        {{#rates}}\n        <li>{{{price}}}<br>{{name}}</li>\n        {{/rates}}\n      </ul>\n    </div>\n  </div>\n');
if ("object" == typeof Countries && (Countries.updateProvinceLabel = function(country, provinceLabelElement) {
        if ("string" == typeof country && Countries[country] && Countries[country].provinces) {
            if ("object" != typeof provinceLabelElement && (provinceLabelElement = document.getElementById("address_province_label"), null === provinceLabelElement)) return;
            provinceLabelElement.innerHTML = Countries[country].label; {
                var provinceContainer = $(provinceLabelElement).parent();
                provinceContainer.find("select")
            }
            provinceContainer.find(".custom-style-select-box-inner").html(Countries[country].provinces[0])
        }
    }), "undefined" == typeof Shopify.Cart && (Shopify.Cart = {}), Shopify.Cart.ShippingCalculator = function() {
        var _config = {
                submitButton: "Calculate shipping",
                submitButtonDisabled: "Calculating...",
                wrapperId: "wrapper-response",
                customerIsLoggedIn: !1,
                moneyFormat: "${{amount}}",
                miniCart: !1,
                callback: function() {}
            },
            _render = function(response) {
                for (i = 0; i < response.rates.length; i++) response.rates[i].name = response.rates[i].name.split(" with")[0];
                var wrapper = jQuery("#" + _config.wrapperId);
                if (wrapper.length) {
                    if (_config.miniCart) var compiled = miniCartTemplate.render(response);
                    else var compiled = cartTemplate.render(response);
                    if ($(compiled).appendTo(wrapper), _config.callback(), "undefined" != typeof Currency && "function" == typeof Currency.convertAll) {
                        var newCurrency = "";
                        jQuery("[name=currencies]").size() ? newCurrency = jQuery("[name=currencies]").val() : jQuery("#currencies span.selected").size() && (newCurrency = jQuery("#currencies span.selected").attr("data-currency")), "" !== newCurrency && Currency.convertAll(shopCurrency, newCurrency, "#wrapper-response span.money, #estimated-shipping span.money")
                    }
                }
            },
            _enableButtons = function() {
                jQuery(".get-rates").removeAttr("disabled").removeClass("disabled").val(_config.submitButton)
            },
            _disableButtons = function() {
                jQuery(".get-rates").val(_config.submitButtonDisabled).attr("disabled", "disabled").addClass("disabled")
            },
            _getCartShippingRatesForDestination = function(shipping_address) {
                var params = {
                    type: "GET",
                    url: "/cart/shipping_rates.json",
                    data: jQuery.param({
                        shipping_address: shipping_address
                    }),
                    dataType: "json",
                    success: function(response) {
                        rates = response.shipping_rates, _onCartShippingRatesUpdate(rates, shipping_address)
                    },
                    error: function(XMLHttpRequest, textStatus) {
                        _onError(XMLHttpRequest, textStatus)
                    }
                };
                jQuery.ajax(params)
            },
            _fullMessagesFromErrors = function(errors) {
                var fullMessages = [];
                return jQuery.each(errors, function(attribute, messages) {
                    jQuery.each(messages, function(index, message) {
                        fullMessages.push(attribute + " " + message)
                    })
                }), fullMessages
            },
            _onError = function(XMLHttpRequest, textStatus) {
                jQuery("#estimated-shipping").hide(), jQuery("#estimated-shipping em").empty(), _enableButtons();
                var feedback = "",
                    data = eval("(" + XMLHttpRequest.responseText + ")");
                feedback = data.message ? data.message + "(" + data.status + "): " + data.description : "Error : " + _fullMessagesFromErrors(data).join("; "), "Error : country is not supported." === feedback && (feedback = "We do not ship to this destination."), _render({
                    rates: [],
                    errorFeedback: feedback,
                    success: !1
                }), jQuery("#" + _config.wrapperId).show()
            },
            _onCartShippingRatesUpdate = function(rates, shipping_address) {
                _enableButtons();
                var readable_address = "";
                if (shipping_address.zip && (readable_address += shipping_address.zip + ", "), shipping_address.province && (readable_address += shipping_address.province + ", "), readable_address += shipping_address.country, rates.length) {
                    jQuery("#estimated-shipping em").html("0.00" == rates[0].price ? "FREE" : _formatRate(rates[0].price));
                    for (var i = 0; i < rates.length; i++) rates[i].price = _formatRate(rates[i].price)
                }
                _render({
                    rates: rates,
                    address: readable_address,
                    success: !0
                }), jQuery("#" + _config.wrapperId + ", #estimated-shipping").fadeIn()
            },
            _formatRate = function(cents) {
                function defaultOption(opt, def) {
                    return "undefined" == typeof opt ? def : opt
                }

                function formatWithDelimiters(number, precision, thousands, decimal) {
                    if (precision = defaultOption(precision, 2), thousands = defaultOption(thousands, ","), decimal = defaultOption(decimal, "."), isNaN(number) || null == number) return 0;
                    number = (number / 100).toFixed(precision);
                    var parts = number.split("."),
                        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands),
                        cents = parts[1] ? decimal + parts[1] : "";
                    return dollars + cents
                }
                if ("function" == typeof Shopify.formatMoney) return Shopify.formatMoney(cents, _config.moneyFormat);
                "string" == typeof cents && (cents = cents.replace(".", ""));
                var value = "",
                    placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
                    formatString = _config.moneyFormat;
                switch (formatString.match(placeholderRegex)[1]) {
                    case "amount":
                        value = formatWithDelimiters(cents, 2);
                        break;
                    case "amount_no_decimals":
                        value = formatWithDelimiters(cents, 0);
                        break;
                    case "amount_with_comma_separator":
                        value = formatWithDelimiters(cents, 2, ".", ",");
                        break;
                    case "amount_no_decimals_with_comma_separator":
                        value = formatWithDelimiters(cents, 0, ".", ",")
                }
                return formatString.replace(placeholderRegex, value)
            };
        return _init = function() {
            _config.miniCart || new Shopify.CountryProvinceSelector("address_country", "address_province", {
                hideElement: "address_province_container"
            });
            var countriesSelect = jQuery("#address_country"),
                addressProvinceLabelEl = jQuery("#address_province_label").get(0);
            "undefined" != typeof Countries && (Countries.updateProvinceLabel(countriesSelect.val(), addressProvinceLabelEl), countriesSelect.change(function() {
                Countries.updateProvinceLabel(countriesSelect.val(), addressProvinceLabelEl)
            })), readAddress = function() {
                var shippingAddress = {};
                return _config.miniCart ? (country = $.cookie("user_country"), province = $.cookie("user_province"), zip = $('#address_zip').val(), shippingAddress.zip = zip || "", shippingAddress.country = country || "", shippingAddress.province = province || "") : (shippingAddress.zip = jQuery("#address_zip").val() || "", shippingAddress.country = jQuery("#address_country").val() || "", shippingAddress.province = jQuery("#address_province").val() || ""), shippingAddress
            }, jQuery(".get-rates").click(function() {
                _disableButtons(), jQuery("#" + _config.wrapperId).empty().hide(), _getCartShippingRatesForDestination(readAddress())
            }), _config.customerIsLoggedIn && jQuery(".get-rates:eq(0)").trigger("click"), _config.miniCart && _getCartShippingRatesForDestination(readAddress())
        }, {
            show: function(params) {
                params = params || {}, jQuery.extend(_config, params), jQuery(function() {
                    _init(), _config.callback()
                })
            },
            getConfig: function() {
                return _config
            },
            formatRate: function(cents) {
                return _formatRate(cents)
            }
        }
    }(), "undefined" == typeof Currency) var Currency = {};
Currency.cookie = {
        configuration: {
            expires: 365,
            path: "/",
            domain: "rodengray.com"
        },
        name: "currency",
        write: function(a) {
            $.cookie(this.name, a, this.configuration)
        },
        read: function() {
            return $.cookie(this.name)
        },
        destroy: function() {
            $.cookie(this.name, null, this.configuration)
        }
    }, Currency.money_with_currency_format = {
        USD: "${{amount}} USD",
        EUR: "&euro;{{amount}} EUR",
        GBP: "&pound;{{amount}} GBP",
        CAD: "${{amount}} CAD",
        ARS: "${{amount_with_comma_separator}} ARS",
        AUD: "${{amount}} AUD",
        BBD: "${{amount}} Bds",
        BDT: "Tk {{amount}} BDT",
        BSD: "BS${{amount}} BSD",
        BHD: "{{amount}}0 BHD",
        BRL: "R$ {{amount_with_comma_separator}} BRL",
        BOB: "Bs{{amount_with_comma_separator}} BOB",
        BND: "${{amount}} BND",
        BGN: "{{amount}} Ð»Ð² BGN",
        MMK: "K{{amount}} MMK",
        KYD: "${{amount}} KYD",
        CLP: "${{amount_no_decimals}} CLP",
        CNY: "&#165;{{amount}} CNY",
        COP: "${{amount_with_comma_separator}} COP",
        CRC: "&#8353; {{amount_with_comma_separator}} CRC",
        HRK: "{{amount_with_comma_separator}} kn HRK",
        CZK: "{{amount_with_comma_separator}} K&#269;",
        DKK: "kr.{{amount_with_comma_separator}}",
        DOP: "RD$ {{amount_with_comma_separator}}",
        XCD: "EC${{amount}}",
        EGP: "LE {{amount}} EGP",
        XPF: "{{amount_no_decimals_with_space_separator}}} XPF",
        FJD: "FJ${{amount}}",
        GHS: "GH&#8373;{{amount}}",
        GTQ: "{{amount}} GTQ",
        GYD: "${{amount}} GYD",
        GEL: "{{amount}} GEL",
        HKD: "HK${{amount}}",
        HUF: "{{amount_no_decimals_with_comma_separator}} Ft",
        ISK: "{{amount_no_decimals}} kr ISK",
        INR: "Rs.{{amount}}",
        IDR: "Rp {{amount_with_comma_separator}}",
        NIS: "{{amount}} NIS",
        JMD: "${{amount}} JMD",
        JPY: "&#165;{{amount_no_decimals}} JPY",
        JOD: "{{amount}}0 JOD",
        KZT: "{{amount}} KZT",
        KES: "KSh{{amount}}",
        KWD: "{{amount}}0 KWD",
        LVL: "Ls {{amount}} LVL",
        LTL: "{{amount}} Lt",
        MXN: "$ {{amount}} MXN",
        MYR: "RM{{amount}} MYR",
        MUR: "Rs {{amount}} MUR",
        MDL: "{{amount}} MDL",
        MAD: "Dh {{amount}} MAD",
        MNT: "{{amount_no_decimals}} MNT",
        MZN: "Mt {{amount}} MZN",
        ANG: "{{amount}} NA&fnof;",
        NZD: "${{amount}} NZD",
        NGN: "&#8358;{{amount}} NGN",
        NOK: "kr {{amount_with_comma_separator}} NOK",
        OMR: "{{amount_with_comma_separator}} OMR",
        PKR: "Rs.{{amount}} PKR",
        PYG: "Gs. {{amount_no_decimals_with_comma_separator}} PYG",
        PEN: "S/. {{amount}} PEN",
        PHP: "&#8369;{{amount}} PHP",
        PLN: "{{amount_with_comma_separator}} zl PLN",
        QAR: "QAR {{amount_with_comma_separator}}",
        RON: "{{amount_with_comma_separator}} lei RON",
        RUB: "&#1088;&#1091;&#1073;{{amount_with_comma_separator}} RUB",
        SAR: "{{amount}} SAR",
        RSD: "{{amount}} RSD",
        SCR: "Rs {{amount}} SCR",
        SGD: "${{amount}} SGD",
        SYP: "S&pound;{{amount}} SYP",
        ZAR: "R {{amount}} ZAR",
        KRW: "&#8361;{{amount_no_decimals}} KRW",
        LKR: "Rs {{amount}} LKR",
        SEK: "{{amount_no_decimals}} kr SEK",
        CHF: "SFr. {{amount}} CHF",
        TWD: "${{amount}} TWD",
        THB: "{{amount}} &#xe3f; THB",
        TZS: "{{amount}} TZS",
        TTD: "${{amount}} TTD",
        TRY: "{{amount}}TL",
        UAH: "â‚´{{amount}} UAH",
        AED: "Dhs. {{amount}} AED",
        UYU: "${{amount_with_comma_separator}} UYU",
        VEB: "Bs. {{amount_with_comma_separator}} VEB",
        VND: "{{amount_no_decimals_with_comma_separator}} VND",
        ZMK: "ZMK{{amount_no_decimals_with_comma_separator}}"
    }, Currency.money_format = {
        USD: "${{amount}}",
        EUR: "&euro;{{amount}}",
        GBP: "&pound;{{amount}}",
        CAD: "${{amount}}",
        ARS: "${{amount_with_comma_separator}}",
        AUD: "${{amount}}",
        BBD: "${{amount}}",
        BDT: "Tk {{amount}}",
        BSD: "BS${{amount}}",
        BHD: "{{amount}}0 BHD",
        BRL: "R$ {{amount_with_comma_separator}}",
        BOB: "Bs{{amount_with_comma_separator}}",
        BND: "${{amount}}",
        BGN: "{{amount}} Ð»Ð²",
        MMK: "K{{amount}}",
        KYD: "${{amount}}",
        CLP: "${{amount_no_decimals}}",
        CNY: "&#165;{{amount}}",
        COP: "${{amount_with_comma_separator}}",
        CRC: "&#8353; {{amount_with_comma_separator}}",
        HRK: "{{amount_with_comma_separator}} kn",
        CZK: "{{amount_with_comma_separator}} K&#269;",
        DKK: "{{amount_with_comma_separator}}",
        DOP: "RD$ {{amount_with_comma_separator}}",
        XCD: "${{amount}}",
        EGP: "LE {{amount}}",
        XPF: "{{amount_no_decimals_with_space_separator}}} XPF",
        FJD: "${{amount}}",
        GHS: "GH&#8373;{{amount}}",
        GTQ: "{{amount}}",
        GYD: "${{amount}}",
        GEL: "{{amount}} GEL",
        HKD: "${{amount}}",
        HUF: "{{amount_no_decimals_with_comma_separator}}",
        ISK: "{{amount_no_decimals}} kr",
        INR: "{{amount}}",
        IDR: "{{amount_with_comma_separator}}",
        NIS: "{{amount}} NIS",
        JMD: "${{amount}}",
        JPY: "&#165;{{amount_no_decimals}}",
        JOD: "{{amount}}0 JD",
        KZT: "{{amount}} KZT",
        KES: "KSh{{amount}}",
        KWD: "{{amount}}0 KD",
        LVL: "Ls {{amount}}",
        LTL: "{{amount}} Lt",
        MXN: "$ {{amount}}",
        MYR: "RM{{amount}} MYR",
        MUR: "Rs {{amount}}",
        MDL: "{{amount}} MDL",
        MAD: "{{amount}} dh",
        MNT: "{{amount_no_decimals}} &#8366",
        MZN: "{{amount}} Mt",
        ANG: "&fnof;{{amount}}",
        NZD: "${{amount}}",
        NGN: "&#8358;{{amount}}",
        NOK: "kr {{amount_with_comma_separator}}",
        OMR: "{{amount_with_comma_separator}} OMR",
        PKR: "Rs.{{amount}}",
        PYG: "Gs. {{amount_no_decimals_with_comma_separator}}",
        PEN: "S/. {{amount}}",
        PHP: "&#8369;{{amount}}",
        PLN: "{{amount_with_comma_separator}} zl",
        QAR: "QAR {{amount_with_comma_separator}}",
        RON: "{{amount_with_comma_separator}} lei",
        RUB: "&#1088;&#1091;&#1073;{{amount_with_comma_separator}}",
        SAR: "{{amount}} SR",
        RSD: "{{amount}} RSD",
        SCR: "Rs {{amount}}",
        SGD: "${{amount}}",
        SYP: "S&pound;{{amount}}",
        ZAR: "R {{amount}}",
        KRW: "&#8361;{{amount_no_decimals}}",
        LKR: "Rs {{amount}}",
        SEK: "{{amount_no_decimals}} kr",
        CHF: "SFr. {{amount}}",
        TWD: "${{amount}}",
        THB: "{{amount}} &#xe3f;",
        TZS: "{{amount}} TZS",
        TTD: "${{amount}}",
        TRY: "{{amount}}TL",
        UAH: "â‚´{{amount}}",
        AED: "Dhs. {{amount}}",
        UYU: "${{amount_with_comma_separator}}",
        VEB: "Bs. {{amount_with_comma_separator}}",
        VND: "{{amount_no_decimals_with_comma_separator}}â‚«",
        ZMK: "K{{amount_no_decimals_with_comma_separator}}"
    }, Currency.formatMoney = function(b, f) {
        function c(g) {
            return g.replace(/(\d+)(\d{3}[\.,]?)/, "$1,$2")
        }
        "string" == typeof b && (b = b.replace(".", ""));
        var e = "",
            d = /\{\{\s*(\w+)\s*\}\}/,
            a = f || this.money_format;
        switch (a.match(d)[1]) {
            case "amount":
                e = c(floatToString(b / 100, 2));
                break;
            case "amount_no_decimals":
                e = c(floatToString(b / 100, 0));
                break;
            case "amount_with_comma_separator":
                e = floatToString(b / 100, 2).replace(/\./, ",");
                break;
            case "amount_no_decimals_with_comma_separator":
                e = c(floatToString(b / 100, 0)).replace(/\./, ",")
        }
        return a.replace(d, e)
    }, Currency.currentCurrency = "", Currency.format = "money_with_currency_format", Currency.convertAll = function(c, b, a, d) {
        jQuery(a || "span.money").each(function() {
            if (jQuery(this).attr("data-currency") !== b) {
                if (jQuery(this).attr("data-currency-" + b)) jQuery(this).html(jQuery(this).attr("data-currency-" + b));
                else {
                    var e = 0,
                        f = Currency[d || Currency.format][c] || "{{amount}}",
                        g = Currency[d || Currency.format][b] || "{{amount}}";
                    e = -1 !== f.indexOf("amount_no_decimals") ? Currency.convert(100 * parseInt(jQuery(this).html().replace(/[^0-9]/g, ""), 10), c, b) : Currency.convert(parseInt(jQuery(this).html().replace(/[^0-9]/g, ""), 10), c, b);
                    var h = Currency.formatMoney(e, g);
                    jQuery(this).html(h), jQuery(this).attr("data-currency-" + b, h)
                }
                jQuery(this).attr("data-currency", b)
            }
        }), this.currentCurrency = b, this.cookie.write(b)
    }, ! function(a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a : a(jQuery)
    }(function(a) {
        function b(b) {
            var g = b || window.event,
                h = i.call(arguments, 1),
                j = 0,
                l = 0,
                m = 0,
                n = 0,
                o = 0,
                p = 0;
            if (b = a.event.fix(g), b.type = "mousewheel", "detail" in g && (m = -1 * g.detail), "wheelDelta" in g && (m = g.wheelDelta), "wheelDeltaY" in g && (m = g.wheelDeltaY), "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX), "axis" in g && g.axis === g.HORIZONTAL_AXIS && (l = -1 * m, m = 0), j = 0 === m ? l : m, "deltaY" in g && (m = -1 * g.deltaY, j = m), "deltaX" in g && (l = g.deltaX, 0 === m && (j = -1 * l)), 0 !== m || 0 !== l) {
                if (1 === g.deltaMode) {
                    var q = a.data(this, "mousewheel-line-height");
                    j *= q, m *= q, l *= q
                } else if (2 === g.deltaMode) {
                    var r = a.data(this, "mousewheel-page-height");
                    j *= r, m *= r, l *= r
                }
                if (n = Math.max(Math.abs(m), Math.abs(l)), (!f || f > n) && (f = n, d(g, n) && (f /= 40)), d(g, n) && (j /= 40, l /= 40, m /= 40), j = Math[j >= 1 ? "floor" : "ceil"](j / f), l = Math[l >= 1 ? "floor" : "ceil"](l / f), m = Math[m >= 1 ? "floor" : "ceil"](m / f), k.settings.normalizeOffset && this.getBoundingClientRect) {
                    var s = this.getBoundingClientRect();
                    o = b.clientX - s.left, p = b.clientY - s.top
                }
                return b.deltaX = l, b.deltaY = m, b.deltaFactor = f, b.offsetX = o, b.offsetY = p, b.deltaMode = 0, h.unshift(b, j, l, m), e && clearTimeout(e), e = setTimeout(c, 200), (a.event.dispatch || a.event.handle).apply(this, h)
            }
        }

        function c() {
            f = null
        }

        function d(a, b) {
            return k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0
        }
        var e, f, g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
            h = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
            i = Array.prototype.slice;
        if (a.event.fixHooks)
            for (var j = g.length; j;) a.event.fixHooks[g[--j]] = a.event.mouseHooks;
        var k = a.event.special.mousewheel = {
            version: "3.1.11",
            setup: function() {
                if (this.addEventListener)
                    for (var c = h.length; c;) this.addEventListener(h[--c], b, !1);
                else this.onmousewheel = b;
                a.data(this, "mousewheel-line-height", k.getLineHeight(this)), a.data(this, "mousewheel-page-height", k.getPageHeight(this))
            },
            teardown: function() {
                if (this.removeEventListener)
                    for (var c = h.length; c;) this.removeEventListener(h[--c], b, !1);
                else this.onmousewheel = null;
                a.removeData(this, "mousewheel-line-height"), a.removeData(this, "mousewheel-page-height")
            },
            getLineHeight: function(b) {
                var c = a(b)["offsetParent" in a.fn ? "offsetParent" : "parent"]();
                return c.length || (c = a("body")), parseInt(c.css("fontSize"), 10)
            },
            getPageHeight: function(b) {
                return a(b).height()
            },
            settings: {
                adjustOldDeltas: !0,
                normalizeOffset: !0
            }
        };
        a.fn.extend({
            mousewheel: function(a) {
                return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
            },
            unmousewheel: function(a) {
                return this.unbind("mousewheel", a)
            }
        })
    }),
    function($) {
        function LRUCache(limit) {
            this.size = 0, this.limit = limit, this._keymap = {}
        }
        var queryParser = function(a) {
            var i, p, b = {};
            if ("" === a) return {};
            for (i = 0; i < a.length; i += 1) p = a[i].split("="), 2 === p.length && (b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " ")));
            return b
        };
        $.queryParams = function() {
            return queryParser(window.location.search.substr(1).split("&"))
        }, $.hashParams = function() {
            return queryParser(window.location.hash.substr(1).split("&"))
        };
        var ident = 0;
        window.Swiftype = window.Swiftype || {}, Swiftype.root_url = Swiftype.root_url || "https://api.swiftype.com", Swiftype.pingUrl = function(endpoint, callback) {
            var to = setTimeout(callback, 350),
                img = new Image;
            return img.onload = img.onerror = function() {
                clearTimeout(to), callback()
            }, img.src = endpoint, !1
        }, Swiftype.pingAutoSelection = function(engineKey, docId, value, callback) {
            var params = {
                    t: (new Date).getTime(),
                    engine_key: engineKey,
                    doc_id: docId,
                    prefix: value
                },
                url = Swiftype.root_url + "/api/v1/public/analytics/pas?" + $.param(params);
            Swiftype.pingUrl(url, callback)
        }, Swiftype.findSelectedSection = function() {
            function normalizeText(str) {
                var out = str.replace(/\s+/g, "");
                return out = out.toLowerCase()
            }
            var sectionText = $.hashParams().sts;
            sectionText && (sectionText = normalizeText(sectionText), $("h1, h2, h3, h4, h5, h6").each(function() {
                return $this = $(this), normalizeText($this.text()).indexOf(sectionText) >= 0 ? (this.scrollIntoView(!0), !1) : void 0
            }))
        }, Swiftype.htmlEscape = Swiftype.htmlEscape || function(str) {
            return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }, $.fn.swiftype = function(options) {
            Swiftype.findSelectedSection();
            var options = $.extend({}, $.fn.swiftype.defaults, options);
            return this.each(function() {
                var $this = $(this),
                    config = $.meta ? $.extend({}, options, $this.data()) : options;
                $this.attr("autocomplete", "off"), $this.data("swiftype-config-autocomplete", config), $this.submitted = !1, $this.cache = new LRUCache(10), $this.emptyQueries = [], $this.isEmpty = function(query) {
                    return $.inArray(normalize(query), this.emptyQueries) >= 0
                }, $this.addEmpty = function(query) {
                    $this.emptyQueries.unshift(normalize(query))
                };
                var styles = config.dropdownStylesFunction($this),
                    $swiftypeWidget = $('<div class="swiftype-widget" />'),
                    $listContainer = $("<div />").addClass(config.suggestionListClass).appendTo($swiftypeWidget).css(styles).hide();
                $swiftypeWidget.appendTo(config.autocompleteContainingElement);
                var $list = $("<" + config.suggestionListType + " />").appendTo($listContainer);
                $this.data("swiftype-list", $list), $this.abortCurrent = function() {
                    $this.currentRequest && $this.currentRequest.abort()
                }, $this.showList = function() {
                    handleFunctionParam(config.disableAutocomplete) === !1 && $listContainer.show()
                }, $this.hideList = function(sync) {
                    sync ? $listContainer.hide() : setTimeout(function() {
                        $listContainer.hide()
                    }, 10)
                }, $this.focused = function() {
                    return $this.is(":focus")
                }, $this.submitting = function() {
                    $this.submitted = !0
                }, $this.listResults = function() {
                    return $(config.resultListSelector, $list)
                }, $this.activeResult = function() {
                    return $this.listResults().filter("." + config.activeItemClass).first()
                }, $this.prevResult = function() {
                    var list = $this.listResults(),
                        currentIdx = list.index($this.activeResult()),
                        nextIdx = currentIdx - 1,
                        next = list.eq(nextIdx);
                    $this.listResults().removeClass(config.activeItemClass), nextIdx >= 0 && next.addClass(config.activeItemClass)
                }, $this.nextResult = function() {
                    var list = $this.listResults(),
                        currentIdx = list.index($this.activeResult()),
                        nextIdx = currentIdx + 1,
                        next = list.eq(nextIdx);
                    $this.listResults().removeClass(config.activeItemClass), nextIdx >= 0 && next.addClass(config.activeItemClass)
                }, $this.selectedCallback = function(data) {
                    return function() {
                        var value = $this.val(),
                            callback = function() {
                                config.onComplete(data, value)
                            };
                        Swiftype.pingAutoSelection(config.engineKey, data.id, value, callback)
                    }
                }, $this.registerResult = function($element, data) {
                    $element.data("swiftype-item", data), $element.click($this.selectedCallback(data)).mouseover(function() {
                        $this.listResults().removeClass(config.activeItemClass), $element.addClass(config.activeItemClass)
                    })
                }, $this.getContext = function() {
                    return {
                        config: config,
                        list: $list,
                        registerResult: $this.registerResult
                    }
                };
                var typingDelayPointer, suppressKey = !1;
                $this.lastValue = "", $this.keyup(function(event) {
                    return suppressKey ? void(suppressKey = !1) : void(event.which > 36 && event.which < 41 || 16 == event.which || (config.typingDelay > 0 ? (clearTimeout(typingDelayPointer), typingDelayPointer = setTimeout(function() {
                        processInput($this)
                    }, config.typingDelay)) : processInput($this)))
                }), $this.styleDropdown = function() {
                    $listContainer.css(config.dropdownStylesFunction($this))
                }, $(window).resize(function() {
                    $this.styleDropdown()
                }), $this.keydown(function(event) {
                    $this.styleDropdown();
                    var $active = $this.activeResult();
                    switch (event.which) {
                        case 13:
                            0 !== $active.length && $list.is(":visible") ? (event.preventDefault(), $this.selectedCallback($active.data("swiftype-item"))()) : $this.currentRequest && $this.submitting(), $this.hideList(), suppressKey = !0;
                            break;
                        case 38:
                            event.preventDefault(), 0 === $active.length ? $this.listResults().last().addClass(config.activeItemClass) : $this.prevResult();
                            break;
                        case 40:
                            event.preventDefault(), 0 === $active.length ? $this.listResults().first().addClass(config.activeItemClass) : $active != $this.listResults().last() && $this.nextResult();
                            break;
                        case 27:
                            $this.hideList(), suppressKey = !0;
                            break;
                        default:
                            $this.submitted = !1
                    }
                }), $this.keypress(function(event) {
                    13 == event.which && $this.activeResult().length > 0 && event.preventDefault()
                });
                var mouseDown = !1,
                    blurWait = !1;
                $(document).bind("mousedown.swiftype" + ++ident, function() {
                    mouseDown = !0
                }), $(document).bind("mouseup.swiftype" + ident, function() {
                    mouseDown = !1, blurWait && (blurWait = !1, $this.hideList())
                }), $this.blur(function() {
                    mouseDown ? blurWait = !0 : $this.hideList()
                }), $this.focus(function() {
                    setTimeout(function() {
                        $this.select()
                    }, 10), $this.listResults().filter(":not(." + config.noResultsClass + ")").length > 0 && $this.showList()
                })
            })
        };
        var normalize = function(str) {
                return $.trim(str).toLowerCase()
            },
            callRemote = function($this, term) {
                $this.abortCurrent();
                var params = {},
                    config = $this.data("swiftype-config-autocomplete");
                params.q = term, params.engine_key = config.engineKey, params.search_fields = handleFunctionParam(config.searchFields), params.fetch_fields = handleFunctionParam(config.fetchFields), params.filters = handleFunctionParam(config.filters), params.document_types = handleFunctionParam(config.documentTypes), params.functional_boosts = handleFunctionParam(config.functionalBoosts), params.sort_field = handleFunctionParam(config.sortField), params.sort_direction = handleFunctionParam(config.sortDirection), params.per_page = config.resultLimit;
                var endpoint = Swiftype.root_url + "/api/v1/public/engines/suggest.json";
                $this.currentRequest = $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    url: endpoint,
                    data: params
                }).success(function(data) {
                    var norm = normalize(term);
                    return data.record_count > 0 ? ($this.cache.put(norm, data.records), void processData($this, data.records, term)) : ($this.addEmpty(norm), $this.data("swiftype-list").empty(), void $this.hideList())
                })
            },
            getResults = function($this, term) {
                var norm = normalize(term);
                if ($this.isEmpty(norm)) return $this.data("swiftype-list").empty(), void $this.hideList();
                var cached = $this.cache.get(norm);
                cached ? processData($this, cached, term) : callRemote($this, term)
            },
            processInput = function($this) {
                var term = $this.val();
                if (term !== $this.lastValue) return $this.lastValue = term, "" === $.trim(term) ? ($this.data("swiftype-list").empty(), void $this.hideList()) : void("undefined" != typeof $this.data("swiftype-config-autocomplete").engineKey && getResults($this, term))
            },
            processData = function($this, data) {
                var $list = $this.data("swiftype-list"),
                    config = $this.data("swiftype-config-autocomplete");
                $list.empty(), $this.hideList(!0), config.resultRenderFunction($this.getContext(), data);
                var totalItems = $this.listResults().length;
                (totalItems > 0 && $this.focused() || void 0 !== config.noResultsMessage) && ($this.submitted ? $this.submitted = !1 : $this.showList())
            },
            defaultResultRenderFunction = function(ctx, results) {
                var $list = ctx.list,
                    config = ctx.config;
                $.each(results, function(document_type, items) {
                    $.each(items, function(idx, item) {
                        ctx.registerResult($("<li>" + config.renderFunction(document_type, item) + "</li>").appendTo($list), item)
                    })
                })
            },
            defaultRenderFunction = function(document_type, item) {
                return '<p class="title">' + Swiftype.htmlEscape(item.title) + "</p>"
            },
            defaultOnComplete = function(item) {
                window.location = item.url
            },
            defaultDropdownStylesFunction = function($this) {
                var config = $this.data("swiftype-config-autocomplete"),
                    $attachEl = config.attachTo ? $(config.attachTo) : $this,
                    offset = $attachEl.offset(),
                    styles = {
                        position: "absolute",
                        "z-index": 9999,
                        top: offset.top + $attachEl.outerHeight() + 1,
                        left: offset.left
                    };
                return config.setWidth && (styles.width = $attachEl.outerWidth() - 2), styles
            },
            handleFunctionParam = function(field) {
                if (void 0 !== field) {
                    var evald = field;
                    return "function" == typeof evald && (evald = evald.call()), evald
                }
                return void 0
            };
        LRUCache.prototype.put = function(key, value) {
            var entry = {
                key: key,
                value: value
            };
            return this._keymap[key] = entry, this.tail ? (this.tail.newer = entry, entry.older = this.tail) : this.head = entry, this.tail = entry, this.size === this.limit ? this.shift() : void this.size++
        }, LRUCache.prototype.shift = function() {
            var entry = this.head;
            return entry && (this.head.newer ? (this.head = this.head.newer, this.head.older = void 0) : this.head = void 0, entry.newer = entry.older = void 0, delete this._keymap[entry.key]), entry
        }, LRUCache.prototype.get = function(key, returnEntry) {
            var entry = this._keymap[key];
            if (void 0 !== entry) return entry === this.tail ? entry.value : (entry.newer && (entry === this.head && (this.head = entry.newer), entry.newer.older = entry.older), entry.older && (entry.older.newer = entry.newer), entry.newer = void 0, entry.older = this.tail, this.tail && (this.tail.newer = entry), this.tail = entry, returnEntry ? entry : entry.value)
        }, LRUCache.prototype.remove = function(key) {
            var entry = this._keymap[key];
            if (entry) return delete this._keymap[entry.key], entry.newer && entry.older ? (entry.older.newer = entry.newer, entry.newer.older = entry.older) : entry.newer ? (entry.newer.older = void 0, this.head = entry.newer) : entry.older ? (entry.older.newer = void 0, this.tail = entry.older) : this.head = this.tail = void 0, this.size--, entry.value
        }, LRUCache.prototype.clear = function() {
            this.head = this.tail = void 0, this.size = 0, this._keymap = {}
        }, LRUCache.prototype.keys = "function" == typeof Object.keys ? function() {
            return Object.keys(this._keymap)
        } : function() {
            var keys = [];
            for (var k in this._keymap) keys.push(k);
            return keys
        }, $.fn.swiftype.defaults = {
            activeItemClass: "active",
            attachTo: void 0,
            documentTypes: void 0,
            filters: void 0,
            engineKey: void 0,
            searchFields: void 0,
            functionalBoosts: void 0,
            sortField: void 0,
            sortDirection: void 0,
            fetchFields: void 0,
            noResultsClass: "noResults",
            noResultsMessage: void 0,
            onComplete: defaultOnComplete,
            resultRenderFunction: defaultResultRenderFunction,
            renderFunction: defaultRenderFunction,
            dropdownStylesFunction: defaultDropdownStylesFunction,
            resultLimit: void 0,
            suggestionListType: "ul",
            suggestionListClass: "autocomplete",
            resultListSelector: "li",
            setWidth: !0,
            typingDelay: 80,
            disableAutocomplete: !1,
            autocompleteContainingElement: "body"
        }
    }(jQuery),
    function($) {
        function htmlEscape(str) {
            return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }
        var queryParser = function(a) {
            var i, p, b = {};
            if ("" === a) return {};
            for (i = 0; i < a.length; i += 1) p = a[i].split("="), 2 === p.length && (b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " ")));
            return b
        };
        $.queryParams = function() {
            return queryParser(window.location.search.substr(1).split("&"))
        }, $.hashParams = function() {
            return queryParser(window.location.hash.substr(1).split("&"))
        }, window.Swiftype = window.Swiftype || {}, Swiftype.root_url = Swiftype.root_url || "https://api.swiftype.com", Swiftype.pingUrl = function(endpoint, callback) {
            var to = setTimeout(callback, 350),
                img = new Image;
            return img.onload = img.onerror = function() {
                clearTimeout(to), callback()
            }, img.src = endpoint, !1
        }, Swiftype.pingSearchResultClick = function(engineKey, docId, callback) {
            var params = {
                    t: (new Date).getTime(),
                    engine_key: engineKey,
                    doc_id: docId,
                    q: Swiftype.currentQuery
                },
                url = Swiftype.root_url + "/api/v1/public/analytics/pc?" + $.param(params);
            Swiftype.pingUrl(url, callback)
        }, $.fn.swiftypeSearch = function(options) {
            var options = $.extend({}, $.fn.swiftypeSearch.defaults, options);
            return this.each(function() {
                var $this = $(this),
                    config = $.meta ? $.extend({}, options, $this.data()) : options;
                $this.data("swiftype-config-search", config), $this.selectedCallback = function(data) {
                    return function(e) {
                        var $el = $(this);
                        e.preventDefault(), Swiftype.pingSearchResultClick(config.engineKey, data.id, function() {
                            window.location = $el.attr("href")
                        })
                    }
                }, $this.registerResult = function($element, data) {
                    $element.data("swiftype-item", data), $("a", $element).click($this.selectedCallback(data))
                }, $this.getContentCache = function() {
                    return $("#" + contentCacheId)
                };
                var $resultContainer = $(config.resultContainingElement),
                    initialContentOfResultContainer = $resultContainer.html(),
                    contentCacheId = "st-content-cache",
                    $contentCache = $this.getContentCache(),
                    setSearchHash = function(query, page) {
                        location.hash = "stq=" + encodeURIComponent(query) + "&stp=" + page
                    },
                    submitSearch = function(query, options) {
                        function handleFunctionParam(field) {
                            if (void 0 !== field) {
                                var evald = field;
                                return "function" == typeof evald && (evald = evald.call()), evald
                            }
                            return void 0
                        }
                        options = $.extend({
                            page: 1
                        }, options);
                        var params = {};
                        $contentCache.length || ($resultContainer.after("<div id='" + contentCacheId + "' style='display: none;'></div>"), $contentCache.html(initialContentOfResultContainer).hide()), config.loadingFunction(query, $resultContainer), Swiftype.currentQuery = query, params.q = query, params.engine_key = config.engineKey, params.page = options.page, params.per_page = config.perPage, params.search_fields = handleFunctionParam(config.searchFields), params.fetch_fields = handleFunctionParam(config.fetchFields), params.facets = handleFunctionParam(config.facets), params.filters = handleFunctionParam(config.filters), params.document_types = handleFunctionParam(config.documentTypes), params.functional_boosts = handleFunctionParam(config.functionalBoosts), params.sort_field = handleFunctionParam(config.sortField), params.sort_direction = handleFunctionParam(config.sortDirection), params.spelling = handleFunctionParam(config.spelling), $.getJSON(Swiftype.root_url + "/api/v1/public/engines/search.json?callback=?", params).success(renderSearchResults)
                    };
                $(window).hashchange(function() {
                    var params = $.hashParams();
                    if (params.stq) submitSearch(params.stq, {
                        page: params.stp
                    });
                    else {
                        var $contentCache = $this.getContentCache();
                        $contentCache.length && ($resultContainer.html($contentCache.html()), $contentCache.remove())
                    }
                });
                var $containingForm = $this.parents("form");
                $containingForm && $containingForm.bind("submit", function(e) {
                    e.preventDefault();
                    var searchQuery = $this.val();
                    setSearchHash(searchQuery, 1)
                }), $(document).on("click", "[data-hash][data-page]", function(e) {
                    e.preventDefault();
                    var $this = $(this);
                    setSearchHash($.hashParams().stq, $this.data("page"))
                }), $(document).on("click", "[data-hash][data-spelling-suggestion]", function(e) {
                    e.preventDefault();
                    var $this = $(this);
                    setSearchHash($this.data("spelling-suggestion"), 1)
                });
                var renderSearchResults = function(data) {
                    "function" == typeof config.preRenderFunction && config.preRenderFunction.call($this, data), config.renderResultsFunction($this.getContext(), data), "function" == typeof config.postRenderFunction && config.postRenderFunction.call($this, data)
                };
                $this.getContext = function() {
                    return {
                        config: config,
                        resultContainer: $resultContainer,
                        registerResult: $this.registerResult
                    }
                }, $(window).hashchange()
            })
        };
        var renderPagination = function(ctx, resultInfo) {
                var maxPagesType, maxPages = -1,
                    config = ctx.config;
                $.each(resultInfo, function(documentType, typeInfo) {
                    typeInfo.num_pages > maxPages && (maxPagesType = documentType, maxPages = typeInfo.num_pages)
                });
                var currentPage = resultInfo[maxPagesType].current_page,
                    totalPages = resultInfo[maxPagesType].num_pages;
                $(config.renderPaginationForType(maxPagesType, currentPage, totalPages)).appendTo(ctx.resultContainer)
            },
            defaultRenderResultsFunction = function(ctx, data) {
                var $resultContainer = ctx.resultContainer,
                    config = ctx.config;
                $resultContainer.html(""), $.each(data.records, function(documentType, items) {
                    $.each(items, function(idx, item) {
                        ctx.registerResult($(config.renderFunction(documentType, item)).appendTo($resultContainer), item)
                    })
                }), renderPagination(ctx, data.info)
            },
            defaultRenderFunction = function(document_type, item) {
                return '<div class="st-result"><h3 class="title"><a href="' + item.url + '" class="st-search-result-link">' + htmlEscape(item.title) + "</a></h3></div>"
            },
            defaultLoadingFunction = function(query, $resultContainer) {
                $resultContainer.html('<p class="st-loading-message">loading...</p>')
            },
            defaultPostRenderFunction = function(data) {
                var totalResultCount = 0,
                    $resultContainer = this.getContext().resultContainer,
                    spellingSuggestion = null;
                data.info && $.each(data.info, function(index, value) {
                    totalResultCount += value.total_result_count, value.spelling_suggestion && (spellingSuggestion = value.spelling_suggestion.text)
                }), 0 === totalResultCount && $resultContainer.html("<div id='st-no-results' class='st-no-results'>No results found.</div>"), null !== spellingSuggestion && $resultContainer.append('<div class="st-spelling-suggestion">Did you mean <a href="#" data-hash="true" data-spelling-suggestion="' + spellingSuggestion + '">' + spellingSuggestion + "</a>?</div>")
            },
            defaultRenderPaginationForType = function(type, currentPage, totalPages) {
                var previousPage, nextPage, pages = '<div class="st-page">';
                return 1 != currentPage && (previousPage = currentPage - 1, pages = pages + '<a href="#" class="st-prev" data-hash="true" data-page="' + previousPage + '"><span class="icon-arrow-left"></span> previous</a>'), totalPages > currentPage && (nextPage = currentPage + 1, pages = pages + '<a href="#" class="st-next" data-hash="true" data-page="' + nextPage + '">next <span class="icon-arrow-right"></span></a>'), pages += "</div>"
            };
        $.fn.swiftypeSearch.defaults = {
            attachTo: void 0,
            documentTypes: void 0,
            facets: void 0,
            filters: void 0,
            engineKey: void 0,
            searchFields: void 0,
            functionalBoosts: void 0,
            sortField: void 0,
            sortDirection: void 0,
            fetchFields: void 0,
            preRenderFunction: void 0,
            postRenderFunction: defaultPostRenderFunction,
            loadingFunction: defaultLoadingFunction,
            renderResultsFunction: defaultRenderResultsFunction,
            renderFunction: defaultRenderFunction,
            renderPaginationForType: defaultRenderPaginationForType,
            perPage: 10,
            spelling: "strict"
        }
    }(jQuery),
    function(o) {
        var t = {
            url: !1,
            callback: !1,
            target: !1,
            duration: 120,
            on: "mouseover",
            touch: !0,
            onZoomIn: !1,
            onZoomOut: !1,
            magnify: 1
        };
        o.zoom = function(t, n, e, i) {
            var u, c, a, m, l, r, s, f = o(t).css("position"),
                h = o(n);
            return t.style.position = /(absolute|fixed)/.test(f) ? f : "relative", t.style.overflow = "hidden", e.style.width = e.style.height = "", o(e).addClass("zoomImg").css({
                position: "absolute",
                top: 0,
                left: 0,
                opacity: 0,
                width: e.width * i,
                height: e.height * i,
                border: "none",
                maxWidth: "none",
                maxHeight: "none"
            }).appendTo(t), {
                init: function() {
                    c = o(t).outerWidth(), u = o(t).outerHeight(), n === t ? (m = c, a = u) : (m = h.outerWidth(), a = h.outerHeight()), l = (e.width - c) / m, r = (e.height - u) / a, s = h.offset()
                },
                move: function(o) {
                    var t = o.pageX - s.left,
                        n = o.pageY - s.top;
                    n = Math.max(Math.min(n, a), 0), t = Math.max(Math.min(t, m), 0), e.style.left = t * -l + "px", e.style.top = n * -r + "px"
                }
            }
        }, o.fn.zoom = function(n) {
            return this.each(function() {
                var e, i = o.extend({}, t, n || {}),
                    u = i.target || this,
                    c = this,
                    a = o(c),
                    m = document.createElement("img"),
                    l = o(m),
                    r = "mousemove.zoom",
                    s = !1,
                    f = !1;
                (i.url || (e = a.find("img"), e[0] && (i.url = e.data("src") || e.attr("src")), i.url)) && (function() {
                    var o = u.style.position,
                        t = u.style.overflow;
                    a.one("zoom.destroy", function() {
                        a.off(".zoom"), u.style.position = o, u.style.overflow = t, l.remove()
                    })
                }(), m.onload = function() {
                    function t(t) {
                        e.init(), e.move(t), l.stop().fadeTo(o.support.opacity ? i.duration : 0, 1, o.isFunction(i.onZoomIn) ? i.onZoomIn.call(m) : !1)
                    }

                    function n() {
                        l.stop().fadeTo(i.duration, 0, o.isFunction(i.onZoomOut) ? i.onZoomOut.call(m) : !1)
                    }
                    var e = o.zoom(u, c, m, i.magnify);
                    "grab" === i.on ? a.on("mousedown.zoom", function(i) {
                        1 === i.which && (o(document).one("mouseup.zoom", function() {
                            n(), o(document).off(r, e.move)
                        }), t(i), o(document).on(r, e.move), i.preventDefault())
                    }) : "click" === i.on ? a.on("click.zoom", function(i) {
                        return s ? void 0 : (s = !0, t(i), o(document).on(r, e.move), o(document).one("click.zoom", function() {
                            n(), s = !1, o(document).off(r, e.move)
                        }), !1)
                    }) : "toggle" === i.on ? a.on("click.zoom", function(o) {
                        s ? n() : t(o), s = !s
                    }) : "mouseover" === i.on && (e.init(), a.on("mouseenter.zoom", t).on("mouseleave.zoom", n).on(r, e.move)), i.touch && a.on("touchstart.zoom", function(o) {
                        o.preventDefault(), f ? (f = !1, n()) : (f = !0, t(o.originalEvent.touches[0] || o.originalEvent.changedTouches[0]))
                    }).on("touchmove.zoom", function(o) {
                        o.preventDefault(), e.move(o.originalEvent.touches[0] || o.originalEvent.changedTouches[0])
                    }), o.isFunction(i.callback) && i.callback.call(m)
                }, m.src = i.url)
            })
        }, o.fn.zoom.defaults = t
    }(window.jQuery),
    function(e) {
        "use strict";
        "function" == typeof define && define.amd ? define(["jquery"], e) : e("object" == typeof exports ? require("jquery") : jQuery)
    }(function(e) {
        "use strict";
        var t = {
                wheelSpeed: 10,
                wheelPropagation: !1,
                minScrollbarLength: null,
                useBothWheelAxes: !1,
                useKeyboard: !0,
                suppressScrollX: !1,
                suppressScrollY: !1,
                scrollXMarginOffset: 0,
                scrollYMarginOffset: 0,
                includePadding: !1
            },
            o = function() {
                var e = 0;
                return function() {
                    var t = e;
                    return e += 1, ".perfect-scrollbar-" + t
                }
            }();
        e.fn.perfectScrollbar = function(n, r) {
            return this.each(function() {
                var l = e.extend(!0, {}, t),
                    s = e(this);
                if ("object" == typeof n ? e.extend(!0, l, n) : r = n, "update" === r) return s.data("perfect-scrollbar-update") && s.data("perfect-scrollbar-update")(), s;
                if ("destroy" === r) return s.data("perfect-scrollbar-destroy") && s.data("perfect-scrollbar-destroy")(), s;
                if (s.data("perfect-scrollbar")) return s.data("perfect-scrollbar");
                s.addClass("ps-container");
                var a, i, c, u, d, p, f, h, v, g, b = e("<div class='ps-scrollbar-x-rail'></div>").appendTo(s),
                    m = e("<div class='ps-scrollbar-y-rail'></div>").appendTo(s),
                    w = e("<div class='ps-scrollbar-x'></div>").appendTo(b),
                    T = e("<div class='ps-scrollbar-y'></div>").appendTo(m),
                    L = parseInt(b.css("bottom"), 10),
                    y = L === L,
                    S = y ? null : parseInt(b.css("top"), 10),
                    I = parseInt(m.css("right"), 10),
                    x = I === I,
                    M = x ? null : parseInt(m.css("left"), 10),
                    P = "rtl" === s.css("direction"),
                    X = o(),
                    D = function(e, t) {
                        var o = e + t,
                            n = u - v;
                        g = 0 > o ? 0 : o > n ? n : o;
                        var r = parseInt(g * (p - u) / (u - v), 10);
                        s.scrollTop(r), b.css(y ? {
                            bottom: L - r
                        } : {
                            top: S + r
                        })
                    },
                    Y = function(e, t) {
                        var o = e + t,
                            n = c - f;
                        h = 0 > o ? 0 : o > n ? n : o;
                        var r = parseInt(h * (d - c) / (c - f), 10);
                        s.scrollLeft(r), m.css(x ? {
                            right: I - r
                        } : {
                            left: M + r
                        })
                    },
                    k = function(e) {
                        return l.minScrollbarLength && (e = Math.max(e, l.minScrollbarLength)), e
                    },
                    C = function() {
                        var e = {
                            width: c,
                            display: a ? "inherit" : "none"
                        };
                        e.left = P ? s.scrollLeft() + c - d : s.scrollLeft(), y ? e.bottom = L - s.scrollTop() : e.top = S + s.scrollTop(), b.css(e);
                        var t = {
                            top: s.scrollTop(),
                            height: u,
                            display: i ? "inherit" : "none"
                        };
                        x ? t.right = P ? d - s.scrollLeft() - I - T.outerWidth() : I - s.scrollLeft() : t.left = P ? s.scrollLeft() + 2 * c - d - M - T.outerWidth() : M + s.scrollLeft(), m.css(t), w.css({
                            left: h,
                            width: f
                        }), T.css({
                            top: g,
                            height: v
                        })
                    },
                    j = function() {
                        c = l.includePadding ? s.innerWidth() : s.width(), u = l.includePadding ? s.innerHeight() : s.height(), d = s.prop("scrollWidth"), p = s.prop("scrollHeight"), !l.suppressScrollX && d > c + l.scrollXMarginOffset ? (a = !0, f = k(parseInt(c * c / d, 10)), h = parseInt(s.scrollLeft() * (c - f) / (d - c), 10)) : (a = !1, f = 0, h = 0, s.scrollLeft(0)), !l.suppressScrollY && p > u + l.scrollYMarginOffset ? (i = !0, v = k(parseInt(u * u / p, 10)), g = parseInt(s.scrollTop() * (u - v) / (p - u), 10)) : (i = !1, v = 0, g = 0, s.scrollTop(0)), g >= u - v && (g = u - v), h >= c - f && (h = c - f), C()
                    },
                    O = function() {
                        var t, o;
                        w.bind("mousedown" + X, function(e) {
                            o = e.pageX, t = w.position().left, b.addClass("in-scrolling"), e.stopPropagation(), e.preventDefault()
                        }), e(document).bind("mousemove" + X, function(e) {
                            b.hasClass("in-scrolling") && (Y(t, e.pageX - o), e.stopPropagation(), e.preventDefault())
                        }), e(document).bind("mouseup" + X, function() {
                            b.hasClass("in-scrolling") && b.removeClass("in-scrolling")
                        }), t = o = null
                    },
                    W = function() {
                        var t, o;
                        T.bind("mousedown" + X, function(e) {
                            o = e.pageY, t = T.position().top, m.addClass("in-scrolling"), e.stopPropagation(), e.preventDefault()
                        }), e(document).bind("mousemove" + X, function(e) {
                            m.hasClass("in-scrolling") && (D(t, e.pageY - o), e.stopPropagation(), e.preventDefault())
                        }), e(document).bind("mouseup" + X, function() {
                            m.hasClass("in-scrolling") && m.removeClass("in-scrolling")
                        }), t = o = null
                    },
                    E = function(e, t) {
                        var o = s.scrollTop();
                        if (0 === e) {
                            if (!i) return !1;
                            if (0 === o && t > 0 || o >= p - u && 0 > t) return !l.wheelPropagation
                        }
                        var n = s.scrollLeft();
                        if (0 === t) {
                            if (!a) return !1;
                            if (0 === n && 0 > e || n >= d - c && e > 0) return !l.wheelPropagation
                        }
                        return !0
                    },
                    H = function() {
                        l.wheelSpeed /= 10;
                        var e = !1;
                        s.bind("mousewheel" + X, function(t, o, n, r) {
                            var c = t.deltaX * t.deltaFactor || n,
                                u = t.deltaY * t.deltaFactor || r;
                            e = !1, l.useBothWheelAxes ? i && !a ? (s.scrollTop(u ? s.scrollTop() - u * l.wheelSpeed : s.scrollTop() + c * l.wheelSpeed), e = !0) : a && !i && (s.scrollLeft(c ? s.scrollLeft() + c * l.wheelSpeed : s.scrollLeft() - u * l.wheelSpeed), e = !0) : (s.scrollTop(s.scrollTop() - u * l.wheelSpeed), s.scrollLeft(s.scrollLeft() + c * l.wheelSpeed)), j(), e = e || E(c, u), e && (t.stopPropagation(), t.preventDefault())
                        }), s.bind("MozMousePixelScroll" + X, function(t) {
                            e && t.preventDefault()
                        })
                    },
                    A = function() {
                        var t = !1;
                        s.bind("mouseenter" + X, function() {
                            t = !0
                        }), s.bind("mouseleave" + X, function() {
                            t = !1
                        });
                        var o = !1;
                        e(document).bind("keydown" + X, function(n) {
                            if (t && !e(document.activeElement).is(":input,[contenteditable]")) {
                                var r = 0,
                                    l = 0;
                                switch (n.which) {
                                    case 37:
                                        r = -30;
                                        break;
                                    case 38:
                                        l = 30;
                                        break;
                                    case 39:
                                        r = 30;
                                        break;
                                    case 40:
                                        l = -30;
                                        break;
                                    case 33:
                                        l = 90;
                                        break;
                                    case 32:
                                    case 34:
                                        l = -90;
                                        break;
                                    case 35:
                                        l = -u;
                                        break;
                                    case 36:
                                        l = u;
                                        break;
                                    default:
                                        return
                                }
                                s.scrollTop(s.scrollTop() - l), s.scrollLeft(s.scrollLeft() + r), o = E(r, l), o && n.preventDefault()
                            }
                        })
                    },
                    q = function() {
                        var e = function(e) {
                            e.stopPropagation()
                        };
                        T.bind("click" + X, e), m.bind("click" + X, function(e) {
                            var t = parseInt(v / 2, 10),
                                o = e.pageY - m.offset().top - t,
                                n = u - v,
                                r = o / n;
                            0 > r ? r = 0 : r > 1 && (r = 1), s.scrollTop((p - u) * r)
                        }), w.bind("click" + X, e), b.bind("click" + X, function(e) {
                            var t = parseInt(f / 2, 10),
                                o = e.pageX - b.offset().left - t,
                                n = c - f,
                                r = o / n;
                            0 > r ? r = 0 : r > 1 && (r = 1), s.scrollLeft((d - c) * r)
                        })
                    },
                    F = function() {
                        var t = function(e, t) {
                                s.scrollTop(s.scrollTop() - t), s.scrollLeft(s.scrollLeft() - e), j()
                            },
                            o = {},
                            n = 0,
                            r = {},
                            l = null,
                            a = !1;
                        e(window).bind("touchstart" + X, function() {
                            a = !0
                        }), e(window).bind("touchend" + X, function() {
                            a = !1
                        }), s.bind("touchstart" + X, function(e) {
                            var t = e.originalEvent.targetTouches[0];
                            o.pageX = t.pageX, o.pageY = t.pageY, n = (new Date).getTime(), null !== l && clearInterval(l), e.stopPropagation()
                        }), s.bind("touchmove" + X, function(e) {
                            if (!a && 1 === e.originalEvent.targetTouches.length) {
                                var l = e.originalEvent.targetTouches[0],
                                    s = {};
                                s.pageX = l.pageX, s.pageY = l.pageY;
                                var i = s.pageX - o.pageX,
                                    c = s.pageY - o.pageY;
                                t(i, c), o = s;
                                var u = (new Date).getTime(),
                                    d = u - n;
                                d > 0 && (r.x = i / d, r.y = c / d, n = u), e.preventDefault()
                            }
                        }), s.bind("touchend" + X, function() {
                            clearInterval(l), l = setInterval(function() {
                                return .01 > Math.abs(r.x) && .01 > Math.abs(r.y) ? void clearInterval(l) : (t(30 * r.x, 30 * r.y), r.x *= .8, void(r.y *= .8))
                            }, 10)
                        })
                    },
                    z = function() {
                        s.bind("scroll" + X, function() {
                            j()
                        })
                    },
                    B = function() {
                        s.unbind(X), e(window).unbind(X), e(document).unbind(X), s.data("perfect-scrollbar", null), s.data("perfect-scrollbar-update", null), s.data("perfect-scrollbar-destroy", null), w.remove(), T.remove(), b.remove(), m.remove(), b = m = w = T = a = i = c = u = d = p = f = h = L = y = S = v = g = I = x = M = P = X = null
                    },
                    K = function(t) {
                        s.addClass("ie").addClass("ie" + t);
                        var o = function() {
                                var t = function() {
                                        e(this).addClass("hover")
                                    },
                                    o = function() {
                                        e(this).removeClass("hover")
                                    };
                                s.bind("mouseenter" + X, t).bind("mouseleave" + X, o), b.bind("mouseenter" + X, t).bind("mouseleave" + X, o), m.bind("mouseenter" + X, t).bind("mouseleave" + X, o), w.bind("mouseenter" + X, t).bind("mouseleave" + X, o), T.bind("mouseenter" + X, t).bind("mouseleave" + X, o)
                            },
                            n = function() {
                                C = function() {
                                    var e = {
                                        left: h + s.scrollLeft(),
                                        width: f
                                    };
                                    y ? e.bottom = L : e.top = S, w.css(e);
                                    var t = {
                                        top: g + s.scrollTop(),
                                        height: v
                                    };
                                    x ? t.right = I : t.left = M, T.css(t), w.hide().show(), T.hide().show()
                                }
                            };
                        6 === t && (o(), n())
                    },
                    Q = "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch,
                    N = function() {
                        var e = navigator.userAgent.toLowerCase().match(/(msie) ([\w.]+)/);
                        e && "msie" === e[1] && K(parseInt(e[2], 10)), j(), z(), O(), W(), q(), Q && F(), s.mousewheel && H(), l.useKeyboard && A(), s.data("perfect-scrollbar", s), s.data("perfect-scrollbar-update", j), s.data("perfect-scrollbar-destroy", B)
                    };
                return N(), s
            })
        }
    }),
    function(e) {
        "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? module.exports = e : e(jQuery)
    }(function(e) {
        function t(t) {
            var s = t || window.event,
                a = i.call(arguments, 1),
                c = 0,
                u = 0,
                d = 0,
                p = 0;
            if (t = e.event.fix(s), t.type = "mousewheel", "detail" in s && (d = -1 * s.detail), "wheelDelta" in s && (d = s.wheelDelta), "wheelDeltaY" in s && (d = s.wheelDeltaY), "wheelDeltaX" in s && (u = -1 * s.wheelDeltaX), "axis" in s && s.axis === s.HORIZONTAL_AXIS && (u = -1 * d, d = 0), c = 0 === d ? u : d, "deltaY" in s && (d = -1 * s.deltaY, c = d), "deltaX" in s && (u = s.deltaX, 0 === d && (c = -1 * u)), 0 !== d || 0 !== u) {
                if (1 === s.deltaMode) {
                    var f = e.data(this, "mousewheel-line-height");
                    c *= f, d *= f, u *= f
                } else if (2 === s.deltaMode) {
                    var h = e.data(this, "mousewheel-page-height");
                    c *= h, d *= h, u *= h
                }
                return p = Math.max(Math.abs(d), Math.abs(u)), (!l || l > p) && (l = p, n(s, p) && (l /= 40)), n(s, p) && (c /= 40, u /= 40, d /= 40), c = Math[c >= 1 ? "floor" : "ceil"](c / l), u = Math[u >= 1 ? "floor" : "ceil"](u / l), d = Math[d >= 1 ? "floor" : "ceil"](d / l), t.deltaX = u, t.deltaY = d, t.deltaFactor = l, t.deltaMode = 0, a.unshift(t, c, u, d), r && clearTimeout(r), r = setTimeout(o, 200), (e.event.dispatch || e.event.handle).apply(this, a)
            }
        }

        function o() {
            l = null
        }

        function n(e, t) {
            return u.settings.adjustOldDeltas && "mousewheel" === e.type && 0 === t % 120
        }
        var r, l, s = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
            a = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
            i = Array.prototype.slice;
        if (e.event.fixHooks)
            for (var c = s.length; c;) e.event.fixHooks[s[--c]] = e.event.mouseHooks;
        var u = e.event.special.mousewheel = {
            version: "3.1.9",
            setup: function() {
                if (this.addEventListener)
                    for (var o = a.length; o;) this.addEventListener(a[--o], t, !1);
                else this.onmousewheel = t;
                e.data(this, "mousewheel-line-height", u.getLineHeight(this)), e.data(this, "mousewheel-page-height", u.getPageHeight(this))
            },
            teardown: function() {
                if (this.removeEventListener)
                    for (var e = a.length; e;) this.removeEventListener(a[--e], t, !1);
                else this.onmousewheel = null
            },
            getLineHeight: function(t) {
                return parseInt(e(t)["offsetParent" in e.fn ? "offsetParent" : "parent"]().css("fontSize"), 10)
            },
            getPageHeight: function(t) {
                return e(t).height()
            },
            settings: {
                adjustOldDeltas: !0
            }
        };
        e.fn.extend({
            mousewheel: function(e) {
                return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
            },
            unmousewheel: function(e) {
                return this.unbind("mousewheel", e)
            }
        })
    }), (window.jQuery || window.Zepto) && ! function($) {
        $.fn.Swipe = function(params) {
            return this.each(function() {
                $(this).data("Swipe", new Swipe($(this)[0], params))
            })
        }
    }(window.jQuery || window.Zepto);
var correctedViewportW = function(win, docElem) {
        var mM = win.matchMedia || win.msMatchMedia,
            client = docElem.clientWidth,
            inner = win.innerWidth;
        return mM && inner > client && !0 === mM("(min-width:" + inner + "px)").matches ? function() {
            return win.innerWidth
        } : function() {
            return docElem.clientWidth
        }
    }(window, document.documentElement),
    viewWidth = correctedViewportW();
! function($) {
    $.QueryString = function(a) {
        if ("" === a) return {};
        for (var b = {}, i = 0; i < a.length; ++i) {
            var p = a[i].split("=");
            2 == p.length && (b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " ")))
        }
        return b
    }(window.location.search.substr(1).split("&"))
}(jQuery),
function(factory) {
    "function" == typeof define && define.amd ? define(["jquery"], factory) : factory("object" == typeof exports ? require("jquery") : jQuery)
}(function($) {
    function encode(s) {
        return config.raw ? s : encodeURIComponent(s)
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s)
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value))
    }

    function parseCookieValue(s) {
        0 === s.indexOf('"') && (s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
        try {
            return s = decodeURIComponent(s.replace(pluses, " ")), config.json ? JSON.parse(s) : s
        } catch (e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value
    }
    var pluses = /\+/g,
        config = $.cookie = function(key, value, options) {
            if (void 0 !== value && !$.isFunction(value)) {
                if (options = $.extend({}, config.defaults, options), "number" == typeof options.expires) {
                    var days = options.expires,
                        t = options.expires = new Date;
                    t.setTime(+t + 864e5 * days)
                }
                return document.cookie = [encode(key), "=", stringifyCookieValue(value), options.expires ? "; expires=" + options.expires.toUTCString() : "", options.path ? "; path=" + options.path : "", options.domain ? "; domain=" + options.domain : "", options.secure ? "; secure" : ""].join("")
            }
            for (var result = key ? void 0 : {}, cookies = document.cookie ? document.cookie.split("; ") : [], i = 0, l = cookies.length; l > i; i++) {
                var parts = cookies[i].split("="),
                    name = decode(parts.shift()),
                    cookie = parts.join("=");
                if (key && key === name) {
                    result = read(cookie, value);
                    break
                }
                key || void 0 === (cookie = read(cookie)) || (result[name] = cookie)
            }
            return result
        };
    config.defaults = {}, $.removeCookie = function(key, options) {
        return void 0 === $.cookie(key) ? !1 : ($.cookie(key, "", $.extend({}, options, {
            expires: -1
        })), !$.cookie(key))
    }
}),
function(window, document) {
    var trim = function(str) {
            return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "")
        },
        hasClass = function(el, cn) {
            return -1 !== (" " + el.className + " ").indexOf(" " + cn + " ")
        },
        addClass = function(el, cn) {
            hasClass(el, cn) || (el.className = "" === el.className ? cn : el.className + " " + cn)
        },
        removeClass = function(el, cn) {
            el.className = trim((" " + el.className + " ").replace(" " + cn + " ", " "))
        },
        doc = document.documentElement,
        transition_prop = (window.Modernizr.prefixed("transform"), window.Modernizr.prefixed("transition")),
        transition_end = function() {
            var props = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd otransitionend",
                msTransition: "MSTransitionEnd",
                transition: "transitionend"
            };
            return props.hasOwnProperty(transition_prop) ? props[transition_prop] : !1
        }();
    window.App = function() {
        var _init = !1,
            app = {},
            inner = document.getElementById("container"),
            nav_open = !1,
            nav_class = "js-nav";
        return app.init = function() {
            if (!_init) {
                _init = !0;
                var closeNavEnd = function(e) {
                    e && e.target === inner && document.removeEventListener(transition_end, closeNavEnd, !1), nav_open = !1
                };
                app.closeNav = function() {
                    if (nav_open) {
                        var duration = transition_end && transition_prop ? parseFloat(window.getComputedStyle(inner, "")[transition_prop + "Duration"]) : 0;
                        duration > 0 ? document.addEventListener(transition_end, closeNavEnd, !1) : closeNavEnd(null)
                    }
                    removeClass(doc, nav_class)
                }, app.openNav = function() {
                    nav_open || (addClass(doc, nav_class), nav_open = !0)
                }, app.toggleNav = function(e) {
                    nav_open && hasClass(doc, nav_class) ? app.closeNav() : app.openNav(), e && e.preventDefault()
                }, document.getElementById("nav-open-btn").addEventListener("click", app.toggleNav, !1), document.getElementById("nav-open-btn").addEventListener("click", app.toggleNav, !1), addClass(doc, "js-ready")
            }
        }, app
    }(), window.addEventListener && window.addEventListener("DOMContentLoaded", window.App.init, !1)
}(window, window.document), 767 > viewWidth && ($("#nav li.drop").each(function() {
    $(this).find("a").first().click(function(e) {
        e.preventDefault(), $(this).parent().hasClass("active") ? ($(this).parent().removeClass("active"), $("#tab-nav").removeClass("submenu")) : ($(this).parent().addClass("active"), $("#tab-nav").addClass("submenu"))
    })
}), $("#nav-open-btn").click(function() {
    $("#nav li.drop").each(function() {
        $(this).removeClass("active")
    }), $("#tab-nav").removeClass("submenu")
})), $(document).ready(function() {
    if (viewWidth > 767 && is_touch_device()) {
        var dropMenus = $(".main-menu li.drop");
        dropMenus.mouseenter(function() {
            $(this).find(".tab");
            $(this).find("a").first().click(function(e) {
                e.preventDefault()
            }), $(this).addClass("active"), $(".content").click(function() {
                dropMenus.removeClass("active")
            })
        }).mouseleave(function() {
            $(this).removeClass("active")
        })
    } else viewWidth > 767 & !is_touch_device() && $(".main-menu li.drop").hover(function() {
        $(this).toggleClass("active")
    });
    $("#view-designers").click(function(e) {
        e.preventDefault(), $(".designers-featured").addClass("collapsed"), $(".designers-list").addClass("active"), gaTrackViewDesigners()
    })
});
var currencySelector = function() {
    var currencies = $("#currencies");
    $("a.currency-select").each(function() {
        $(this).click(function(e) {
            e.preventDefault(), currencies.addClass("active")
        })
    }), currencies.find("a").click(function(e) {
        e.preventDefault(), currencies.removeClass("active")
    })
};
$(window).bind("load", function() {
    viewWidth > 767 && $("figure.product").each(function() {
        var secondImg = $(this).find("img.secondary");
        if (secondImg.length > 0) {
            var secondImgSrc = secondImg.attr("data-hoverimg");
            secondImg.attr("src", secondImgSrc), $(this).hoverIntent(function() {
                $(this).addClass("swap")
            }, function() {
                $(this).removeClass("swap")
            })
        }
    })
}), $(window).bind("load", function() {
    $("#show-filter").click(function(e) {
        e.preventDefault(), $(".filters").toggleClass("active")
    }), $(".filter-group ul").perfectScrollbar({
        suppressScrollX: !0
    }), 767 >= viewWidth && $(".filter-group ul").each(function() {
        $(this).height() < 216 && $(this).perfectScrollbar("destroy")
    }), $(".filter-group a").click(function() {
        var clickItem = $(this).text();
        //_gaq.push(["_trackEvent", "Collection", "Filter", clickItem])
        ga('send', 'event', 'Collection', 'Filter', clickItem);
    })
});
var serviceNav = function() {
    if (viewWidth >= 768) {
        var top = $("#service-nav").offset().top - 100,
            height = $("#service-links").height(),
            pheight = $("#policies").height(),
            bottom = $("#policies").offset().top + pheight - height;
        $("#service-nav").height(pheight), $(window).scroll(function() {
            var y = $(this).scrollTop();
            y >= top && bottom >= y ? $("#service-links").removeClass("bottom").addClass("fixed") : y >= bottom ? $("#service-links").removeClass("fixed").addClass("bottom") : $("#service-links").removeClass("fixed")
        })
    }
};
jQuery(document).ready(function() {
    if ($("body").hasClass("feature")) {
        var bgimg = $("article.feature header").data("bgimg");
        if (bgimg.length > 0) {
            var bgimg = 'url("' + bgimg + '")';
            $("article.feature header").css("background-image", bgimg)
        }
    }
}), $(function() {
    var closeModal = function() {
        $("#mailing-list").removeClass("active"), window.location.hash = ""
    };
    $("#mailing-list a").click(function(e) {
        e.preventDefault(), closeModal()
    }), $('#mailing-list input[type="submit"]').click(function() {
        closeModal()
    })
});
var gaTrackSubscribe = function(location) {
        //_gaq.push(["_trackEvent", "Mailchimp", "Subscribe", location])
        ga('send', 'event', 'Collection', 'Filter', clickItem);
    },
    gaTrackViewDesigners = function() {
        //_gaq.push(["_trackEvent", "Navigation", "Click", "View All Brands"])
        ga('send', 'event', 'Collection', 'Filter', clickItem);
    },
    gaTrackAddCart = function(productName) {
        //_gaq.push(["_trackEvent", "Product Page", "Add to Bag", productName])
        ga('send', 'event', 'Collection', 'Filter', clickItem);
    };
$(function() {
    $(".welcome figcaption").click(function() {
        var linkName = $(this).find("h2").text();
        _gaq.push(["_trackEvent", "Welcome", "Feature Click", linkName])
        ga('send', 'event', 'Collection', 'Filter', clickItem);
    }), $("#cart-count, a.mobile-bag").click(function() {
        var pageName = document.title;
        _gaq.push(["_trackEvent", "Toolbar", "View Bag", pageName])
        ga('send', 'event', 'Collection', 'Filter', clickItem);
    }), $(".searchbar form.search-form").submit(function() {
        var term = $(this).find("input").val();
        /*_gaq.push(["_trackEvent", "Search", "Toolbar", term]), window._vis_opt_queue = window._vis_opt_queue || [], window._vis_opt_queue.push(function() {
            _vis_opt_goal_conversion(205)
        })*/
        ga('send', 'event', 'Search', 'Toolbar', term);
    }), $(".sitelinks .social a").click(function() {
        var network = $(this).attr("class");
        //_gaq.push(["_trackEvent", "Footer", "Social Icon Click", network])
        ga('send', 'event', 'Footer', 'Social Icon Click', network);
    }), $(".product-details .info-btns button").click(function() {
        var buttonName = $(this).text();
        //_gaq.push(["_trackEvent", "Product Page", "Details Button Click", buttonName])
        ga('send', 'event', 'Product Page', 'Details Button Click', buttonName);
    }), $(".product-details .share-buttons").click(function() {
        var network = $(this).attr("class");
        //_gaq.push(["_trackEvent", "Product Page", network, "share"])
        ga('send', 'event', 'Product Page', network, 'share');
    }), $(".related-items figure").click(function() {
        var item = $(this).find(".product-title").text();
        //_gaq.push(["_trackEvent", "Product Page", "Related Item Click", item])
        ga('send', 'event', 'Product Page', 'Related Item Click', item);
    }), $(".bag .cart-options input").click(function() {
        var method = $(this).attr("value");
        //_gaq.push(["_trackEvent", "Cart", "Start Checkout", method])
        ga('send', 'event', 'Cart', 'Start Checkout', method);
    }), $(".bag .shipping input").click(function() {
        var country = $("#address_country").val();
        //_gaq.push(["_trackEvent", "Cart", "Estimate Shipping", country])
        ga('send', 'event', 'Cart', 'Estimate Shipping', country);
    }), $("#service-nav a").click(function() {
        var option = $(this).text();
        //_gaq.push(["_trackEvent", "Customer Service", "View Policy", option])
        ga('send', 'event', 'Customer Service', 'View Policy', option);
    })
});
var showGeoElements = function(countryCode) {
        $("[class*=geo-" + countryCode + "].geo-block").addClass("show-geo-block"), $("[class*=geo-" + countryCode + "].geo-inline").addClass("show-geo-inline")
    },
    geoCookies = function() {
        window.userCountryCode = $.cookie("user_country_code"), window.userCountry = $.cookie("user_country"), void 0 == window.userCountryCode || void 0 == window.userCountry ? $.getJSON("http://www.telize.com/geoip?callback=?", function(location) {
            window.userCountryCode = location.country_code, window.userCountry = location.country, $.cookie("user_country_code", window.userCountryCode, {
                expires: 30,
                path: "/"
            }), $.cookie("user_country", window.userCountry, {
                expires: 30,
                path: "/"
            }), "CA" == window.userCountryCode && (window.userProvinceCode = location.region_code, window.userProvince = location.region, $.cookie("user_province_code", window.userProvinceCode, {
                expires: 30,
                path: "/"
            }), $.cookie("user_province", window.userProvince, {
                expires: 30,
                path: "/"
            })), showGeoElements(window.userCountryCode)
        }) : ("CA" == window.userCountryCode && (window.userProvinceCode = $.cookie("user_province_code"), window.userProvince = $.cookie("user_province"), (void 0 == window.userProvinceCode || void 0 == window.userProvince) && $.getJSON("http://www.telize.com/geoip?callback=?", function(location) {
            window.userProvinceCode = location.region_code, window.userProvince = location.region, $.cookie("user_province_code", window.userProvinceCode, {
                expires: 30,
                path: "/"
            }), $.cookie("user_province", window.userProvince, {
                expires: 30,
                path: "/"
            })
        })), showGeoElements(userCountryCode))
    },
    CountrySelect = {
        init: function() {
            modal = $("#country-selector"), countrySelector = $("#destination-country"), provinceSelector = $("#destination-province"), provinceLabel = $("#destination-province-label"), countrySelector.change(function() {
                if (currentCountry = $(this).val(), currentCountry = Countries[currentCountry], currentCountry.provinces) {
                    for (provinceSelector.empty(), i = 0; i < currentCountry.provinces.length; i++) {
                        var option = '<option value="' + currentCountry.provinces[i] + '">' + currentCountry.provinces[i] + "</option>";
                        provinceSelector.append(option)
                    }
                    provinceLabel.text(currentCountry.label), provinceSelector.parent().show()
                }
            }), $("a.change-dest").click(function(e) {
                e.preventDefault(), CountrySelect.open()
            }), $("#country-selector-close").click(function(e) {
                e.preventDefault(), CountrySelect.close()
            }), $("#destination-apply").click(function(e) {
                e.preventDefault(), CountrySelect.apply(e)
            });
          
            if(window.userCountry !== undefined) {
               $("#destination-country").val(window.userCountry).trigger('change');
            }
            if(window.userProvince !== undefined) {
               $("#destination-province").val(window.userProvince).trigger('change');
            }
        },
        apply: function() {
            var newCountry = countrySelector.val(),
                newProvince = provinceSelector.val();
            window.userCountry = newCountry, window.userProvince = newProvince, "United States" == window.userCountry && (window.userProvince = "California"), $.cookie("user_country", window.userCountry, {
                expires: 30,
                path: "/"
            }), $.cookie("user_province", window.userProvince, {
                expires: 30,
                path: "/"
            }), CountrySelect.geoCurrency(newCountry), CountrySelect.close()
        },
        geoCurrency: function(country) {
            var apply = function(country) {
                countryURL = "http://restcountries.eu/rest/v1/name/" + encodeURI(country);
                var set = function(currencyCode) {
                        Currency.convertAll(Currency.currentCurrency, currencyCode), $.cookie("user_country_code", window.userCountryCode, {
                            expires: 30,
                            path: "/"
                        }), $.cookie("currency", currencyCode, {
                            expires: 30,
                            path: "/"
                        }), MiniCart.setDestination(), MiniCart.update();
          				
                  		$('.change-dest').html(currencyCode+'<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7.63 5.22"><path fill="#231f20" d="M7.63.63L6.91 0 3.82 3.72.72 0 0 .63l3.19 3.84.63.75.62-.75L7.63.63z"/></svg></span>');
                    },
                    success = function(data) {
                        window.userCountryCode = data[0].alpha2Code;
                        var newCurrency = data[0].currencies[0];
                        set(newCurrency)
                    },
                    fail = function() {
                        window.userCountryCode = "CA";
                        var newCurrency = "CAD";
                        set(newCurrency)
                    },
                    data = {};
                $.ajax({
                    dataType: "json",
                    url: countryURL,
                    data: data,
                    success: success,
                    error: fail
                })
            };
            if (country) apply(country);
            else {
                var data = {},
                    success = function(data) {
                        apply(data.country)
                    },
                    fail = function() {
                        apply("Canada")
                    };
                $.ajax({
                    dataType: "json",
                    url: "http://www.telize.com/geoip?callback=?",
                    data: data,
                    success: success,
                    error: fail
                })
            }
        },
        open: function() {
            modal.addClass("active")
        },
        close: function() {
            modal.removeClass("active")
        }
    };
$(function() {
    geoCookies(), currencyInit(), CountrySelect.init()
});
var currencyInit = function() {
        if (Currency.format = "money_with_currency_format", Currency.shopCurrency = "CAD", Currency.cookieCurrency = $.cookie("currency"), Currency.queryCurrency = $.QueryString.currency, jQuery("span.money span.money").each(function() {
                jQuery(this).parents("span.money").removeClass("money")
            }), jQuery("span.money").each(function() {
                jQuery(this).attr("data-currency-CAD", jQuery(this).html())
            }), null != Currency.queryCurrency) {
            Currency.currentCurrency = Currency.queryCurrency, Currency.convertAll(Currency.shopCurrency, Currency.queryCurrency); {
                Currency.queryCurrency
            }
          	$('.change-dest').html(Currency.currentCurrency+'<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7.63 5.22"><path fill="#231f20" d="M7.63.63L6.91 0 3.82 3.72.72 0 0 .63l3.19 3.84.63.75.62-.75L7.63.63z"/></svg></span>');
        } else {
          Currency.cookieCurrency ? (Currency.cookieCurrency.length < 1 && (Currency.cookie.destroy(), CountrySelect.geoCurrency()), Currency.currentCurrency = Currency.cookieCurrency, Currency.convertAll(Currency.shopCurrency, Currency.cookieCurrency)) : CountrySelect.geoCurrency();
        	$('.change-dest').html(Currency.currentCurrency+'<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7.63 5.22"><path fill="#231f20" d="M7.63.63L6.91 0 3.82 3.72.72 0 0 .63l3.19 3.84.63.75.62-.75L7.63.63z"/></svg></span>');
        }
        window.selectCallback
    },
    fnames = new Array,
    ftypes = new Array;
fnames[1] = "FNAME", ftypes[1] = "text", fnames[2] = "LNAME", ftypes[2] = "text", fnames[0] = "EMAIL", ftypes[0] = "email", fnames[3] = "COMPANY", ftypes[3] = "text", fnames[4] = "PHONE", ftypes[4] = "phone", fnames[5] = "ADDRESS", ftypes[5] = "address", fnames[6] = "LAST_ORDER", ftypes[6] = "date";
try {
    var jqueryLoaded = jQuery;
    jqueryLoaded = !0
} catch (err) {
    var jqueryLoaded = !1
}
var head = document.getElementsByTagName("head")[0];
if (!jqueryLoaded) {
    var script = document.createElement("script");
    script.type = "text/javascript", script.src = "//ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js", head.appendChild(script), script.readyState && null !== script.onload && (script.onreadystatechange = function() {
        "complete" == this.readyState && mce_preload_check()
    })
}
var err_style = "";
try {
    err_style = mc_custom_error_style
} catch (e) {
    err_style = ".mc_embed_signup input.mce_inline_error{border-color:#6B0505;} .mc_embed_signup div.mce_inline_error{margin: 0 0 1em 0; padding: 5px 10px; background-color:#6B0505; font-weight: bold; z-index: 1; color:#fff;}"
}
var head = document.getElementsByTagName("head")[0],
    style = document.createElement("style");
style.type = "text/css", style.styleSheet ? style.styleSheet.cssText = err_style : style.appendChild(document.createTextNode(err_style)), head.appendChild(style), setTimeout("mce_preload_check();", 250);
var mce_preload_checks = 0;
MiniCart = {
    open: function() {
        $("#mini-cart").addClass("active"), $("#mini-overlay").addClass("active"), isOpen = !0
    },
    close: function() {
        $("#mini-cart").removeClass("active"), $("#mini-overlay").removeClass("active"), isOpen = !1
    },
    getSubtotal: function() {
        window.setTimeout(function() {
            Shopify.getCart(function(cart) {
                var subtotal = Shopify.formatMoney(cart.total_price, "{{amount}}").replace(",", ""),
                    subtotalMoney = Shopify.formatMoney(cart.total_price, "${{amount}} CAD");
                $("#mini-subtotal").empty().attr("data-subtotal", subtotal).addClass("money").removeAttr("data-currency" + Currency.currentCurrency).removeAttr("data-currency").attr("data-currency-cad", subtotalMoney).text(subtotalMoney), MiniCart.getRates()
            })
        }, 400)
    },
    updateCount: function() {
        window.setTimeout(function() {
            Shopify.getCart(function(cart) {
                var plural = " item",
                    count = cart.item_count;
                if (1 == count) var plural = "";
                else if (void 0 === count) var count = 0,
                    plural = "";
                else var plural = "";
                MiniCart.itemCount = count, $("#cart-count").text(count + plural + " "), $("#mobile-cart-count").text(count)
            })
        }, 400)
    },
    updateTotals: function() {
        var shipAmount = $("#mini-shipping-amount"),
            shipPrice = $("#mini-shipping-method").val(),
            subtotal = parseFloat($("#mini-subtotal").attr("data-subtotal")),
            taxRate = 0,
            taxAmount = 0;
        if ("CAD" != Currency.currentCurrency && (amounts = $("#mini-cart .totals span[data-currency]"), amounts.removeAttr("data-currency"), amounts.removeAttr("data-currency-" + Currency.currentCurrency), amounts.addClass("money"), amounts.text(function() {
                return $(this).attr("data-currency-cad")
            })), 0 == subtotal ? shipAmount.text("$0.00 CAD").addClass("money") : 0 == shipPrice ? shipAmount.text("FREE").removeClass("money") : shipAmount.text("$" + shipPrice + " CAD").addClass("money"), "Canada" == userCountry) {
            taxRate = "British Columbia" == userProvince ? .12 : .05;
            var taxAmount = Math.round(subtotal * taxRate * 100) / 100;
            $(".taxes .amount span").attr("data-tax-amount", taxAmount).text("$" + taxAmount + " CAD")
        }
        if (0 == subtotal) $("#mini-total").text("$0 CAD");
        else {
            var total = Math.round(100 * (subtotal + parseFloat(shipPrice) + taxAmount));
            "Canada" == userCountry && (total /= 100), $("#mini-total").text("$" + total + " CAD")
        }
        Currency.convertAll(Currency.shopCurrency, Currency.currentCurrency)
    },
    setDestination: function() {
        userCountry = window.userCountry, userProvince = window.userProvince, $("#shipping-destination").text("Canada" == userCountry ? userProvince : userCountry)
    },
    getRates: function() {
        $("#mini-shipping-method").empty(), Shopify.Cart.ShippingCalculator.show({
            moneyFormat: "{{amount}}",
            miniCart: !0,
            wrapperId: "mini-shipping-method",
            callback: function() {
                $("#mini-shipping-method").trigger("change"), MiniCart.updateTotals()
            }
        })
    },
    addItem: function(product) {
        var template = Hogan.compile('\n      <li class="product" style="list-style: none;" data-variant-id="{{variantID}}">\n          <div class="picture">\n           <a href="{{url}}">\n              <img src="{{image}}" alt="{{title}}">\n           </a>\n            <a href="#" class="remove-item x">&nbsp;\n            </a>\n          </div>\n          <a href="{{url}}">\n            <div class="description">\n             <div class="brand">{{vendor}}</div>\n             <div class="name">{{title}}</div>\n             <div class="price money">{{price}}</div>\n            </div>\n          </a>\n        </a>\n      </li>\n   '),
            data = {
                title: product.title,
                vendor: product.vendor,
                url: product.url,
                price: Shopify.formatMoney(product.price, "${{amount}} CAD"),
                image: product.image.replace(".jpg", "_small.jpg").replace(".jpeg", "_small.jpeg"),
                variantID: product.id
            };
        $("#mini-cart .products").append(template.render(data)), MiniCart.update(), MiniCart.open()
    },
    removeItem: function(id, element) {
        Shopify.removeItem(id, function() {
            $(element).remove()
        }), $("#mini-shipping-method").empty(), MiniCart.update()
    },
    makeItemsRemoveable: function() {
        $("#mini-cart .products li").each(function() {
            var id = $(this).attr("data-variant-id"),
                element = $(this);
            $(this).find("a.remove-item").click(function(e) {
                e.preventDefault, MiniCart.removeItem(id, element)
            })
        })
    },
    update: function() {
        MiniCart.getSubtotal(), MiniCart.updateCount(), MiniCart.makeItemsRemoveable()
    },
    init: function() {
        var isOpen = !1;
        $("#cart-count, #mobile-bag").click(function(e) {
            e.preventDefault(), isOpen ? MiniCart.close() : MiniCart.open()
        }), $("#close-mini-cart").click(function(e) {
            e.preventDefault(), MiniCart.close()
        }), $("#mini-overlay").click(function() {
            MiniCart.close()
        }), MiniCart.setDestination(), $("#mini-shipping-method").change(function() {
            MiniCart.updateTotals()
        }), MiniCart.getRates(), MiniCart.makeItemsRemoveable()
    }
}, $(window).load(function() {
    MiniCart.init()
});
var imageViewer = function(version) {
        "scroll" == version ? ($("html").removeClass("slider").addClass("scroller"), void 0 != window.mySwipe && window.mySwipe.kill(), $("#product").imagesLoaded(function() {
            var top = $(".product-details").offset().top - 25,
                thumbHeight = $(".detail-images").height(),
                detailHeight = $(".product-details").height(),
                newHeight = thumbHeight;
            detailHeight > thumbHeight && (newHeight = detailHeight);
            var pheight = $("#slider").height(),
                bottom = $("#slider").offset().top + pheight - newHeight;
            /*$(window).scroll(function() {
                var y = $(this).scrollTop();
                y >= top && bottom >= y ? ($(".product-details, .detail-images").removeClass("bottom").addClass("fixed"), $(".product-details").css({
                    right: function() {
                        var rightSide = ($(window).outerWidth() - $("#product").outerWidth()) / 2;
                        return rightSide
                    }
                })) : y >= bottom ? ($(".product-details, .detail-images").removeClass("fixed").addClass("bottom"), $(".product-details").css({
                    right: function() {
                        var rightSide = ($(window).outerWidth() - $("#product").outerWidth()) / 2;
                        return rightSide
                    }
                })) : ($(".product-details, .detail-images").removeClass("fixed"), $(".product-details").css("right", "auto"))
            })*/
        })) : ($("html").removeClass("scroller").addClass("slider"), window.mySwipe = Swipe(document.getElementById("slider")))
    },
    checkWidth = function(touch) {
        width = correctedViewportW(), width >= 768 ? imageViewer("scroll") : (768 > width) && imageViewer()
    },
    productTools = function() {
        touch = is_touch_device(), checkWidth(touch), $(window).on("resize", function() {
            checkWidth(touch)
        })
    };
$(".share-buttons a").each(function() {
    $(this).click(function(e) {
        return e.preventDefault(), pop = window.open($(this).attr("href"), "", "height=400,width=600"), window.focus && pop.focus(), !1
    })
}), $("#fit-guide").click(function(e) {
    e.preventDefault(), $("#how-measure").addClass("show")
}), $("#close-measure").click(function(e) {
    e.preventDefault(), $("#how-measure").removeClass("show")
}), $("#show-tops").click(function(e) {
    e.preventDefault(), $(this).addClass("active"), $("#show-bottoms").removeClass("active"), $("#bottoms").hide(), $("#tops").show()
}), $("#show-bottoms").click(function(e) {
    e.preventDefault(), $(this).addClass("active"), $("#show-tops").removeClass("active"), $("#tops").hide(), $("#bottoms").show()
});
var addToBag = function() {
        {
            var productName = $(".product-details .product-title").text(),
                buy = $("input.buy"),
                selector = $(".product-variants select");
            $('.product-variants input[type="radio"]')
        }
        selector.change(function() {
            buy.attr("value", "Add to Bag")
        });
        var addItem = function(form_id) {
                $.ajax({
                    type: "POST",
                    url: "/cart/add.js",
                    dataType: "json",
                    data: $("#" + form_id).serialize(),
                    success: addToCartOk,
                    error: addToCartFail
                })
            },
            addToCartOk = function(product) {
                cartCount++, MiniCart.updateCount(), buy.attr({
                    value: "Add Another"
                }).addClass("added"), $("#bag-message").html('<p>Item added to bag. <a href="/cart">View bag</a></p>').addClass("show"), window._vis_opt_queue = window._vis_opt_queue || [], window._vis_opt_queue.push(function() {
                    _vis_opt_goal_conversion(204)
                }), gaTrackAddCart(productName), MiniCart.addItem(product)
            },
            addToCartFail = function(obj, status, description) {
                response = jQuery.parseJSON(obj.responseText), "Bad Request" == description ? $("#bag-message").html("<p>Please select a size.</p>").addClass("show") : $("#bag-message").html("<p>" + response.description.replace("cart", "bag").replace("Cart", "Bag") + ' <a href="/cart">View bag</a></p>').addClass("show")
            };
        $("form.product-form").on("submit", function(e) {
            e.preventDefault(), addItem("product-form")
        })
    },
    listProduct = Hogan.compile('\n <div class="swiper-slide">\n    <a href="{{url}}" title="{{vendor }} {{title}}">\n      <img src="{{imageURL}}" alt="{{vendor}} {{title}}" />\n   </a>\n    <div class="product-info">\n      <div class="product-title">\n       <a href="{{url}}">{{vendor}}<br>{{title}}</a>\n     </div>\n      <div class="product-price">\n       <span {{#salePrice}}class="sale-price"{{/salePrice}}>{{price}}</span>\n       <span {{#salePrice}}class="regular-price">{{/salePrice}}{{ salePrice }}</span>\n      </div>\n    </div>\n  </div>\n'),
    listProductImgOnly = Hogan.compile('\n  <div class="swiper-slide">\n    <a href="{{url}}" title="{{vendor }} {{title}}">\n      <img src="{{imageURL}}" alt="{{vendor}} {{title}}" />\n   </a>\n  </div>\n'),
    recommender = function(productHandles, listElement, imageSize, titles) {
        var imageSize = imageSize || "large",
            titles = "undefined" != typeof titles ? titles : !0,
            recommendations = [];
        if (recommendations = jQuery.trim(productHandles).split(/[\s,;]+/), recommendations.length && "" !== recommendations[0])
            for (var list = jQuery(listElement), i = 0; i < recommendations.length && 2 >= i; i++) jQuery.getJSON("/products/" + recommendations[i] + ".js", function(product) {
                if (product.images[0]) var img0 = product.images[0].replace(/(\.jpg|\.png|\.jpeg|\.gif)/, "_" + imageSize + "$1");
                if (product.compare_at_price_min > product.price) var price = Shopify.formatMoney(product.price, "${{amount}} CAD"),
                    salePrice = Shopify.formatMoney(product.compare_at_price_max, "${{amount}} CAD");
                else var price = Shopify.formatMoney(product.price, "${{amount}} CAD");
                var data = {
                    title: product.title,
                    vendor: product.vendor,
                    price: price,
                    salePrice: salePrice,
                    imageURL: img0,
                    url: "/products/" + product.handle
                };
                list.prepend(titles ? listProduct.render(data) : listProductImgOnly.render(data));

                if($(window).width()<768) {
                    $('#related-swiper').swiper({
                        slidesPerView:2,
                        nextButton:'.swiper-button-next',
                        prevButton:'.swiper-button-prev'
                    });
                 } else {
                    $('#related-swiper').swiper({
                        slidesPerView:4,
                        nextButton:'.swiper-button-next',
                        prevButton:'.swiper-button-prev'
                    });
                }
            })
    },
    stInit = function() {
       /* function searchPage(searchURI) {
            window.location.assign("/search" + searchURI)
        }
        var searchInput = $(".search-form input[type='text']"),
            resultsDiv = "#st-results-container",
            engine = "pXiVcJDJS_Fk_F2HTjHU",
            autoResultImage = Hogan.compile('\n        <div class="result {{type}} clearfix">\n            <div class="thumb">\n                <img src="{{image}}"/>\n            </div>\n            <div class="text">\n                <h5 class="title">\n                {{title}}<br/>\n                <span class="info">\n                    {{ info }}\n                </span>\n                </h5>\n                <p class="excerpt">\n                   {{{body}}}\n                </p>\n                {{#price}}<div class="price"><span class="money" data-currency-cad="{{{price}}}">{{{price}}}</span></div>{{/price}}\n            </div>\n        </div>\n    '),
            autoResultNoImage = Hogan.compile('\n        <div class="result no-image {{type}} clearfix">\n            <h5 class="title">\n                {{title}}<br/>\n                <span class="info">\n                    {{info}}\n                </span>\n            </h5>\n            <p class="excerpt">\n                {{{body}}}\n            </p>\n            {{#price}}<div class="price"><span class="money" data-currency-cad="{{{price}}}">{{{price}}}</span></div>{{/price}}\n        </div>\n    '),
            autoCompleteRender = function(document_type, item) {
                var publish_date = item.published_at.split("T");
                if (publish_date = publish_date[0].split("-"), publish_date = publish_date.reverse().join("/"), item.price) {
                    var price = item.price.toFixed(2).toString();
                    price = "$" + price + " CAD"
                }
                var data = {
                    title: item.title,
                    url: item.url,
                    info: item.info,
                    image: item.image.replace("_medium", "_small"),
                    body: item.highlight.body || item.body,
                    type: item.type,
                    price: price,
                    published_at: publish_date
                };
                return ("article" == item.type || "blog" == item.type) && (data.info = publish_date), item.image.length > 0 ? autoResultImage.render(data) : autoResultNoImage.render(data)
            },
            searchResultImage = Hogan.compile('\n        <a href="{{url}}">\n            <div class="result {{type}} clearfix">\n                <div class="thumb">\n                    <img src="{{image}}"/>\n                </div>\n                <div class="text">\n                    <h5 class="title">\n                    {{title}}<br/>\n                    <span class="info">\n                        {{ info }}\n                    </span>\n                    </h5>\n                    <p class="excerpt">\n                       {{{body}}}\n                    </p>\n                    {{#price}}<div class="price"><span class="money" data-currency-cad="{{{price}}}">{{{price}}}</span></div>{{/price}}\n                </div>\n            </div>\n        </a>\n    '),
            searchResultNoImage = Hogan.compile('\n        <a href="{{url}}">\n            <div class="result no-image {{type}} clearfix">\n                <div class="text">\n                    <h5 class="title">{{title}}<br/>\n                        <span class="info">{{info}}</span>\n                    </h5>\n                    <p class="excerpt">{{{body}}}</p>\n                    {{#price}}<div class="price"><span class="money" data-currency-cad="{{{price}}}">{{{price}}}</span></div>{{/price}}\n                </div>\n            </div>\n        </a>\n    '),
            searchRender = function(document_type, item) {
                var publish_date = item.published_at.split("T");
                if (publish_date = publish_date[0].split("-"), publish_date = publish_date.reverse().join("/"), item.price) {
                    var price = item.price.toFixed(2).toString();
                    price = "$" + price + " CAD"
                }
                var data = {
                    title: item.title,
                    url: item.url,
                    info: item.info,
                    image: item.image,
                    body: item.highlight.body || item.body,
                    type: item.type,
                    price: price,
                    published_at: publish_date
                };
                return ("article" == item.type || "blog" == item.type) && (data.info = publish_date), item.image.length > 0 ? searchResultImage.render(data) : searchResultNoImage.render(data)
            };
        searchInput.swiftype({
            engineKey: engine,
            renderFunction: autoCompleteRender,
            functionalBoosts: {
                product: {
                    popularity: "logarithmic"
                },
                article: {
                    popularity: "logarithmic"
                },
                collection: {
                    popularity: "logarithmic"
                },
                page: {
                    popularity: "logarithmic"
                }
            },
            sortField: {
                article: "published_at",
                product: "published_at"
            },
            sortDirection: {
                article: "desc",
                product: "desc"
            }
        }), searchInput.swiftypeSearch({
            engineKey: engine,
            renderFunction: searchRender,
            resultContainingElement: resultsDiv,
            perPage: 20,
            functionalBoosts: {
                product: {
                    popularity: "logarithmic"
                },
                article: {
                    popularity: "logarithmic"
                },
                collection: {
                    popularity: "logarithmic"
                },
                page: {
                    popularity: "logarithmic"
                }
            },
            sortField: {
                article: "published_at",
                product: "published_at"
            },
            sortDirection: {
                article: "desc",
                product: "desc"
            }
        }), $(window).hashchange(function() {
            searchHash = location.hash, url = location.href, -1 == url.search("/search") && -1 != searchHash.search("stq=") && searchPage(searchHash)
        })
        
        */
    };
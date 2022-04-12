// Hooks Server
// By Panda Studio & KRUNK DESIGN
// https://krunk.cn
var krunk_hook = {};
const add_filter = function (r, o, e) {
    if (!r) return !1;
    if ("function" != typeof o) return !1;
    (null != e && "number" == typeof e) || (e = 10),
      krunk_hook[r] || (krunk_hook[r] = []);
    for (var n = krunk_hook[r], t = 0, i = 0; i < n.length; i++)
      if ((n[i][1] <= e && (t = i + 1), n[i][0] === o)) return !1;
    return n.splice(t, 0, [o, e]), !0;
  },
  add_action = add_filter,
  remove_filter = function (r, o) {
    if (!r) return !1;
    if ("function" != typeof o) return !1;
    if (!krunk_hook[r]) return !1;
    for (var e = krunk_hook[r], n = 0; n < e.length; n++)
      if (e[n][0] === o) return e.splice(n, 1), !0;
    return !1;
  },
  remove_action = remove_filter,
  do_action = function (r) {
    var o = krunk_hook[r];
    if (!o) return !1;
    for (var e = [], n = 1; n < arguments.length; n++) e.push(arguments[n]);
    for (n = 0; n < o.length; n++) o[n][0].apply(void 0, e);
  },
  apply_filters = function (r, o) {
    var e = krunk_hook[r];
    if (!e) return o;
    for (var n = [], t = 2; t < arguments.length; t++) n.push(arguments[t]);
    for (t = 0; t < e.length; t++) o = e[t][0].apply(void 0, [o].concat(n));
    return o;
  };
module.exports = {
  add_filter: add_filter,
  remove_filter: remove_filter,
  add_action: add_action,
  remove_action: remove_action,
  do_action: do_action,
  apply_filters: apply_filters,
};

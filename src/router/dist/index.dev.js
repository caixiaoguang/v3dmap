"use strict";

var _interopRequireDefault = require("/Users/caixiaoguang/Desktop/project/v3dmap/node_modules/@babel/runtime/helpers/interopRequireDefault").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.object.to-string.js");

var _interopRequireWildcard2 = _interopRequireDefault(require("/Users/caixiaoguang/Desktop/project/v3dmap/node_modules/@babel/runtime/helpers/esm/interopRequireWildcard"));

var _vueRouter = require("vue-router");

var _Home = _interopRequireDefault(require("../views/Home.vue"));

var routes = [{
  path: '/',
  name: 'Home',
  component: _Home.default
}, {
  path: '/about',
  name: 'About',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: function component() {
    return Promise.resolve().then(function () {
      return (0, _interopRequireWildcard2.default)(require('../views/About.vue'));
    });
  }
}];
var router = (0, _vueRouter.createRouter)({
  history: (0, _vueRouter.createWebHashHistory)(),
  routes: routes
});
var _default = router;
exports.default = _default;
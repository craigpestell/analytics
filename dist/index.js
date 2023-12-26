'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.useAnalytics = exports.usePageView = exports.Analytics = void 0;
const analytics_1 = __importDefault(require('./lib/analytics'));
exports.Analytics = analytics_1.default;
const useAnalytics_1 = require('./hooks/useAnalytics');
Object.defineProperty(exports, 'useAnalytics', {
  enumerable: true,
  get: function () {
    return useAnalytics_1.useAnalytics;
  },
});
Object.defineProperty(exports, 'usePageView', {
  enumerable: true,
  get: function () {
    return useAnalytics_1.usePageView;
  },
});
exports.default = analytics_1.default;
//# sourceMappingURL=index.js.map

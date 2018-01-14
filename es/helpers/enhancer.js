import { compose } from 'redux';
import ModStack from '../ModStack';

export default (function (component) {
  for (var _len = arguments.length, otherEnhancers = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    otherEnhancers[_key - 1] = arguments[_key];
  }

  if (otherEnhancers) {
    var newEnhancer = compose.apply(undefined, [ModStack.getEnhancerFunction()].concat(otherEnhancers));
    return newEnhancer(component);
  }
  return ModStack.getEnhancerFunction()(component);
});
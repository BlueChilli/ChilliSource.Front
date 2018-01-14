import { compose } from 'redux';
import ModStack from '../ModStack';

export default (component, ...otherEnhancers) => {
  if (otherEnhancers) {
    const newEnhancer = compose(ModStack.getEnhancerFunction(), ...otherEnhancers);
    return newEnhancer(component);
  }
  return ModStack.getEnhancerFunction()(component);
};

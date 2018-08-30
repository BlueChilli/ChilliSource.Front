/** Libraries */
import { compose } from 'redux';

/** Components */
import { ModStack } from './';

/**
 * Wraps the component in the enhancer as well
 * as other enhancers if the user has specified
 * them
 * @param {React.ComponentType} component
 * @param [Array] otherEnhancers
 *
 * @returns {React.ComponentType} component
 */
const componentEnhancer = (component, ...otherEnhancers) => {
	if (otherEnhancers) {
		return compose(
			ModStack.getMasterEnhancer(),
			...otherEnhancers
		)(component);
	}

	return ModStack.getMasterEnhancer()(component);
};

export default componentEnhancer;

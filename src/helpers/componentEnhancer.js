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
	console.log('component', component);
	console.log('otherEnhancers', otherEnhancers);

	if (otherEnhancers) {
		const enhancedComponent = compose(
			ModStack.getMasterEnhancer(),
			...otherEnhancers
		)(component);
		console.log('enhancedComponent', enhancedComponent);
		return enhancedComponent;
	}
	const enhancedComponent = ModStack.getMasterEnhancer()(component);
	console.log('enhancedComponent', enhancedComponent);
	return enhancedComponent;
};

export default componentEnhancer;

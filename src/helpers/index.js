import ModStack from './ModStack';

export { default as componentEnhancer } from './componentEnhancer';

export { default as history } from './getHistory';

const getMod = ModStack.getModByName;
export { ModStack, getMod };

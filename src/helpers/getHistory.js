/** Libraries */
import createHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';

import { History } from 'history';

/**
 * The app's navigation history.
 * @name history
 * @type {History}
 */
const history = typeof document != 'undefined' ? createHistory() : createMemoryHistory();

export default history;

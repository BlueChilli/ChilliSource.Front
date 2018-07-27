import createHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';

// eslint-disable-next-line
var history = typeof document != 'undefined' ? createHistory() : createMemoryHistory();

export default history;
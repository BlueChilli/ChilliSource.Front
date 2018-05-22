import createHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';

var history = typeof document != 'undefined' ? createHistory() : createMemoryHistory();

export default history;
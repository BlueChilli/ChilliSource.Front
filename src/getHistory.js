import createHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';

const history = typeof document != 'undefined' ? createHistory() : createMemoryHistory();

export default history;
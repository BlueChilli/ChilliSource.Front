# ChilliFront - Redux Modular Development

* enables you to write your React/Redux app using modules.
* Built on top of `React`, `Redux`, `React-Router 4` and `immutablejs`


## What are chillifront modules capable of?

* Redux actions, reducers & middleware
* React-Router 4 routes
* Higher Order functions (enhancers), wrapping either the *entire app*, or *individual components*.
* Store enhancers

## Installation

#### 1. React create-app

* `create-react-app <name-of-your-app>`
* `cd <name-of-your-app>`
* `npm run eject` (optional, but recommended)

#### 2. Install some dependencies

`chillifront` currently has some opinions to go about its business. Mostly around Redux and react-router-4. (RR 4 could possibly be turned into a module on a rainy day!)

`yarn add history redux immutable react-redux redux-immutablejs react-router react-router-redux@next react-router-config react-router-dom`
`yarn add redux-devtools-extension -D`


#### 3. Copy chillifront library

Until we've sorted out deployment. Copy/Paste filesystem-fu is required. You'll need the core library files for it to run.

* copy `chillifront/*` from somewhere else to your new app. `./src/` is the recommended location.

#### 4. Copy/Create Modules

You'll need a modules directory. Modules are located in `./src/modules`. Once again, until we've figured out deployment, you can copy modules from elsewhere, or create an empty directory.

#### 5. Add Redux Store

You have a few choices with how you can go about this. You can rely *completely* on the chillifront module system, or you can go for the hybrid approach. At the time of writing, I'm aiming for a module-only approach. That is, all Redux things will be declared within an actual module - this is better imho.

Below is a bare-bones example for dev. `./src/redux/configureStore.js`

```js
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {combineReducers} from "redux-immutablejs";

// Optional Middleware
const middleware = [];

export default function configureStore(initialState, modReducers = {}, modMiddleware = [], modStoreEnhancers = []) {
    const composedEnhancers = composeWithDevTools(
        applyMiddleware(...modMiddleware.concat(middleware)),
        ...modStoreEnhancers
    );

    const rootReducer = combineReducers(modReducers);
    return createStore(rootReducer, initialState, composedEnhancers);
}
```

#### 6. App creator

In the `react-create-app` boilerplate, there is an `./src/App.js` file which serves as your initial 'presentational' entrypoint, replace it with:

```js
import chillifront from "./chillifront";
import configureStore from "./redux/configureStore";
import Entry from "./App/Entry";
export default chillifront(
    [
        /* Mods go here */
    ],
    configureStore
)(Entry);
```

#### 7. App entry

Create a new file called `./App/Entry.jsx`. As you can see, this is a pretty standard React component.
```js
import React from 'react'

export default class extends React.Component {
    render() {
        return (
            <h1>Hello World!</h1>
        )
    }
};
```

#### 8. Start your app with yarn/npm start

Yes, this is boring, there's nothing really to show. But our app is saying hello to the world, and we're ready to rock.

---------------------------------------------


## Making a module

A module is simply an es6 class conforming to a set of methods which return things. 

| method  | description|
|-|-|
| `name()`       | Sets the name of the module (classname by default) |
| `options()`    | Default options  |
| `middleware()` | Custom middleware |
| `actions()`    | Redux actions  |
| `reducers()`    | Redux Reducers  |
| `routes()`    | Redux actions  |
| `wrapApp()`    | Wraps app in a HOC  |
| `mapStateToProps()`    | Inject state props into any component |
| `mapDispatchToProps()`   | Inject dispatcher props into any component |
| `functions()`   | Helper functions |
| `storeEnhancer()`   | Add functionality to the redux store |
| `storeSubscriber()` | Utilises Redux's store.subscribe


However, rather than playing air guitar with the API, let's go by example.


### Adding custom middleware to a module
`./src/modules/Test/index.js`

```js
import {Mod} from "../../chillifront/index";

// Create some custom middleware.
export default class Test extends Mod {
    middleware() {
        return store => next => action => {
            console.log("[RECEIVED ACTION] ", action);
            next(action);
        };
    }
}
```

-----

### Hooking a module to the app

The 1st parameter of `chillifront` expects an array of module instances.

```js
...
import Test from "./modules/Test";
...
export default chillifront(
    [new Test()],
    configureStore
)(Entry);
```

-----

### Adding options to a module

```js
export default class Test extends Mod {

	// options Method
    options() {
        return {"identifierText": "Action Intercepted"}; // defaults
    }


    middleware() {
        return store => next => action => {
            console.log(this.getOption("identifierText"), action);
            next(action);
        };
    }
}
```

Options are passed via the constructor function when you declare a module.

```js
new Test({
    identifierText: "custom text"
})
```

-----

### CreateMyApp console utilities

The `chillifront` accepts a third parameter, which if set to `true`, will output some valuable information to the console. It is strongly recommended you use this during development.

```js
export default chillifront(
    [], configureStore, true
)(Entry);
```

-----

### Adding redux actions to a module

Create some actions in a file `./src/modules/Test/actions.js`
```js
export const myAction = () => ({"type": "myAction"});
export const anotherAction = (payload) => ({"type": "anotherAction", payload});
```

In your module, add an `actions()` method.

```js
import * as actions from "./actions";

actions() {
    return actions;
}

```

All exported functions from `actions.js`, namely `myAction` and `anotherAction` will be available to you from all components. All enhanced components receive an `action` prop. (*Enhancers* are explained elsewhere)

```js
export default class extends React.Component {
    render() {
        return (
            <button onClick={() => this.props.action("Test/anotherAction")("winner winner chicken dinner")}>
                Trigger Action
            </button>
        )
    }
};
```

-----

### Adding reducers to a module

Let us make a Redux reducer. `/src/modules/Test/reducer.js`

```js
import {createReducer} from "redux-immutablejs";
import {Map} from "immutable";

export default createReducer(Map(), {
    anotherAction: (state, data) => {
        return state.set('text', data.payload);
    }
});
```

In your module, add the `reducers()` method.

```js
import myReducer from "./reducer";

reducers() {
    return {test: myReducer}
}
```

-----

### Routes

In some situations, it might make sense to incorporate routes into a module. Especially for modules with a few routes (like user signup/login etc).

There's a few things you'll need to do to get it up and running.

##### 1. Inject module routes into your RR4 master `Switch` statement.

Somewhere in your app (most likely your entry component), you will have a RR4 `Switch` statement.

```js
import React from 'react'
import {enhancer} from "../chillifront/index";
import {Route, Switch} from "react-router";

const AboutPage = () => <div>About</div>;
const CowPage = () => <div>Moooo</div>;

export default class extends React.Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/about" component={enhancer(AboutPage)}/>
                    <Route path="/Moo" component={enhancer(CowPage)}/>
                    {this.props.routes}
                </Switch>
            </div>
        )
    }
};
```

##### 2. Using the `routes()` method in your module

```js
	import {Mod, enhancer} from "../../chillifront/index";
	// ...
	const FooComponent = () => <div>La la laaa</div>;
	// ...
    routes() {
        return [
            {
                path: "/foo",
                component: enhancer(FooComponent)
            }
        ]
    }
```

4 things to note here.

1. The `routes()` method returns an object that [react-router-config](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config) understands. `chillifront` will consolidate declared routes across all declared modules.
2. The entry point receives the `routes` prop, which you should place inside the `Switch` component.
3. Routes are evaluated in the order that you declare your modules.
4. The `enhancer` function is important. This is explained in another section.

-----

### Decorating/Enhancing all the things

#### (1) Wrapping your app

A fairly simplistic albiet impractical decorator, `/src/modules/Test/AppWrapper.js`

```js
export default (WrappedComponent) => class extends React.Component {
    render() {
        // Wrapping a red border around our app!
        return (
            <div style={{border: "5px solid red"}}>
                <WrappedComponent {...this.props} />
            </div>
        )
    }
}
```

In your module, add the `wrapApp()` method.

```js
import AppWrapper from "./AppWrapper";

wrapApp(){
    return AppWrapper;
}
```

*AppWrappers* provide a succinct way to 'gatekeep' the app. It's simply a higher-order function which encapsulates the app. For example, using `componentWillReceiveProps` you could detect a change in the current session and immediately push to a new url if the user has logged out. Or you could delay showing the interface until some external dependencies have fully initialised.

#### (2) Component enhancers

As well as being able to wrap your entire app. You can (and you should) wrap each component in a HOC which is created by `chillifront`. You may want to have a prop automatically available in every component, like user data for example.

Best to explain by example.

There is a module method available called `mapStateToProps()`. It will automatically connect to any 'enhanced' component. 

```js
mapStateToProps() {
    return (state) => ({
        "hello": "world"
    })
}
```

Let's create a route somewhere.

```js
import {enhancer} from "../chillifront";
...
<Route path="/hello" component={enhancer(Hello)}/>
```

Let's add it to a component:
```js
const Hello = ({hello}) => <div>props.hello = {hello}</div>;
// outputs <div>props.hello = world</div>
```

The `enhancer` function is a HOC created by `chillifront` which is aware of the entire module stack.

#### Adding custom functionality to a particular route.

You can add extra functionality to a route entrypoint like this.

```js
// Make route wait for 2 seconds before showing
<Route path="/hello" component={enhancer(Hello, ShowAfterTwoSecondsHOC)}/>
```

This is effectively the same as this:

```js
<Route path="/hello" component={compose(enhancer, ShowAfterTwoSecondsHOC)(Hello)}/>
```

And our HOC could look like this:

```js
const ShowAfterTwoSecondsHOC = WrappedComponent => class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {waiting: true};
        setTimeout(() => {
            this.setState({waiting: false})
        }, 2000);
    }

    render() {
        return (this.state.waiting === true) ?
            <div>Waiting 2 seconds before showing</div> :
            <WrappedComponent {...this.props} />
    }
};
```

A more practical example could be to prevent unauthorised users from accessing that route. Or perhaps you may want to show a spinner while state is being populated from an external source.

#### Adding store subscribers

If you need to subscribe to any Redux action listeners. That is, [store.subscribe](https://redux.js.org/docs/api/Store.html#subscribe), then we have the `storeSubscribe` method.

```js
storeSubscribe() {
    return store => () => {
        console.log("Store changed to", store.getState());
    }
}
```

A more practical example could be:

```js
import {Mod} from "../../chillifront/index";
import throttle from "lodash/throttle";
import {fromJS} from "immutable";

export default class PersistImmutableState extends Mod {

	storeSubscribe() {
        return store => throttle(() => {
            const state = store.getState();
            sessionStorage.setItem("reduxPersist", JSON.stringify(state.toJS()));
        }, 1000);
    }

    storeEnhancer() {
        return next => (reducer, initialState) => {
            const storage = sessionStorage.getItem("reduxPersist");
            const currentState = (storage !== null) ? fromJS(JSON.parse(storage)) : initialState;
            return next(reducer, currentState);
        }
    }
}
```

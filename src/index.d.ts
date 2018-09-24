/** Libraries */
import React from 'react';
import { History } from 'history';
import { Store, StoreEnhancer } from 'redux';

/** Interfaces */
export type Reducers = {
	[x: string]: (state: Object, action: { type: string; payload: any }) => any;
};

export interface Options {
	/** The history object to use instead of the internal default object. */
	useHistory?: History;
	/** Show logs to the console. Defaults to false. */
	debug?: boolean;
	/** Shows the redux store in the dev tools inspector. Defaults to true. */
	useDevTools?: boolean;
	/** Addtional reducers without the need to create a new Mod. */
	reducers: Reducers;
}

export type ConnectedComponentCreator = (component: React.ComponentType) => React.ComponentType;

export type StoreSubscriber = (store: Store) => any;

/** Base class for new Mods */
export class Mod {
	/**
	 * Constructor to initialise the Mod
	 * @param {Object} [options = {}] Any options/params who you'd like to make available to the Mod
	 * @param {Function[]} [enhancers = []] Any enhancers you'd like to attach to the Mod
	 */
	constructor(options?: Object, enhancers?: Function[]);

	/**
	 * Ensures that the Mod has a unique and
	 * is provided by the dev
	 */
	name(): string;

	/**
	 * Any additional options that you'd like
	 * to give to the Mod
	 */
	options(): Object;

	/**
	 * Any middleware that you'd want to
	 * use actions before they go to the store
	 */
	middleware(): Function;

	/**
	 * Your own custom reducers to handle your
	 * custom actions
	 */
	reducers(): Reducers;

	/**
	 * Store enhancer is a higher-order function
	 * that composes a store creator to return a
	 * new, enhanced store creator. This is similar
	 * to middleware in that it allows you to alter
	 * the store interface in a composable way.
	 */
	storeEnhancer(): StoreEnhancer;

	/**
	 * Registers your function to be called on state
	 * changes and then your function takes over
	 */
	storeSubscribe(): StoreSubscriber;

	/**
	 * This is just to create a wrapper around
	 * the whole app. Useful for cases like
	 * scroll to top, page view analytics, etc..
	 */
	wrapApp(): React.ComponentType;
}

export function getMod(name: string): Mod;

export default function chillifront(modules: Mod[], options: Options): ConnectedComponentCreator;

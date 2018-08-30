/** Libraries */
import React from 'react';
import { History } from 'history';

/** Interfaces */
interface Options {
	/** The history object to use instead of the internal default object. */
	useHistory?: History;
	/** Show logs to the console. Defaults to false. */
	debug?: boolean;
	/** Shows the redux store in the dev tools inspector. Defaults to true. */
	useDevTools?: boolean;
	/** Addtional reducers without the need to create a new Mod. */
	reducers: {
		[x: string]: (state: Object, action: { type: string; payload: any }) => any;
	};
}

type createConnectedComponent = (component: React.ComponentType) => React.ComponentType;

export class Mod {}

export function getMod(name: string): any;

export default function chillifront(modules: any[], options: Options): createConnectedComponent;

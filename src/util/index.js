import enumValue from './enumValue';

import { default as ACTIONS } from './actions';
import { default as EVENTS } from './events';
import {default as CONSTANTS } from './constants';
import {default as intersectionObserver} from './IntersectionObserver';

export const serializeFunction = (func) => (func.toString());
export const deserializeFunction = (funcString) => (new Function(`return ${funcString}`)());


export {enumValue, intersectionObserver, ACTIONS, EVENTS, CONSTANTS};

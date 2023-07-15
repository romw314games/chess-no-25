import { getLg } from './DebugRunContext';
import * as gameLogic from './gameLogic';

global.cfdlog ??= console.fdlog ??= (level, ...args) => {
	if (global.uselog && global.uselog >= level)
		console.log(...args);
};

console.dlog ??= (...args) => global.cdlog(...args);
global.cdlog ??= (logrun, ...args) => logrun(() => console.fdlog(...args));
global.cdlev ??= console.dlev ??= (...args) => (`useContext(DebugRunContext)(global.cfdlog(${args.map(x => x instanceof Function ? x.toString() : JSON.stringify(x)).join()}))`);

global.cadlog ??= console.adlog ??= (...args) => global.cdlog(getLg(), ...args);

global.chess = {
	gameLogic: gameLogic
};

const { fdlog, dlog, dlev, adlog } = console;

export { fdlog, dlog, dlev, adlog };

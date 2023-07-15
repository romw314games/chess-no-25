import { createContext } from 'react';

const DebugRunContext = createContext(() => {});

const altLg = {
	get: () => altLg.value,
	set: nv => altLg.value = nv,
	call: (...args) => altLg.get()(...args),
	value: () => {}
};

const { get, set, call } = altLg;

function DebugRunProvider({ children }) {
	return (
		<DebugRunContext.Provider value={get()}>
			{children}
		</DebugRunContext.Provider>
	);
}

export { DebugRunContext, altLg, call as logrun, get as getLg, set as setLg, DebugRunProvider };

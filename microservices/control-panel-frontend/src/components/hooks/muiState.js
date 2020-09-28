import { createMuiTheme } from '@material-ui/core';
import React, { createContext, useEffect, useReducer } from 'react';
const SET_PALETTE_TYPE = 'SET_PALETTE_TYPE';

export const setPaletteType = (type) => {
	return { type: SET_PALETTE_TYPE, payload: { type } };
};
const initialState = {
	palette: {
		primary: { main: '#048BA8' },
		secondary: { main: '#F18F01' },
		type: 'light',
	},
};

const reducer = (state, { type, payload }) => {
	switch (type) {
		case SET_PALETTE_TYPE:
			const { type } = payload;
			return {
				...state,
				palette: { ...state.palette, type },
			};

		default:
			throw new Error(JSON.stringify({ type, payload }, null, 2));
	}
};

const MuiCtx = createContext({
	theme: {},
	dispatch: () => null,
});

function MuiCtxProvider(props) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const theme = createMuiTheme(state);

	useEffect(() => {}, [state]);

	return (
		<MuiCtx.Provider value={{ theme, dispatch }}>
			{props.children}
		</MuiCtx.Provider>
	);
}

export { MuiCtxProvider, MuiCtx };

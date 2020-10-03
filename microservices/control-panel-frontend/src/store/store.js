import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { sensorsReducer } from './reducers/sensorsReducer';
import { controlsReducer } from './reducers/controls';
import { alertsReducer } from './reducers/alertsReducer';
import { schedulerReducer } from './reducers/scheduleReducer';

const rootReducer = combineReducers({
	alerts: alertsReducer,
	sensors: sensorsReducer,
	controls: controlsReducer,
	schedule: schedulerReducer,
});
export default function configureStore(preloadedState = {}) {
	const middlewares = [thunkMiddleware];

	const composedEnhancers = composeWithDevTools(
		applyMiddleware(...middlewares)
		// other store enhancers if any
	);

	const store = createStore(rootReducer, preloadedState, composedEnhancers);

	return store;
}

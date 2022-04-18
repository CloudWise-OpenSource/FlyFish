import T from 'utils/T';
import thunk from 'redux-thunk';
// import createLogger from 'redux-logger';

import { createStore as _createStore, applyMiddleware, combineReducers } from 'redux';

class Registry {
    constructor(baseReducers) {
        this._reducers = baseReducers;
    }

    store = null;

    injectReducers(reducers) {
        Object.assign(
            this._reducers,
            reducers.reduce((acc, reducer) => {
                acc[reducer.reducer] = reducer;
                return acc;
            }, {})
        );

        this.store.replaceReducer(combineReducers(this._reducers));
    }

    get initialReducers() {
        return combineReducers(this._reducers);
    }
}

export const STORE_INJECT = Symbol('@@STORE_INJECT');

function registryMiddleware(registry) {
    return store => next => action => {

        if (T.lodash.isPlainObject(action) && action.hasOwnProperty(STORE_INJECT)) {
            const { reducers } = action[STORE_INJECT];

            if (reducers) {

                registry.injectReducers(reducers);
            }

            return null;
        }

        return next(action);
    };
}


export default function createStore(initialState = {}) {
    const registry = new Registry({
        dummyReducer: (a = {}) => a
    });

    let finalCreateStore = applyMiddleware(...[registryMiddleware(registry), thunk]);

    // if we have redux devtools installed hook into it.
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
        finalCreateStore = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(finalCreateStore);
    }

    const store = finalCreateStore(_createStore)(
        registry.initialReducers,
        initialState
    );

    registry.store = store;

    return store;
}


import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';

export default function configureStore(initialState = {}) {

  const enhancers = [
    applyMiddleware(thunk),
  ]
  // applyMiddleware(RavenMiddleware(conf.ravenKey), thunk),

  const store = createStore(rootReducer, initialState, compose(...enhancers));

  // For hot reloading reducers
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers/index', () => {
      const nextReducer = require('./reducers/index').default; // eslint-disable-line global-require

      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

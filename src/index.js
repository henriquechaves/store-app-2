import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'

require('./assets/theme/style.default.css')
require('./assets/theme/grasp_mobile_progress_circle-1.0.0.min.css')

import App from './App'
import configureStore from './store'

const initialState = window.__INITIAL_STATE__

// Allow the passed state to be garbage-collected
delete window.__INITIAL_STATE__

const store = configureStore(initialState)

const mountApp = document.getElementById('root')

const renderApp = (App) => {
  render(
    <AppContainer>
      <BrowserRouter>
        <App store={store} />
      </BrowserRouter>
    </AppContainer>,
    mountApp
  );
}

renderApp(App);

if (module.hot) {
  module.hot.accept('./App', () => renderApp(App))
}

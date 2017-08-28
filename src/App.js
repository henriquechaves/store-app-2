// import 'jquery'
// import 'tether'
// import 'bootstrap/scss/bootstrap.scss'
//
// require('./assets/css/main.css')
//
//
//
import React from 'react'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
import { Route } from 'react-router-dom'
import { Provider } from 'react-redux'

// import { routes } from './routes'

export default function App(props) {
  return (
        <Provider store={props.store}>
          <div>App</div>
        </Provider>
  )
}
// {renderRoutes(routes)}

App.propTypes = { store: PropTypes.object.isRequired }

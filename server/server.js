import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { StaticRouter, matchPath } from 'react-router';
import { renderToString } from 'react-dom/server';
import expressValidator from 'express-validator';
import { Provider } from 'react-redux';
import compression from 'compression';
import bodyParser from 'body-parser';
import Helmet from 'react-helmet';
import Express from 'express';
import jwt from 'jsonwebtoken'
import webpack from 'webpack';
import React from 'react';
import path from 'path';

import { dummyDataToAlgolia } from './dummyDataToAlgolia';
import fetchComponentData from './hydrate/fetchData';
import configureStore from '../src/store';
import webpackConfig from '../webpack.config.dev';
import user from './routes/user.routes';
import { routes } from '../src/routes';
import config from './config';
import App from '../src/App';

// Initialize the Express App
const app = new Express();

// Run Webpack dev server in development mode
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }));
  app.use(webpackHotMiddleware(compiler));
}

// Apply body Parser and server public assets and routes
app.use(compression());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({
  limit: '20mb',
  extended: false,
}));
app.use(Express.static(path.resolve(__dirname, '../dist')));
app.use(expressValidator())
app.use('/user', user);

// Render Initial HTML
const renderFullPage = (html, initialState) => {
  const head = Helmet.rewind();

  // Import Manifests
  const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets);
  const chunkManifest = process.env.webpackChunkAssets && JSON.parse(process.env.webpackChunkAssets);

  return `
    <!doctype html>
    <html>
      <head>
        ${head.base.toString()}
        ${head.title.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}
        ${head.script.toString()}

        <link type="image/png" rel="shortcut icon" href="/favicon.ico" />
        ${process.env.NODE_ENV === 'production' ? `<link rel='stylesheet' href='${assetsManifest['/app.css']}' />` : ''}

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
        <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:300,400,500,700">

          <script src="https://use.fontawesome.com/99347ac47f.js"></script>
          <link href="https://use.fontawesome.com/99347ac47f.css" media="all" rel="stylesheet">
          <link rel="stylesheet" href="https://file.myfontastic.com/da58YPMQ7U5HY8Rb6UxkNf/icons.css">
      </head>
      <body>
        <div id="root"><div style="top:50%;left:50%;position:absolute;width:60px;height:60px;">Loading...<img src="/loading.gif"></div></div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\u003c')};
          ${process.env.NODE_ENV === 'production'
          ? `//<![CDATA[
          window.webpackManifest = ${JSON.stringify(chunkManifest)};
          //]]>` : ''}
        </script>
        <script src='${process.env.NODE_ENV === 'production' ? assetsManifest['/vendor.js'] : '/vendor.js'}'></script>
        <script src='${process.env.NODE_ENV === 'production' ? assetsManifest['/app.js'] : '/app.js'}'></script>

          <script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n" crossorigin="anonymous"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>

      </body>
    </html>
  `;
};

const renderError = (err) => {
  const softTab = '&#32;&#32;&#32;&#32;';
  const errTrace = process.env.NODE_ENV !== 'production'
    ? `:<br><br><pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>` : '';


  return renderFullPage(`Server Error${errTrace}`, {});
};

app.use((req, res, next) => {

  const token = req.headers //s.authorization && req.headers.authorization.split(' ')[1]) // || req.cookies.APP_TOKEN

  req.isAuthenticated = () => {
    const token = req.header('x-auth') //s.authorization && req.headers.authorization.split(' ')[1]) // || req.cookies.APP_TOKEN
    try {
      return jwt.verify(token, config.tokenSecret)
    } catch (err) {
      return false
    }
  }
  if (req.isAuthenticated()) {
    const payload = req.isAuthenticated()
    // user = finduser()
    // req.user = user
    next()
  } else {
    next()
  }
})

// Server Side Rendering based on routes matched by React-router.
app.get('/favicon.ico', (req, res) => res.sendFile(path.resolve(__dirname, '../src/assets/img/favicon.ico')));
app.get('/loading.gif', (req, res) => res.sendFile(path.resolve(__dirname, '../src/assets/img/loading.gif')));

app.use('/',(req, res, next) => {

  const token = req.headers

  const initialState = {
    user: {
       id: 0,
       type: '',
       token: '',
       email: '',
       message: '',
       comments: [],
       totalUsers: 0,
       myAffiliates: [],
       showActions: false,
    },
    products: {
      search: '',
      activePage: 1,
      data: [],
    },
  }

  const context = {}

  const store = configureStore(initialState)

  return fetchComponentData(store, routes, req.url)
    .then(() => {
      const initialView = renderToString(
            <Provider store={store}>
              <StaticRouter context={context} location={req.url}>
                <App store={store} />
              </StaticRouter>
            </Provider>
      )

      const finalState = store.getState();
      const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets);

      res
        .set('Content-Type', 'text/html')
        .status(200)
        .end(renderFullPage(initialView, finalState));
    })
    .catch(error => next(error));
});

// Start app

dummyDataToAlgolia().then(res => { console.log(res) })

app.listen(config.port, (error) => {
  if (!error) {
    console.log(`App is running on port: ${config.port}!`); // eslint-disable-line
  }
});

export default app;

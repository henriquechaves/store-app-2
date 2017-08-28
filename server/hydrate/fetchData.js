/*
Utility function to fetch required data for component to render in server side.
This was inspired from https://github.com/caljrimmer/isomorphic-redux-app/blob/73e6e7d43ccd41e2eb557a70be79cebc494ee54b/src/common/api/fetchComponentDataBeforeRender.js
*/
import { matchPath } from 'react-router-dom';
import { matchRoutes } from 'react-router-config'
import sequence from './promiseUtils';

export default function fetchComponentData(store, routes, location) {
  const matched = getComponents(routes, location)

  const needs = matched.components.reduce((prev, current) => {
    return (current.need || [])
      .concat((current.WrappedComponent && current.WrappedComponent.need !== current.need ? current.WrappedComponent.need : []) || [])
      .concat(prev)
  }, [])

  return sequence(needs, need => store.dispatch(need(matched.params, store.getState())))
}

function getComponents(routes, location) {
  let match, components = []

  const r = matchRoutes(routes, location, components )

  // console.log("==============================");
  components.map((m,i) => {
    // console.log("==============================");
    // console.log("match=======> ",i," : ", m.match.path);
    // console.log("==============================");
    // // console.log("route=======> ",i," : ", m.route.component);
    // console.log("==============================");
    return
  })
  // console.log("==============================");

  const res =  {
    components: components,
    params: match ? match.params : {},
  }

  return res
}

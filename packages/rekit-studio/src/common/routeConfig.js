import App from '../features/home/App';
import { PageNotFound } from '../features/common';
import homeRoute from '../features/home/route';
import commonRoute from '../features/common/route';
import rekitCmdsRoute from '../features/rekit-cmds/route';
import diagramRoute from '../features/diagram/route';
import rekitToolsRoute from '../features/rekit-tools/route';
import pluginRoute from '../features/plugin/route';
import configRoute from '../features/config/route';
import layoutRoute from '../features/layout/route';
import editorRoute from '../features/editor/route';
import pluginCraRoute from '../features/plugin-cra/route';
import coreRoute from '../features/core/route';
import defaultPluginRoute from '../features/default-plugin/route';

// NOTE: DO NOT CHANGE the 'childRoutes' name and the declaration pattern.
// This is used for Rekit cmds to register routes for new features, remove features, etc.
const childRoutes = [
  pluginCraRoute,
  homeRoute,
  commonRoute,
  rekitCmdsRoute,
  diagramRoute,
  rekitToolsRoute,
  pluginRoute,
  configRoute,
  layoutRoute,
  editorRoute,
  coreRoute,
  defaultPluginRoute,
];

const routes = [{
  path: '/',
  component: App,
  childRoutes: [
    ...childRoutes,
    { path: '*', name: 'Page not found', component: PageNotFound },
  ].filter(r => r.component || (r.childRoutes && r.childRoutes.length > 0)),
}];

function handleIndexRoute(route) {
  if (!route.childRoutes || !route.childRoutes.length) {
    return;
  }

  const indexRoute = route.childRoutes.find(child => child.isIndex);
  if (indexRoute) {
    const first = { ...indexRoute };
    first.path = route.path;
    first.exact = true;
    first.autoIndexRoute = true; // mark it so that the simple nav won't show it.
    route.childRoutes.unshift(first);
  }
  route.childRoutes.forEach(handleIndexRoute);
}

routes.forEach(handleIndexRoute);

export default routes;

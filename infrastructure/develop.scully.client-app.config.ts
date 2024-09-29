import {ScullyConfig} from '@scullyio/scully';

/** this loads the default render plugin, remove when switching to something else. */
import '@scullyio/scully-plugin-puppeteer';
import {getFlashPreventionPlugin} from '@scullyio/scully-plugin-flash-prevention';

export const config: ScullyConfig = {
  maxRenderThreads: 4,
  projectRoot: './src',
  projectName: 'client-app',
  // add spsModulePath when using de Scully Platform Server,
  outDir: '/firebase/develop/dist/static',
  distFolder: './firebase/develop/dist/client-app',
  defaultPostRenderers: [getFlashPreventionPlugin()],
  routes: {},
  extraRoutes: [
    '/pl/beeoclock',
    '/en/beeoclock',
    '/uk/beeoclock',
    '/da/beeoclock',
  ],
};

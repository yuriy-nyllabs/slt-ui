import { asyncComponent } from 'react-async-component';

export default asyncComponent({
  /* webpackChunkName: "Switch" */
  resolve: () => import('./Switch')
});
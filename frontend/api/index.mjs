import { createServerAdapter } from '@whatwg-node/server';
import server from '../dist/server/index.js';

export default createServerAdapter((request) => {
  return server.fetch(request);
});

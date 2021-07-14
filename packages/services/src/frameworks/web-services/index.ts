import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import { gateways } from '../../gateways/index.js';
import { getConnection } from '../../services/databases/postgres.js';
import { services } from './services/index.js';

export const bootstrap = (): void => {
  const app = fastify({
    logger: true
  });

  app.register(fastifyCors);

  const connection = getConnection();

  const gateway = gateways(connection);

  services.forEach((s) => app.route(s(gateway)));

  // Need to listen in on 0.0.0.0 for docker
  app.listen(process.env.PORT, '0.0.0.0', (error, address) => {
    if (error) {
      console.log(error);
      process.exit(1);
    }
    console.log(`server listening on ${address}`);
  });
};

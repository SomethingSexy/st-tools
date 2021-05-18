import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import { chronicleGateway } from '../../gateways/chronicle/postgres/index.js';
import { getConnection } from '../../services/databases/postgres.js';
import { services } from './services/index.js';

export const bootstrap = () => {
  const app = fastify({
    logger: true
  });

  app.register(fastifyCors);

  const connection = getConnection();
  // TODO: Once we expand the gateways we will want to have a way to group them
  const gateway = chronicleGateway(connection);

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

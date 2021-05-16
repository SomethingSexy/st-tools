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

  services.forEach((s) => app.route(s(chronicleGateway(connection))));

  // Need to listen in on 0.0.0.0 for docker
  app.listen(process.env.PORT, '0.0.0.0', (error, address) => {
    if (error) {
      console.log(error);
      process.exit(1);
    }
    console.log(`server listening on ${address}`);
  });
};

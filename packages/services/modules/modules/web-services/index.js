import fastify from 'fastify';
import { getConnection } from '../../services/databases/postgres.js';
export const bootstrap = ()=>{
    const app = fastify({
        logger: true
    });
    const connection = getConnection();
    app.route({
        method: 'GET',
        url: '/',
        handler: async (request, reply)=>{
            console.log('foo');
            return reply.send('foo');
        }
    });
    // services.forEach(s => app.route(s(chronicleGateway(connection))));
    app.listen(5000, (error, address)=>{
        if (error) {
            console.log(error);
            process.exit(1);
        }
        console.log(`server listening on ${address}`);
    });
};

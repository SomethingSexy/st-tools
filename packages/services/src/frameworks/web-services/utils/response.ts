import { FastifyReply } from 'fastify';
import { FutureInstance, fork } from 'fluture';

export const handleResult =
  (reply: FastifyReply) =>
  <L, R>(result: FutureInstance<L, R>) => {
    fork((e) => reply.status(400).send(e))((r) => reply.status(200).send(r))(result);
  };

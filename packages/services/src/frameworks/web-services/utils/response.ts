import { FutureInstance, fork } from 'fluture';
import { FastifyReply } from 'fastify';

export const handleResult =
  (reply: FastifyReply) =>
  <L, R>(result: FutureInstance<L, R>): void => {
    fork((e) => reply.status(400).send(e))((r) => reply.status(200).send(r))(result);
  };

import express from 'express';

interface BootOptions {
  logger?: Pick<Console, 'error' | 'warn' | 'info' | 'debug'>;
  port: number;
}

/**
 * Boots an express app asynchronously
 */
export async function boot(
  {logger = console, port}: BootOptions,
  app: express.Application
) {
  app = await Promise.resolve(app);

  const server = app.listen(port, () => {
    const address = server.address();
    if (!address) {
      logger.warn(
        'server seems to be listening but did not produce any address info'
      );
      return;
    }
    if (typeof address === 'string') {
      logger.info(`Server listening at ${address}`);
    } else {
      logger.info(`Server listening port ${address.port} ${address.address}`);
    }
  });

  return server;
}

interface prepareCallback {
  (app: express.Application): Promise<void>;
}

/**
 * Prepares an express app asynchronously
 */
export async function prepare(
  cb: prepareCallback
): Promise<express.Application> {
  const app = express();
  await cb(app);
  return app;
}

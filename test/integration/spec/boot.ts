import {Server} from 'http';

import supertest from 'supertest';

import {boot, prepare} from '../../../src';

const PORT = Number(process.env.PORT || 3000);

// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.spyOn(global.console, 'info').mockImplementation(() => {});
// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.spyOn(global.console, 'warn').mockImplementation(() => {});

describe('boot', () => {
  function createApp() {
    return prepare(async (app) => {
      app.get('/ping', (req, res) => {
        res.send('It Works!');
      });
    });
  }

  let server: Server;
  beforeAll(async () => {
    server = await boot({logger: console, port: PORT}, createApp());
  });

  afterAll(() => {
    return new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  it('asynchronously boots an app', () => {
    return supertest(`http://localhost:${PORT}`)
      .get('/ping')
      .expect(200)
      .expect('It Works!');
  });
});

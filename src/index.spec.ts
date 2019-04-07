import supertest from 'supertest';

import {prepare} from '.';

describe('prepare', () => {
  function createApp() {
    return prepare(async (app) => {
      app.get('/ping', (req, res) => {
        res.send('It Works!');
      });
    });
  }

  it('asynchronously prepares an app', async () =>
    supertest(await createApp())
      .get('/ping')
      .expect(200)
      .expect('It Works!'));
});

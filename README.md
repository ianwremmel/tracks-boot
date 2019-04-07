# tracks-boot _(@ianwremmel/tracks-boot)_

<!-- (optional) Put banner here -->

<!-- PROJ: Badges Start -->

[![license](https://img.shields.io/github/license/ianwremmel/tracks-boot.svg)](https://github.com/ianwremmel/tracks-boot/blob/master/LICENSE)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![npm (scoped)](https://img.shields.io/npm/v/@ianwremmel/tracks-boot.svg)](https://www.npmjs.com/package/@ianwremmel/tracks-boot)
[![npm](https://img.shields.io/npm/dm/@ianwremmel/tracks-boot.svg)](https://www.npmjs.com/package/@ianwremmel/tracks-boot)

[![Dependabot badge](https://img.shields.io/badge/Dependabot-active-brightgreen.svg)](https://dependabot.com/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![CircleCI](https://circleci.com/gh/ianwremmel/tracks-boot.svg?style=svg)](https://circleci.com/gh/ianwremmel/tracks-boot)

<!-- PROJ: Badges End -->

> @ianwremmel/tracks-boot is a tiny module to start Express apps asynchronously

Most tutorials for Express show how to get up and running quickly with a
synchronous example. Unfortunately, the reality is that sometimes we need to do
async work before we can start listening for connections. Maybe we need to load
config from a file or wait for database connections. Maybe we're pulling config
from a remote store like Consul. In any case, it can get pretty clunky. This
module aims to streamline that clunkiness as much as possible.

## Table of Contents

<!-- toc -->
<!-- tocstop -->

## Install

```bash
npm install @ianwremmel/tracks-boot
```

## Usage

tracks-boot exports two functions, `prepare` for doing all of the async work of
preparing your application and `boot` for binding it to a port. These are
separate functions so that you can use e.g. supertest against a prepare app
without needing to test over http.

First, import tracks boot

```js
import {boot, prepare} from './lib/boot';
```

Next, create your app factory (yes, I said "factory"; it's not that bad. it's
just a function).

```js
export function createApp() {
    return prepare(async (app) => {
        // do all of your normal app setup here. add middleware, routes, etc.
        app.get('/ping', (req, res) => {
            res.send('It Works!');
        });

        // This is an async function, so you can use await anywhere you need to.
    });
}
```

Now, define your boot behavior. You could put this in the same file as your app
factory and rely on testing `require.main === module` to only start the app when
appropriate or you could use a separate file. The example below assumes
everything goes in the same file. This example just confirms the environment is
set correctly to bind to a port. (I recommend doing most other env-var checking
in the app factory rather than here. `PORT` is checked here because it's
explicitly needed by `boot()`).

```js
if (require.main === module) {
    if (!process.env.PORT) {
        throw new Error('PORT is not defined');
    }

    const port = Number(process.env.PORT);

    if (Number.isNaN(port)) {
        throw new Error('PORT must be a number');
    }

    // we'll just pass console as our logger, but if you're using something more
    // complex like bunyan, that's fine too. Just make sure it implements
    // `info: (arg: string) => void`
    boot({logger: console, port}, create());
}
```

Finally, we can use supertest to test our app without binding it to a port

```js
import {createApp} from '.';

it('responds to pings', async () =>
    supertest(await createApp())
        .get('/api/v1/healthcheck')
        .expect(200)
        .expect('It Works!'));
```

## Maintainer

[Ian Remmel](https://github.com/ianwremmel)

## Contribute

PRs Welcome

## License

[MIT](LICENSE) &copy; [Ian Remmel](https://github.com/ianwremmel) 2019 until at
least now

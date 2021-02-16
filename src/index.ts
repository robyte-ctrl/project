import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { getLogger } from 'log4js';

import { initConfig } from './config';
import { initRootValue, initSchema } from './graphql';
import { setupLogger } from './logger';
import { UserRepository } from './user.repository';

function main(): void {
  const config = initConfig();

  setupLogger(config.get('log'));

  const logger = getLogger();

  const userRepository = new UserRepository([
    { id: 1, name: 'user', email: 'user@email.mail' },
    { id: 2, name: 'admin', email: 'admin@email.mail' },
  ]);

  const app = express();

  const graphqlMiddleware = graphqlHTTP({
    schema: initSchema(),
    rootValue: initRootValue(userRepository),
    graphiql: { headerEditorEnabled: true },
  });

  // NOTE(roman): no idea what `Promise` eslint found here
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.use('/graphql', graphqlMiddleware);

  const port = config.get('port');

  app.listen(port, () => { logger.info(`project listening on port ${ port }`); });
}

main();

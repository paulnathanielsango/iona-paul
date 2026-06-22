import 'server-only';

import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ClientBuilder } from '@commercetools/ts-client';
import { ctEnv } from './env';

function buildClient() {
  return new ClientBuilder()
    .withProjectKey(ctEnv.projectKey)
    .withClientCredentialsFlow({
      host: ctEnv.authUrl,
      projectKey: ctEnv.projectKey,
      credentials: {
        clientId: ctEnv.clientId,
        clientSecret: ctEnv.clientSecret,
      },
      scopes: ctEnv.scopes ? [ctEnv.scopes] : [],
    })
    .withHttpMiddleware({ host: ctEnv.apiUrl })
    .build();
}

export const apiRoot = createApiBuilderFromCtpClient(buildClient()).withProjectKey({
  projectKey: ctEnv.projectKey,
});

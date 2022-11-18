import { Endpoint } from 'src/models';

export const baseEndpoint = 'api/v1';

export const generateEndpoint = (endpoint: Endpoint) =>
  `${baseEndpoint}/${endpoint}`;

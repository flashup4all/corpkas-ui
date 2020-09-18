import { ApolloClient, InMemoryCache } from '@apollo/client';
import {environment} from '../env/env';
export const createApolloClient = new ApolloClient({
      uri: environment.url,
      cache: new InMemoryCache()
    });
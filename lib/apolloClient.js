import { ApolloClient, InMemoryCache } from '@apollo/client';
import {environment} from '../env/env';
export const createApolloClient = new ApolloClient({
      uri: environment.url,
      // uri: 'https://stimulating-grandiose-asiaticlesserfreshwaterclam.gigalixirapp.com/api/graphql',
      cache: new InMemoryCache()
    });
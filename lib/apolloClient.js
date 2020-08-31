import { ApolloClient, InMemoryCache } from '@apollo/client';

export const createApolloClient = new ApolloClient({
      // uri: 'http://localhost:4000/api/graphql',
      uri: 'https://stimulating-grandiose-asiaticlesserfreshwaterclam.gigalixirapp.com/api/graphql',
      cache: new InMemoryCache()
    });
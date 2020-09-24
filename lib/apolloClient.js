import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createLink } from "apollo-absinthe-upload-link";
import {environment} from '../env/env';
export const createApolloClient = new ApolloClient({
      link:  createLink({
        uri: environment.url,
    }),
      
      cache: new InMemoryCache()
    });
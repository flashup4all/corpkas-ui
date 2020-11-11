import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloLink } from 'apollo-link';
import { onError } from "apollo-link-error";
import { createLink } from "apollo-absinthe-upload-link";
import {environment} from '../env/env';
import { ToastProvider, AddToast } from 'react-toast-notifications'
import swal from '@sweetalert/with-react'

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path, details }) =>{
      if(details)
      {
        for (const [key, value] of Object.entries(details)) {
          swal(`${message} \n ${value}`, {
            icon: "error",
        });
          // console.log(`${key}: ${value}`);
        }
      }
        // console.log(`Error: ${message}`,)
        // toast
        // swal(`${message}`, {
        //   icon: "error",
        // });
    }
      
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});
const httpLink = createLink({ uri: environment.url, errorLink })
const link = ApolloLink.from([
  errorLink,
  httpLink,
]);
export const createApolloClient = new ApolloClient(
  {
    link,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'ignore',
    }
  },
      
      cache: new InMemoryCache()
    });
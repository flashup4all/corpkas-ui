import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastProvider } from 'react-toast-notifications'
import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from '../lib/apolloClient'
import '../styles/globals.css'


// const createApolloClient = new ApolloClient({
//     // uri: 'http://localhost:4000/api/graphql',
//     uri: 'https://stimulating-grandiose-asiaticlesserfreshwaterclam.gigalixirapp.com/api/graphql',
//     cache: new InMemoryCache()
//   });


function MyApp({ Component, pageProps }) {
 const Layout = Component.layout || EmptyLayout
  // return <Component {...pageProps} />

  return (
    <ApolloProvider client={createApolloClient}>
      <ToastProvider>
      <Layout>
      <Component {...pageProps} />
    </Layout>
    </ToastProvider>
    </ApolloProvider>
  );

}
const EmptyLayout = ({children}) => <>{children}</>

export default MyApp

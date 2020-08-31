import 'bootstrap/dist/css/bootstrap.min.css';
import { ApolloProvider } from '@apollo/client';
import AdminMainLayout from '../components/layouts/main/main';
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
      <Layout>
    {/* <AdminMainLayout> */}
      <Component {...pageProps} />
    {/* </AdminMainLayout> */}
    </Layout>
    </ApolloProvider>
  );

}
const EmptyLayout = ({children}) => <>{children}</>

export default MyApp

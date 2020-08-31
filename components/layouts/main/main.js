import Head from 'next/head';
import Adminheader from '../../header/admin_header';
import SideBarNav from '../../sidebar/sidebar-nav';

const AdminMainLayout = ({ children }) => (
  <div className="d-flex" id="wrapper">
    <Head>
      <title>KASU MPCS</title>
      <link rel="icon" href="/favicon.ico" />
      <script src="https://unpkg.com/pace-js@1.0.2/pace.min.js"></script>
    </Head>
    <SideBarNav />
    <div id="page-content-wrapper">
    
    <Adminheader/>
    <div className="container-fluid mb-5">
      <br></br>
      <div className="content-wrapper mt-5">{children}</div>
    </div>
    </div>
    

    

    <style jsx global>{`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
     
    `}</style>
  </div>
  
);

export default AdminMainLayout;
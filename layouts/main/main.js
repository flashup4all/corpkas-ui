import Head from 'next/head';
import Adminheader from '../header/admin_header';
import SideBarNav from '../sidebar/sidebar-nav';
import {clearStorage, getVendor, getUser, getStaff, getMember} from '../../components/shared/local'
import { useState, useEffect, setState, withState } from 'react';

function AdminMainLayout ({ children }){

  return(<div className="d-flex" id="wrapper">
    <Head>
      <title>KASU MPCS</title>
      <link rel="icon" href="/favicon.ico" />
      <script src="https://unpkg.com/pace-js@1.0.2/pace.min.js"></script>
    </Head>
    <SideBarNav />
    <div id="page-content-wrapper">
    
    <Adminheader />
    <div className="container-fluid mb-4 ks-pages0container">
      <br></br>
      <div className="content-wrapper layout mt-1 ">{children}</div>
    </div>
    </div>
    

    

    <style jsx global>{`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
      .layout{
        padding-left: 16px;
        padding-right: 24px;
      }
     
    `}</style>
  </div>
  );
}

export default AdminMainLayout;
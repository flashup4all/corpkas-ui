import React, { useState, useEffect } from 'react'
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import {useRouter}  from 'next/router';
import Spinner from '@atlaskit/spinner';
import { LOGIN } from '../gql/user'
import { storeToken, storeUser, storeVendor, storeStaff, storeMember} from '../components/shared/local';

const LoginForm = ({ setError, setToken }) =>{
    const router = useRouter()

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [formLoader, setFormLoader] = useState(false)

  const [ authenticate, { loading, error } ] = useMutation(LOGIN, {
    onError: (error) => {
    //   setError(error.graphQLErrors[0].message)
    },
    onCompleted({authenticate}){
      const token = authenticate.token
      const user = authenticate.user
      const vendor = authenticate.vendor
      storeToken(token)
      storeUser(user)
      storeVendor(vendor)
      
      if(user.role === "member")
      {
          const member = authenticate.member
          storeMember(member)
          setFormLoader(false)
          router.push('/members-app')
      }
      if(user.role === "admin" || user.role === "staff" || user.role === "manager")
      {
          const staff = authenticate.staff
          storeStaff(staff)
          setFormLoader(false)
          router.push('/dashboard')
      }
    }

  })

  // useEffect(() => {
  //   if ( result.data ) {
  //       console.log(result)
  //     
      
  //     //   setToken(token)
  //       
  //   }
  // }, [result.data]) 

  const submit = async (event) => {
    event.preventDefault()
    setFormLoader(true)
    authenticate({ variables: { email, password } })
  }

  return (
    <>
    <div className="container-fluid px-0">
        <nav className="page-nav fixed-top">
            <h1 className="nav-h1 my-0">KASU CORPERATIVE</h1>
        </nav>
        <section className="section-one">
            <header className="page-header row">
                <div className="col-lg-7">
                    <h1 className="page-heading mb-0"><span style={{color: "#0081FF"}}>Welcome</span> to KASU
                    </h1>
                    <h1 className="page-heading">Multipurpose Corperative Society.</h1>
                    <p className="page-para">Kaduna State Univeristy Multipurpose coorperative society, consectetur adipiscing elit. Sed augue sit mauris
                        molestie vulputate
                        etiam
                        ornare tincidunt porttitor. Eu dolor e praesent e. Lorem ipsum dolor sit amet, consectetur </p>

                    <a href="#services" className="service-link">Our
                        Services</a>
                </div>
                <div className="col-lg-5">
                    <form className="form" onSubmit={submit}>
                        <h2 className="form-heading">Welcome back.</h2>
                        <p className="form-oara">Quickly Login to continue to your dashboard</p>
                        <div className="form-group">
                            <label className="form-label">User Name</label>
                            <input className="form-control"
                            type="text"
                            value={email || ""}
                            onChange={({ target }) => setEmail(target.value)}
                             placeholder="KS22918" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input 
                            type='password'
                            value={password || ""}
                            onChange={({ target }) => setPassword(target.value)}
                            className="form-control"
                                placeholder="**********" />
                        </div>
                        <p><a href="#" className="forgot-pw">Forgot password?</a></p>
                        <button disabled={loading} type="submit" className="btn btn-lg btn-block btn-primary" style={{fontSize: "16px", color: "#fff"}}>
                          {
                            formLoader &&
                            <Spinner appearance="invert" size="medium"/>
                          }
                          Login Now</button>
                    </form>
                </div>

            </header>
        </section>
        <section className="section-two" id="services">
            <div className="text-center pb-5">
                <h2 className="service-h2">Services We Offer</h2>
                <p className="blue-border"></p>
            </div>

            <div className="row pt-3">
                <div className="col-lg-4">
                    <img src="./images/coin_img.png" alt="" className="img-fluid" />
                    <h3 className="h3">Loan Applications</h3>
                    <p className="page-para">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed augue sit mauris
                        molestie vulputate
                        etiam ornare tincidunt porttitor. Eu dolor e praesent e. Lorem ipsum dolor sit amet, consectetur
                    </p>
                </div>
                <div className="col-lg-4">
                    <img src="./images/coin_img.png" alt=""  className="img-fluid" />
                    <h3 className="h3">Savings and Withdrawals</h3>
                    <p className="page-para">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed augue sit mauris
                        molestie vulputate
                        etiam ornare tincidunt porttitor. Eu dolor e praesent e. Lorem ipsum dolor sit amet, consectetur
                    </p>
                </div>
                <div className="col-lg-4">
                    <img src="./images/coin_img.png" alt=""  className="img-fluid" />
                    <h3 className="h3">Investment Opportunities</h3>
                    <p className="page-para">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed augue sit mauris
                        molestie vulputate
                        etiam ornare tincidunt porttitor. Eu dolor e praesent e. Lorem ipsum dolor sit amet, consectetur
                    </p>
                </div>
            </div>
        </section>
        <footer className="page-footer py-5">
            <p className="footer-para mb-0"> Copyright © 2020 <span style={{color: "#0081FF"}} className="px-1">Kasu Cooperative.
                </span> All rights reserved</p>
        </footer>
        </div>
    </>
  )
}
export default LoginForm;



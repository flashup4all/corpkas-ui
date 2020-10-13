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
      }
      if(user.role === "admin" || user.role === "staff" || user.role === "manager")
      {
          const staff = authenticate.staff
          storeStaff(staff)
      }
      setFormLoader(false)
      // setTimeout(() => {
      router.push('/dashboard')
      // }, 500);
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
    <div className="container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card card-signin my-5">
            <div className="card-body">
              <h5 className="card-title text-center">Sign In</h5>
              <form className="form-signin" onSubmit={submit}>
                  <div className="form-label-group">
                  <label htmlFor="inputEmail">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      value={email || ""}
                      onChange={({ target }) => setEmail(target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="inputEmail">Password</label>
                    <input
                      className="form-control"
                      type='password'
                      value={password || ""}
                      onChange={({ target }) => setPassword(target.value)}
                    />
                      </div>
                  <button disabled={loading} className="btn btn-md btn-primary btn-block text-uppercase" type='submit'>
                      {
                        formLoader &&
                        <Spinner appearance="invert" size="medium"/>
                      }
                     <span className="ml-2" >login</span>
                     </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm;



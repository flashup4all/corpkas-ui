import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client';
import {useRouter}  from 'next/router';
import Spinner from '@atlaskit/spinner';
import { LOGIN } from '../../gql/user'

const LoginForm = ({ setError, setToken }) =>{
    const router = useRouter()

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  const [ authenticate, { loading, error } ] = useMutation(LOGIN, {
    onError: (error) => {
        console.log(error)
    //   setError(error.graphQLErrors[0].message)
    },
    onCompleted({authenticate}){
      const token = authenticate.token
      const user = authenticate.user
      localStorage.setItem('katk', token)
      localStorage.setItem('kutk', JSON.stringify(user))
      if(user.role === "member")
      {
          const member = authenticate.member
          localStorage.setItem('kmtk', JSON.stringify(member))
      }
      if(user.role === "admin" || user.role === "staff" || user.role === "manager")
      {
          const staff = authenticate.staff
          localStorage.setItem('kstk', JSON.stringify(staff))
          // setTimeout(() => {
          // }, 500);
      }
      setTimeout(() => {
          router.push('/dashboard')
      }, 200);
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
                    <input
                      className="form-control"
                      type="email"
                      value={email || ""}
                      onChange={({ target }) => setEmail(target.value)}
                    />
                    <label htmlFor="inputEmail">Email</label>
                  </div>
                  <div>
                    <input
                      className="form-control"
                      type='password'
                      value={password || ""}
                      onChange={({ target }) => setPassword(target.value)}
                    />
    
                    <label htmlFor="inputEmail" onClick={()=> router.push('/posts')}>Password</label>
                  </div>
                  <button disabled={loading} className="btn btn-md btn-primary btn-block text-uppercase" type='submit'>
                      {
                        loading &&
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



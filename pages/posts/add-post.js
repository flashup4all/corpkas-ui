import { gql, useMutation } from '@apollo/client';
import AdminMainLayout from '../../layouts/main/main';
import Link from 'next/link'

// const ADD_TODO = gql`
//   mutation authenticate($type: String!) {
//     authenticate(auth: {
//         email: "admin1@kasumpcs.com",
//         password: "root123",
//       }){
        
//           token
//             user{
//             id
//             email
//             role
//           }
        
//       }
//   }
// `;

// function AddPost () {
//     let input;
//   const [addTodo, { data }] = useMutation(ADD_TODO);

//   return (
//     <div>
//       <form
//         onSubmit={e => {
//           e.preventDefault();
//           addTodo({ variables: { type: input.value } });
//           input.value = '';
//         }}
//       >
//         <input
//           ref={node => {
//             input = node;
//           }}
//         />
//         <button type="submit">Add Todo</button>
//       </form>
//     </div>
//   );
// }

// export default AddPost

import React, { useState, useEffect } from 'react'
// import { LOGIN } from '../queries'
const ADD_TODO = gql`
  mutation authenticate($email: String!, $password: String!) {
    authenticate(auth: {
        email: $email,
        password: $password,
      }){
        
          token
            user{
            id
            email
            role
          }
        
      }
  }
`;


const LoginForm = ({ setError, setToken }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(ADD_TODO, {
    onError: (error) => {
        console.log(error)
    //   setError(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if ( result.data ) {
        console.log(result.data.authenticate)
      const token = result.data.authenticate.token
      const user = result.data.authenticate.user
    //   setToken(token)
      localStorage.setItem('katk', token)
      localStorage.setItem('kutk', JSON.stringify(user))
    }
  }, [result.data]) // eslint-disable-line

  const submit = async (event) => {
    event.preventDefault()
    console.log(email)
    console.log(password)
    login({ variables: { email, password } })
  }

  return (
    <div>
        Read <Link href="/posts"><a>this post!</a></Link>
        Read <Link href="/auth"><a>this post!</a></Link>
      <form onSubmit={submit}>
        <div>
          email <input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

// LoginForm.layout = AdminMainLayout
export default LoginForm
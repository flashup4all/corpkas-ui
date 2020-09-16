import React from "react"
import Link from 'next/link'
import { useQuery, gql } from '@apollo/client';
import AdminMainLayout from '../../layouts/main/main';

import { USERS } from '../../gql/user'

function FirstPost () {
    const { loading, error, data } = useQuery(USERS);
    if (error) return <div><h1>Error</h1></div>;
    if (loading) return <div>Loading...</div>;


    return ( 
      
      <div>
        <h1>First Post here</h1>
        <Link href="/"><a>this post!</a></Link>
        <br></br>
        <Link href="/posts/add-post"><a>add post!</a></Link>
        <div>
                {data.users.map((data) => (
                    <ul key={data.id}>
                        <li>{data.email}</li>
                        <li>{data.role}</li>
                    </ul>
                ))}
            </div>
      </div>
  
        )
  }
    
FirstPost.layout = AdminMainLayout
export default FirstPost;
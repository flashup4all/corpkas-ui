import React, { Component } from 'react';
import { useQuery, gql } from '@apollo/client';
import { createApolloClient } from '../../lib/apolloClient'
import EmptyData from '../../components/empty';

// import styled from 'styled-components';
import Link from 'next/link';
import { GET_MEMBERS } from '../../gql/members';

class ManageMembers extends Component {
    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            members: [],
            setMode: 1
        }
        console.log(this.state)
    }

    componentDidMount()
    {
        // const { loading, error, m_data } = useQuery(GET_MEMBERS);
        this.getMembers()
        
    // if (error) return <div><h1>Error</h1></div>;
    // if (loading) return <div>Loading...</div>;
    }

    getMembers(page = 0)
    {
        createApolloClient.query({
            query: GET_MEMBERS
          }).then(response => {
              console.log(response.data.members)
              this.setState({members: response.data.members})
            }, error => console.log(error))
    }
    

    render () {
        const filterMembers = (status = "") => {
            let membersData = [];
            if(status != "")
            {
                membersData = data.filter(x => x.status === status)
            }else{
                membersData = data
            }
            this.setState({membersData: membersData})
            console.log(membersData)
        }
    const {members, setMode} = this.state
    return (
        <div>
        {setMode === 0 &&
             <div className="bg-grey">
             <div className="search-con mb-4">
                 <input type="search" name="search" className="mini-search" placeholder="Search"></input>
                 <button type="button" onClick={()=> this.setState({setMode: 1})}>Search</button>
             </div>
             <div className="table-responsive p-3">
                 { members.length > 0 &&
                 <table className="table">
                 <thead>
                 <tr>
                     <th>&#x23;</th>
                     <th>Name</th>
                     <th>Rank</th>
                     <th>Gender</th>
                     <th>Department</th>
                     <th>Total Balance(₦)</th>
                     <th>Phone number</th>
                     <th>Status</th>
                     <th>Actions</th>
                 </tr>
                 </thead>
                 <tbody>
                 { members.map((member, index) => (
                 <tr key={index}>
                     <td>{index + 1}</td>
                     <td>{member.surname} {member.other_names}</td>
                     <td>{member.rank}</td>
                     <td>{member.gender}</td>
                     <td>{member.dept}</td>
                     <td>{member.current_balance}</td>
                     <td>{member.phone_number}</td>
                     <td className={member.status}>{member.status}</td>
                     <td>View</td>
                     <td>...</td>
                 </tr>
                  ))}
                
                 </tbody>
             </table>
                 }
                 {!members.length && 
                     <EmptyData />
                 } 
             
             </div>
         </div>
        }
        {
            setMode === 1 &&

            <div>create page</div>
        }
            {/* <StyledMain> */}
            <div className="col-12">
                <input className="ks-form-control form-control" />
            </div>
           
            {/* </StyledMain> */}
        </div>
    )
}
};

export default ManageMembers;
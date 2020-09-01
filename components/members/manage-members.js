import React, { Component } from 'react';
import { useQuery, gql } from '@apollo/client';
import { createApolloClient } from '../../lib/apolloClient'
import WatchIcon from '@atlaskit/icon/glyph/watch';
import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import Dropdown from 'react-bootstrap/Dropdown'
import EmptyData from '../../components/empty';
import Loader from '../../components/loader';
import Pagination from '@atlaskit/pagination';
// import styled from 'styled-components';
import Link from 'next/link';
import { GET_MEMBERS } from '../../gql/members';

class ManageMembers extends Component {
    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            members: [],
            setMode: 0
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

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
          href=""
          ref={ref}
          onClick={(e) => {
            e.preventDefault();
            onClick(e);
          }}
        >
            <EditorMoreIcon />
          {children}
        </a>
      ));
      const paginate = (e, page, analyticsEvent) => {
        console.log(e)
        console.log(page)
        console.log(analyticsEvent)
      }
    return (
        <div>
        {setMode === 0 &&
             <div className="bg-grey">
             <div className="search-con mb-4">
                 <input type="search" name="search" className="mini-search ks-form-control" placeholder="Search"></input>
                 <button type="button" className="btn" onClick={()=> this.setState({setMode: 1})}>Search</button>
             </div>
             <div className="table-responsive p-3">
                 { members.length > 0 &&
                 <div>
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
                     <td><WatchIcon size="small"/> View
                     <Dropdown className="drop-link">
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="ks-menu-dropdown bg-menu">
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.push('vendor-profile')}>Manage</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.push('posts')}>Reset Login Details</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.push('manage-members')}>Send Statement</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.push('vendor-profile')}>Deactivate</Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown>
                     </td>
                 </tr>
                  ))}
                
                 </tbody>
             </table>
                <div className="row align-items-center justify-content-center">
                <Pagination onChange={(event, page, analyticsEvent) => paginate(event, page, analyticsEvent)} pages={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
                </div>
             </div>
                 }
                 { members && !members.length && 
                     <EmptyData title="Empty Members" text="No Available Members Data"/>
                 } 
                 { !members
                     &&
                    <Loader />
                 }
             
             </div>
         </div>
        }
        {
            setMode === 1 &&

            <div>
                create page
                <div className="col-12">
                    <input className="ks-form-control form-control" />
                </div>
            </div>
        }
            {/* <StyledMain> */}
            
           
            {/* </StyledMain> */}
        </div>
    )
}
};

export default ManageMembers;

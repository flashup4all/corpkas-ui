import React, { Component } from 'react';
import { useQuery, gql } from '@apollo/client';
import { createApolloClient } from '../../lib/apolloClient'
import WatchIcon from '@atlaskit/icon/glyph/watch';
import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import PeopleGroupIcon from '@atlaskit/icon/glyph/people-group';
import PersonWithTickIcon from '@atlaskit/icon/glyph/person-with-tick';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';

import Dropdown from 'react-bootstrap/Dropdown'
import EmptyData from '../../layouts/empty';
import Loader from '../../layouts/loader';
import Pagination from '@atlaskit/pagination';
import { GET_MEMBERS } from '../../gql/members';
import { CustomToggle, Status } from '../../layouts/extras'
import CreateMember from './create-member'

class ManageMembers extends Component {
    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            members: [],
            sorted: [],
            setMode: 0,
            activeWidget: ''
        }
    }

    componentDidMount()
    {
        this.getMembers()
    }

    getMembers(page = 0)
    {
        createApolloClient.query({
            query: GET_MEMBERS
          }).then(response => {
              this.setState({members: response.data.members, sorted: response.data.members})
            }, error => console.log(error))
    }
    
    paginate = (e, page, analyticsEvent) => {
        console.log(page)
      }

    render () {
        const filterMembers = (status = "") => {
            let membersData = [];
            this.setState({activeWidget: status, setMode: 0})
            if(status != "")
            {
                membersData = members.filter(x => x.status === status)
            }else{
                membersData = members
            }
            this.setState({sorted: membersData})
        }
    const {members, sorted, setMode, activeWidget } = this.state

  
      
    return (
        <div>
            <div className="widget-section">
                <div className="widget-heading d-flex justify-content-between align-items-baseline">
                    <h3 className="page-title bold">manage members</h3>
                </div>
                <div className="widget-con">
                    <div onClick={() => filterMembers('')} className={ activeWidget ==='' ? 'widget no-shadow' : 'widget shadow'}>
                        <div className="widget-icon widget-icon-primary">
                            <PeopleGroupIcon />
                        </div>
                    <div>
                        <h1>362</h1>
                        <p>Total number of members</p>
                    </div>
                    </div>
                    <div onClick={() => filterMembers('active')} className={ activeWidget ==='active' ? 'widget no-shadow' : 'widget shadow'}>
                    <div className="widget-icon widget-icon-success">
                        <PersonWithTickIcon />
                    </div>
                    <div>
                        <h1>272</h1>
                        <p>Total Active Members</p>
                    </div>
                    </div>
                    <div onClick={() => filterMembers('inactive')} className={ activeWidget ==='inactive' ? 'widget no-shadow' : 'widget shadow'}>
                    <div className="widget-icon widget-icon-danger">
                        <PeopleIcon />
                    </div>
                    <div>
                        <h1>362</h1>
                        <p>Inactive Suspended members</p>
                    </div>
                    </div>
                </div>
                </div>
        <div className="bg-grey">
            
        {setMode === 0 &&
             <div >
                 <div className="row">
                     <div className="col-md-4">
                        <div className="search-con mb-4">
                            <input type="search" name="search" className="mini-search ks-form-control" placeholder="Search"></input>
                            <button type="button mr-3" className="btn">Search</button>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <button type="button" className="btn float-right mr-3 mt-4" onClick={()=> this.setState({setMode: 1})}>CREATE NEW MEMBER</button>
                    </div>
                 </div>
             

             <div className="table-responsive p-3">
                 { sorted.length > 0 &&
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
                 { sorted.map((member, index) => (
                 <tr key={index}>
                     <td>{index + 1}</td>
                     <td>{member.surname} {member.other_names}</td>
                     <td>{member.rank}</td>
                     <td>{member.gender}</td>
                     <td>{member.dept}</td>
                     <td>{member.current_balance}</td>
                     <td>{member.phone_number}</td>
                     <td className={member.status}> <Status status={member.status} /></td>
                     <td><WatchIcon size="meduim" isBold primaryColor="#0052CC" /> <span className="view-icon">VIEW</span>
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
                <Pagination onChange={(event, page, analyticsEvent) => this.paginate(event, page, analyticsEvent)} pages={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
                </div>
             </div>
                 }
                 { sorted && !sorted.length && 
                     <EmptyData title="Empty Members" text="No Available Members Data"/>
                 } 
                 { !sorted
                     &&
                    <Loader />
                 }
             
             </div>
         </div>
        }
        {
            setMode === 1 &&
            <div className="p-4">
                <p className="page-title mt-5">Create Staff Page
                    <span onClick={() => this.setState({setMode: 0})} className="float-right close-button">Close <CrossCircleIcon primaryColor="#FF7452" /></span>
                </p>
                <CreateMember />
            </div>
        }
            {/* <StyledMain> */}
            
           
            {/* </StyledMain> */}
        </div>
        </div>

    )
}
};

export default ManageMembers;

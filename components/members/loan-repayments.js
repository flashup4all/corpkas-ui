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
import { GET_PAGINATE_MEMBERS, GET_MEMBER_TOTALS } from '../../gql/members';
import { CustomToggle, Status } from '../../layouts/extras'
import { page_range } from '../shared/utils'

class LoanRepayments extends Component {
    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            members: [],
            memberTotals: {},
            pageNumber: 1,
            pageSize: 0,
            totalEntries: 0,
            totalPages: 0,
            sorted: [],
            setMode: 0,
            activeWidget: ''
        }
    }

    componentDidMount()
    {
        this.getMembers()
        this.getMemberTotals()
    }

    getMembers(page = 1)
    {
        createApolloClient.query({
            query: GET_PAGINATE_MEMBERS,
            variables: {page: page}
          }).then(response => {
              const result = response.data.paginateMembers
              this.setState({
                  members: result.entries, 
                  sorted: result.entries,
                  totalEntries: result.totalEntries,
                  totalPages: result.totalPages,
                  pageNumber: result.pageNumber,
                  pageSize: result.pageSize,

                })
            }, error => console.log(error))
    }
    getMemberTotals(page = 1)
    {
        createApolloClient.query({
            query: GET_MEMBER_TOTALS,
          }).then(response => {
              this.setState({memberTotals: response.data.memberTotals})
            }, error => console.log(error))
    }
    
    paginate = (e, page, analyticsEvent) => {
        this.getMembers(page)
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
    const {members, sorted, setMode, activeWidget, totalPages, memberTotals } = this.state
      
    return (
        <div>
            <div className="widget-section">
                <div className="widget-heading d-flex justify-content-between align-items-baseline">
                     <p>Settings</p><h3 className="page-title bold">| COORPERATIVE PROFILE</h3>
                </div>
                {/* <div className="widget-con">
                    <div onClick={() => filterMembers('')} className={ activeWidget ==='' ? 'widget no-shadow' : 'widget shadow'}>
                        <div className="widget-icon widget-icon-primary">
                            <PeopleGroupIcon />
                        </div>
                    <div>
                        <h1>{memberTotals && memberTotals.total}</h1>
                        <p>Total number of members</p>
                    </div>
                    </div>
                    <div onClick={() => filterMembers(1)} className={ activeWidget === 1 ? 'widget no-shadow' : 'widget shadow'}>
                    <div className="widget-icon widget-icon-success">
                        <PersonWithTickIcon />
                    </div>
                    <div>
                        <h1>{memberTotals && memberTotals.active}</h1>
                        <p>Total Active Members</p>
                    </div>
                    </div>
                    <div onClick={() => filterMembers(0)} className={ activeWidget ===0 ? 'widget no-shadow' : 'widget shadow'}>
                    <div className="widget-icon widget-icon-danger">
                        <PeopleIcon />
                    </div>
                    <div>
                        <h1>{memberTotals && memberTotals.inactive}</h1>
                        <p>Inactive Suspended members</p>
                    </div>
                    </div>
                </div>
                </div> */}
        <div className="bg-grey">
            
        {setMode === 0 &&
             <div >
                 <div className="row">
                     {/* <div className="col-md-4">
                        <div className="search-con mb-4">
                            <input type="search" name="search" className="mini-search ks-form-control" placeholder="Search"></input>
                            <button type="button mr-3" className="btn">Search</button>
                        </div>
                    </div> */}
                    <div className="col-md-8">
                        <button type="button" className="btn float-right mr-3 mt-4" onClick={()=> this.setState({setMode: 1})}>ADD LOAN TYPE</button>
                    </div>
                 </div>
             

             <div className="table-responsive p-3">
                 { sorted.length > 0 &&
                 <div>
                 <table className="table table-borderless">
                 <thead>
                 <tr>
                     <th>&#x23;</th>
                     <th>Loan Type</th>
                     <th>Max Duration</th>
                     <th>Interest</th>
                     <th>Interest Type</th>
                     <th>Insurance Rate</th>
                     <th>Date Created</th>
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
             { totalPages > 1 && 
                <div className="row align-items-center justify-content-center">
                <Pagination onChange={(event, page, analyticsEvent) => this.paginate(event, page, analyticsEvent)} pages={page_range(1,totalPages)} />
                </div>
             }
                
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
                <p className="page-title mt-5">Add Loan Type
                    <span onClick={() => this.setState({setMode: 0})} className="float-right close-button">Close <CrossCircleIcon primaryColor="#FF7452" /></span>
                </p>
                <AddLoanType />
            </div>
        }
            {/* <StyledMain> */}
            
           
            {/* </StyledMain> */}
        </div>
        </div>
        </div>

    )
}};

export default LoanRepayments;

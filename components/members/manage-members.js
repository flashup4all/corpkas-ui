import React, { Component } from 'react';
import Router  from 'next/router';
import Link from 'next/link';
import { useQuery, gql } from '@apollo/client';
import { createApolloClient } from '../../lib/apolloClient'
import PeopleGroupIcon from '@atlaskit/icon/glyph/people-group';
import PersonWithTickIcon from '@atlaskit/icon/glyph/person-with-tick';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';

import Dropdown from 'react-bootstrap/Dropdown'
import EmptyData from '../../layouts/empty';
import Loader from '../../layouts/loader';
import Pagination from '@atlaskit/pagination';
import { GET_PAGINATE_MEMBERS, GET_MEMBER_TOTALS, FILTER_MEMBERS } from '../../gql/members';
import { GENERATE_LOGIN_DETAILS } from '../../gql/user';
import { CustomToggle, Status } from '../../layouts/extras'
import { page_range, FormatCurrency } from '../shared/utils'
import CreateMember from './create-member'

class ManageMembers extends Component {
    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            members: [],
            sorted: [],
            memberTotals: {},
            pageNumber: 1,
            pageSize: 0,
            totalEntries: 0,
            totalPages: 0,
            setMode: 0,
            activeWidget: '',
            loginDetails:{},
            tableLoader: false
        }
    }

    componentDidMount()
    {
        this.getMembers()
        this.getMemberTotals()
    }

    getMembers(page = 1)
    {
        let result = '';
        this.setState({tableLoader: true})
        createApolloClient.query({
            query: GET_PAGINATE_MEMBERS,
            variables: {page: page}
          }).then(response => {
              let {entries, totalPages} = response.data.paginateMembers
            this.setState({ members: entries, sorted: entries, totalPages: totalPages, tableLoader: false})
            }, error => {
                return;
            })
    }

    filter(variables)
    {
        this.setState({tableLoader: true})
        createApolloClient.mutate({
            mutation: FILTER_MEMBERS,
            variables: variables
          }).then(response => {
              let {data: {filterMembers}} = response
            this.setState({ members: filterMembers, sorted: filterMembers, tableLoader: false})
            }, error => {
            this.setState({tableLoader: true})

        })
    }
    getMemberTotals(page = 1)
    {
        createApolloClient.query({
            query: GET_MEMBER_TOTALS,
          }).then(response => {
              this.setState({memberTotals: response.data.memberTotals})
            }, error => {return;})
    }
    refreshMember() {
        this.setState({tableLoader: true, setMode: 0})
        setTimeout(() => {
            this.getMemberTotals()
            createApolloClient.query({
                query: GET_PAGINATE_MEMBERS,
                variables: {page: 1}
              }).then(response => {
                  let {entries, totalPages} = response.data.paginateMembers
                this.setState({ members: entries, sorted: entries, totalPages: totalPages, tableLoader: false})
                }, error => {return;})
        }, 500)
        
        // refetch().then(({data: {findMember}}) => setMemberData(findMember))
      }
    generateLoginDetails(id)
    {
        createApolloClient.query({
            query: GENERATE_LOGIN_DETAILS,
            variables:{user_id: parseInt(id)}
          }).then(response => {
              let { data: {generateLoginDetails}} = response
              this.setState({setMode: 2, loginDetails: generateLoginDetails})
            }, error => {return;})
    }
    
    paginate = (e, page, analyticsEvent) => {
        this.getMembers(page)
      }
    
    render () {
        const filterMembers = (status = "") => {
            // let membersData = [];
            this.setState({activeWidget: status, setMode: 0})
            if(status != "")
            {
                this.filter({status: parseInt(status)})
    
                // membersData = members.filter(x => x.status === status)
            }else{
                // this.filter({sorted: members})
                this.getMembers()
    
                // membersData = members
            }
            // this.setState({sorted: membersData})
        }
    const {tableLoader, loginDetails, members, sorted, setMode, activeWidget, totalPages, memberTotals } = this.state
      
    

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
                    <div onClick={() => filterMembers('0')} className={ activeWidget ===0 ? 'widget no-shadow' : 'widget shadow'}>
                    <div className="widget-icon widget-icon-danger">
                        <PeopleIcon />
                    </div>
                    <div>
                        <h1>{memberTotals && memberTotals.inactive}</h1>
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
                {tableLoader && <Loader />}
                 { sorted.length > 0 && !tableLoader &&
                 <div>
                 <table className="table table-borderless">
                 <thead>
                 <tr>
                     <th>&#x23;</th>
                     <th  onClick={() => this.refreshMember()}>Name</th>
                     <th>Rank</th>
                     <th>Gender</th>
                     <th>Department</th>
                     <th>&#8358; Total Balance</th>
                     <th>Phone number</th>
                     <th>Status</th>
                     <th>Actions</th>
                 </tr>
                 </thead>
                 <tbody>
                 { sorted.map((member, index) => (
                 <tr key={index}>
                     <td>{index + 1}</td>
                     <td>{member.surname} {member.first_name} {member.other_names}</td>
                     <td>{member.rank}</td>
                     <td>{member.gender}</td>
                     <td>{member.dept}</td>
                     <td>{FormatCurrency(member.current_balance)}</td>
                     <td>{member.phone_number}</td>
                     <td className={member.status}> 
                        <Status status={member.status} />
                     </td>
                     <td>
                     <Link href="members/[member_id]" as={`members/${member.id}`}>
                        <a className="remove-decoration">
                        {/* <WatchIcon size="meduim" isBold primaryColor="#0052CC"  /> */}
                         <span className="view-icon">VIEW</span>
                        </a>
                        </Link>
                         
                     <Dropdown className="drop-link">
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="ks-menu-dropdown bg-menu">
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => this.generateLoginDetails(member.user_id)}>Reset Login Details</Dropdown.Item>
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
                 { sorted && !sorted.length && !tableLoader &&
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
                <p className="page-title mt-5">Create Member Page
                    <span onClick={() => this.setState({setMode: 0})} className="float-right close-button">Close <CrossCircleIcon primaryColor="#FF7452" /></span>
                </p>
                <CreateMember onrefreshMember={() => this.refreshMember()}/>
            </div>
        }
        </div>
        {
            setMode === 2 &&
            <div className="p-4">
                <p className="page-title mt-5">New Login Details
                    <span onClick={() => this.setState({setMode: 0})} className="float-right close-button">Close <CrossCircleIcon primaryColor="#FF7452" /></span>
                </p>
                <div>
                    <div className="">
                        <div className="confirm-con pt-5" >

                            <div className="row justify-content-center">
                                <div className="col-6 p-4">
                                    <li className="li-item ">Staff no. <span className="float-right bold-li">{loginDetails.staff_no}</span>   </li>
                                    <li className="li-item">Full Name <span className="float-right bold-li">{loginDetails.surname} {loginDetails.other_names}</span> </li>
                                    <li className="li-item">Email <span className="float-right bold-li">{loginDetails.email}</span></li>
                                    <li className="li-item">New Password <span className="float-right bold-li">{loginDetails.new_password}</span></li>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
        </div>

    )
}
};

export default ManageMembers;

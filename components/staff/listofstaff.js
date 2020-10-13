import React, { Component } from 'react';
import WatchIcon from '@atlaskit/icon/glyph/watch';
import Pagination from '@atlaskit/pagination';
import Dropdown from 'react-bootstrap/Dropdown'
import { GET_PAGINATE_STAFF, FILTER_STAFF } from '../../gql/staff';
import { createApolloClient } from '../../lib/apolloClient'
import { CustomToggle, Status } from '../../layouts/extras'
import EmptyData from '../../layouts/empty'
import { page_range } from '../shared/utils'

class ListOfStaff extends Component {

    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            staffList: [],
            sorted: [],
            staffTotals: {},
            pageNumber: 1,
            pageSize: 0,
            totalEntries: 0,
            totalPages: 0,
            setMode: 0,
            filter_status:'',
            filter_role:'',
            filter_term:'',
        }
    }

    componentDidMount()
    {
        this.getstaffList()
    }

    getstaffList(page = 1)
    {
        createApolloClient.query({
            query: GET_PAGINATE_STAFF,
            variables: {page: page}
          }).then(response => {
            const result = response.data.paginateStaff
            this.setState({
                staffList: result.entries, 
                sorted: result.entries,
                totalEntries: result.totalEntries,
                totalPages: result.totalPages,
                pageNumber: result.pageNumber,
                pageSize: result.pageSize,

              })
            }, error => console.log(error))
    }
    
    paginate = (e, page, analyticsEvent) => {
        this.getstaffList(page)
      }

    render() {

        const {staffList, sorted, setMode, totalPages, staffTotals, filter_status, filter_role, filter_term} = this.state
        const filter_form = () => {

            let variables = {}
            if(filter_role || filter_status)
            {
                filter_role ? variables.role = filter_role  : ''
                filter_status ? variables.status = filter_status : ''
               createApolloClient.mutate({
                   mutation: FILTER_STAFF,
                   variables: variables
               }).then(response => {
                   let result = response.data.filterStaff
                   this.setState({
                        staffList: result, 
                        sorted: result,
                        totalEntries: 0,
                        totalPages: 0,
                        pageNumber: 0,
                        pageSize: 0,
        
                    })
               }, (error)=> console.log(error)) 
            }
        }
        return (
            <div className="">
                {setMode === 0 &&
             <div>
             <div className="table-responsive p-2">
                <div className="row pl-2 mt-5 mb-3">
                                <div className="col-md-3 ks-col">
                                    <select className="ks-form-control form-control" 
                                        value={filter_status || ""}
                                        onChange={({ target }) => this.setState({filter_status: target.value})}
                                        >
                                        <option value="">Filter Status</option>
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                        <option value="2">Closed</option>
                                    </select>
                                </div>
                                <div className="col-md-3 ks-col">
                                    <select className="ks-form-control form-control" 
                                        value={filter_role || ""}
                                        onChange={({ target }) => this.setState({filter_role: target.value})}
                                        >
                                        <option value="">Filter Role</option>
                                        <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="staff">Staff</option>
                                    </select>
                                </div>
                                <div className="col-md-3 ks-col">
                                    <input type="search" name="search" 
                                    className="mini-search form-control ks-form-control" 
                                    placeholder="Search" 
                                    value={filter_term || ""}
                                    onChange={({ target }) => this.setState({filter_term: target.value})}></input>
                                </div>
                                <button type="button" className="btn" onClick={()=> filter_form()}>Search</button>
                            </div>
                 { staffList.length > 0 &&
                 <div>
                 <table className="table table-borderless">
                 <thead>
                 <tr>
                     <th>&#x23;</th>
                     <th>Name</th>
                     <th>Role</th>
                     <th>Gender</th>
                     <th>Email</th>
                     <th>Date Created</th>
                     <th>Status</th>
                     <th>Actions</th>
                 </tr>
                 </thead>
                 <tbody>
                 { sorted.map((staff, index) => (
                 <tr key={index}>
                     <td>{index + 1}</td>
                     <td>{staff.surname} {staff.other_names}</td>
                     <td>{staff.role}</td>
                     <td>{staff.gender}</td>
                     <td>{staff.email}</td>
                     <td>{staff.inserted_at.toLocaleString()}</td>
                     <td className={staff.status}>
                     <Status status={staff.status} />
                         </td>
                     <td><WatchIcon size="meduim" isBold primaryColor="#0052CC"/> <span className="view-icon">VIEW</span>
                     <Dropdown className="drop-link">
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="ks-menu-dropdown bg-menu">
                            {/* <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.push('vendor-profile')}>Manage</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.push('posts')}>Reset Login Details</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.push('manage-members')}>Send Statement</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.push('vendor-profile')}>Deactivate</Dropdown.Item> */}
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
                     <EmptyData title="No Staff Data" text="No Available Staff Data"/>
                 } 
                 { !sorted
                     &&
                    <Loader />
                 }
             
             </div>
         </div>
        }
            </div>
        )
    }
}

export default ListOfStaff;
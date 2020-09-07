import React, { Component } from 'react';
import WatchIcon from '@atlaskit/icon/glyph/watch';
import Pagination from '@atlaskit/pagination';
import Dropdown from 'react-bootstrap/Dropdown'
import { GET_PAGINATE_STAFF } from '../../gql/staff';
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
            filter: {
                gender:'',
                status: '',
            }
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

        const {staffList, sorted, setMode, totalPages, staffTotals, filter} = this.state
        return (
            <div className="">
                {setMode === 0 &&
             <div>
                 <div className="p-2">
                    <div className="row mt-5">
                        <div className="col-md-2">
                            <select className="ks-form-control form-control" 
                                value={filter.gender || ""}
                                onChange={({ target }) => this.setState({gender: target.value})}
                                >
                                <option value="">Filter by Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            </div>
                            <div className="col-md-2">
                                <select className="ks-form-control form-control" 
                                    value={filter.status || ""}
                                    onChange={({ target }) => this.setState({status: target.value})}
                                    >
                                    <option value="">Filter by Status</option>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                    <option value="2">Closed</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <select className="ks-form-control form-control" 
                                    value={filter.status || ""}
                                    onChange={({ target }) => this.setState({status: target.value})}
                                    >
                                    <option value="">Filter by Role</option>
                                    <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="staff">Staff</option>
                                </select>
                            </div>
                            <div className="col-md-4">

                                    <input type="search" name="search" className="mini-search ks-form-control" placeholder="Search"></input>
                                    <button type="button" className="btn" onClick={()=> this.setState({setMode: 1})}>Search</button>

                            </div>
                        </div>
                 </div>
                 
                 
             
             
             <div className="table-responsive p-2">
                 { staffList.length > 0 &&
                 <div>
                 <table className="table">
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
                     <td>{staff.inserted_at}</td>
                     <td className={staff.status}>
                     <Status status={staff.status} />
                         </td>
                     <td><WatchIcon size="meduim" isBold primaryColor="#0052CC"/> <span className="view-icon">VIEW</span>
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
                <Pagination onChange={(event, page, analyticsEvent) => this.paginate(event, page, analyticsEvent)} pages={page_range(1,totalPages)} />
                </div>
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
        {
            setMode === 1 &&

            <div>
                create page
                <div className="col-12">
                    <input className="ks-form-control form-control" />
                </div>
            </div>
        }
            </div>
        )
    }
}

export default ListOfStaff;
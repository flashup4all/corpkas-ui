import React, { Component } from 'react';
import WatchIcon from '@atlaskit/icon/glyph/watch';
import Pagination from '@atlaskit/pagination';
import Dropdown from 'react-bootstrap/Dropdown'
import { GET_STAFFS } from '../../gql/staff';
import { createApolloClient } from '../../lib/apolloClient'
import { CustomToggle, Status } from '../../layouts/extras'
import EmptyData from '../../layouts/empty'
class ListOfStaff extends Component {

    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            staffList: [],
            setMode: 0
        }
    }

    componentDidMount()
    {
        this.getstaffList()
    }

    getstaffList(page = 0)
    {
        createApolloClient.query({
            query: GET_STAFFS
          }).then(response => {
              this.setState({staffList: response.data.staff})
            }, error => console.log(error))
    }
    
    paginate = (e, page, analyticsEvent) => {
        console.log(page)
      }

    render() {

        const {staffList, setMode} = this.state
        return (
            <div className="">
                {setMode === 0 &&
             <div >
             <div className="col-md-4">
                <div className="search-con mb-4">
                    <input type="search" name="search" className="mini-search ks-form-control" placeholder="Search"></input>
                    <button type="button" className="btn" onClick={()=> this.setState({setMode: 1})}>Search</button>
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
                 { staffList.map((staff, index) => (
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
                <Pagination onChange={(event, page, analyticsEvent) => this.paginate(event, page, analyticsEvent)} pages={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
                </div>
             </div>
                 }
                 { staffList && !staffList.length && 
                     <EmptyData title="No Staff Data" text="No Available Staff Data"/>
                 } 
                 { !staffList
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
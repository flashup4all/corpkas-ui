import React, { Component } from 'react';
import { useQuery, gql } from '@apollo/client';
import { createApolloClient } from '../../lib/apolloClient'
import WatchIcon from '@atlaskit/icon/glyph/watch';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';

import Dropdown from 'react-bootstrap/Dropdown'
import EmptyData from '../../layouts/empty';
import Loader from '../../layouts/loader';
import Pagination from '@atlaskit/pagination';
import { FILTER_MEMBERS } from '../../gql/members';
import { CustomToggle, Status, Badge } from '../../layouts/extras'
import { page_range } from '../shared/utils'

class TransactionSchedule extends Component {
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
            activeWidget: '',
            filter_status: '',
            filter_from: '',
            filter_to: '',
            filter_txn_id: '',
            filter_txn_type: '',
            tableLoader: false
        }
    }

    componentDidMount()
    {
        this.filterMembers({status: 1})
    }

    // getTransactions(page = 1)
    // {
    //     createApolloClient.query({
    //         query: GET_TRANSACTIONS,
    //         variables: {page}
    //       }).then(response => {
    //           const { data: {paginateTransactions}} = response
    //           this.setState({
    //               members: paginateTransactions.entries, 
    //               sorted: paginateTransactions.entries,
    //               totalEntries: paginateTransactions.total_entries,
    //               totalPages: paginateTransactions.total_pages,
    //               pageNumber: paginateTransactions.page_number,
    //               pageSize: paginateTransactions.page_size,
    //             })
    //         }, error => console.log(error))
    // }

    filterMembers(variables)
    {
        this.setState({tableLoader: true})
        setTimeout(() => {
            createApolloClient.mutate({
                mutation: FILTER_MEMBERS,
                variables: variables
              }).then(response => {
                  let { data: {filterMembers}} = response
                  this.setState({
                        members: filterMembers, 
                        sorted: filterMembers,
                        tableLoader: false,
                    })
                }, error => {
                    this.setState({tableLoader: true})
                })
        },400)
    }
    getMemberTotals(page = 1)
    {
        createApolloClient.query({
            query: GET_MEMBER_TOTALS,
          }).then(response => {
              this.setState({memberTotals: response.data.memberTotals})
            }, error => console.log(error))
    }
    
    paginate(e, page, analyticsEvent){
        // this.getTransactions(page)
    }
    checkAll(value)
    {
        let { sorted } = this.state
        sorted.map(member => member.checked = value)
        this.setState({sorted: sorted})
    }
    bulkPayment()
    {
        console.log(this.state.sorted)
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
    const {members, tableLoader, sorted, setMode, activeWidget, totalPages, memberTotals, filter_from, filter_to, filter_status, filter_txn_id, filter_txn_type } = this.state
    
    const filter_form = () => {

        let variables = {}
        if(filter_from || filter_status)
        {
            filter_from ? variables.from = new Date(filter_from)  : null
            filter_to ? variables.to = new Date(filter_to)  : null
            filter_txn_type ? variables.txn_type = parseInt(filter_txn_type) : null
            filter_status ? variables.status = parseInt(filter_status) : null
            // variables.member_id =  this.state.memberData.id
            this.filterMembers(variables)
        }
    }
    const handleFormChange = (value,index) => {
        const array = sorted.map((member, idx) => {
          if (idx !== index) return member;
          if(parseFloat(value) <= 0 ){
              swal("Amount cant be Zero (0)")
              return { ...member, new_amount_payable: member.monthly_contribution };
          }else{
            return { ...member, new_amount_payable: value };
          }
        });
        this.setState({ sorted: array });
        
      };
    return (
        <div>
            
        <div className="bg-grey">
            
        {setMode === 0 &&
             <div >
                {/* <div className="row" style={{padding:'20px'}}>
                 <div className="col-md-3 ks-col">
                        <label>Txn ID</label>
                        <input type="text" name="search" 
                        className="form-control ks-form-control" 
                        placeholder="TransactionID"
                        value={filter_txn_id || ""}
                        onChange={({ target }) => this.setState({filter_txn_id: target.value})}
                        ></input>
                    </div>
                    <div className="col-md-3 ks-col">
                        <label>From Date</label>
                        <input type="date" name="search" 
                        className="form-control ks-form-control" 
                        placeholder="Search"
                        value={filter_from || ""}
                        onChange={({ target }) => this.setState({filter_from: target.value})}
                        ></input>
                    </div>
                    <div className="col-md-3 ks-col">
                        <label>To Date</label>
                        <input type="date" name="search" 
                        className="form-control ks-form-control" 
                        placeholder="Search"
                        value={filter_to || ""}
                        onChange={({ target }) => this.setState({filter_to: target.value})}
                        ></input>
                    </div>
                    <div className="col-md-3">
                        <label>Txn Type</label>
                        <select className="ks-form-control form-control" 
                            value={filter_txn_type || ""}
                            onChange={({ target }) => this.setState({filter_txn_type: target.value})}
                            >
                            <option value="">Status</option>
                            <option value="1">Credit</option>
                            <option value="2">Debit</option>
                        </select>
                    </div>
                 </div>
                <div className="row" style={{padding:'20px'}}>
                    <div className="col-md-3">
                        <label>Status</label>
                        <select className="ks-form-control form-control" 
                            value={filter_status || ""}
                            onChange={({ target }) => this.setState({filter_status: target.value})}
                            >
                            <option value="">Status</option>
                            <option value="1">Approved</option>
                            <option value="0">Pending</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button type="button" className="btn" style={{ marginTop: '32px'}} onClick={()=> filter_form()}>Filter</button>
                    </div>
                </div> */}

             <div className="table-responsive p-3">
                 { tableLoader  && <Loader />}
                 { sorted.length > 0 && !tableLoader &&
                 <div>
                 <table className="table table-borderless">
                 <thead>
                 <tr>
                 <th>
                     #
                     {/* <input className="ks-control" type="checkbox" onChange={({target}) => this.checkAll(target.checked)}/> */}
                 </th>
                     <th>Staff No.</th>
                     <th>Name</th>
                     <th>Gender</th>
                     <th>Department</th>
                     <th>Phone number</th>
                     {/* <th>Status</th> */}
                     <th>₦ Monthly Contribution</th>
                 </tr>
                 </thead>
                 <tbody>
                 { sorted.map((member, index) => (
                 <tr key={index}>
                     <td> 
                        {index + 1}
                         {/* <input className="ks-control" type="checkbox" checked={member.checked}/> */}
                    </td>
                    <td>{member.staff_no}</td>
                     <td>{member.surname} {member.first_name} {member.other_names}</td>
                     {/* <td>{member.rank}</td> */}
                     <td>{member.gender}</td>
                     <td>{member.dept}</td>
                     <td>{member.phone_number}</td>
                     {/* <td className={member.status}> <Status status={member.status} /></td> */}
                     <td>
                        {member.monthly_contribution}
                         {/* <input className="form-control ks-control" disabled={member.disabled} defaultValue={member.monthly_contribution} onChange={({target}) => handleFormChange(target.value, index)}/> */}
                     </td>
                 </tr>
                  ))}
                
                 </tbody>
             </table>
             {/* <div className="row" style={{padding:'20px'}}>
                <div className="col-md-3">
                    <label>Status</label>
                    <select className="ks-form-control form-control" 
                        value={filter_status || ""}
                        onChange={({ target }) => this.setState({filter_status: target.value})}
                        >
                        <option value="">Status</option>
                        <option value="1">Approved</option>
                        <option value="0">Pending</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <button type="button" className="btn" style={{ marginTop: '32px'}} onClick={()=> this.bulkPayment()}>Make Schedule</button>
                </div>
            </div> */}
            
                
             </div>
                 }
                 { sorted && !sorted.length && !tableLoader &&
                     <EmptyData title="Empty Savings" text="No Available Members Data"/>
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
                <CreateMember />
            </div>
        }
        </div>
        </div>

    )
}
};

export default TransactionSchedule;

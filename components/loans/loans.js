import React, { Component } from 'react';
import { useQuery, gql } from '@apollo/client';
import { createApolloClient } from '../../lib/apolloClient'
import WatchIcon from '@atlaskit/icon/glyph/watch';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';

import Dropdown from 'react-bootstrap/Dropdown'
import EmptyData from '../../layouts/empty';
import Loader from '../../layouts/loader';
import Pagination from '@atlaskit/pagination';
import { FILTER_LOANS, GET_LOANS } from '../../gql/loans';
import { CustomToggle, Status, Badge } from '../../layouts/extras'
import { page_range } from '../shared/utils'

class Transactions extends Component {
    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            loans: [],
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
            filter_txn_type: ''
        }
    }

    componentDidMount()
    {
        if(this.props.status == "0")
        {
            this.filterTransactions({status: 1})
        }else{
            this.getTransactions()
        }
        
        // this.getMemberTotals()
    }

    getTransactions(page = 1)
    {
        createApolloClient.query({
            query: GET_LOANS,
            variables: {page}
          }).then(response => {
              const { data: {paginateLoans}} = response
              this.setState({
                  loans: paginateLoans.entries, 
                  sorted: paginateLoans.entries,
                  totalEntries: paginateLoans.total_entries,
                  totalPages: paginateLoans.total_pages,
                  pageNumber: paginateLoans.page_number,
                  pageSize: paginateLoans.page_size,
                })
            }, error => console.log(error))
    }

    filterTransactions(variables)
    {
        createApolloClient.mutate({
            mutation: FILTER_LOANS,
            variables: variables
          }).then(response => {
              const { data: {filterTransactions}} = response
              this.setState({
                    transactions: filterTransactions, 
                  sorted: filterTransactions,
                  totalEntries: 0,
                  totalPages: 0,
                  pageNumber: 0,
                  pageSize: 0,

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
    
    paginate(e, page, analyticsEvent){
        this.getTransactions(page)
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
    const {loans, sorted, setMode, activeWidget, totalPages, memberTotals, filter_from, filter_to, filter_status, filter_txn_id, filter_txn_type } = this.state
    
    const filter_form = () => {

        let variables = {}
        if(filter_from || filter_status)
        {
            filter_from ? variables.from = new Date(filter_from)  : null
            filter_to ? variables.to = new Date(filter_to)  : null
            filter_txn_type ? variables.txn_type = parseInt(filter_txn_type) : null
            filter_status ? variables.status = parseInt(filter_status) : null
            // variables.member_id =  this.state.memberData.id
            this.filterTransactions(variables)
        }
    }

    const viewTxn = (txn) => {
        console.log(txn)
    }
    return (
        <div>
            
        <div className="bg-grey">
            
        {setMode === 0 &&
             <div >
                 {this.props.status !== "0" && 
                    <div style={{padding:'20px'}}>
                        <div className="row">
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
                            <div className="col-md-3 ks-col">
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
                        <div className="row mt-3">
                            <div className="col-md-3 ks-col">
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
                            <div className="col-md-2 ks-col">
                                <button type="button" className="btn" style={{ marginTop: '32px'}} onClick={()=> filter_form()}>Filter</button>
                            </div>
                        </div>
                    </div>
                 }
                 
                

             <div className="table-responsive p-3">
                 { sorted.length > 0 &&
                 <div>
                 <table className="table table-borderless">
                 <thead>
                 <tr>
                     <th>&#x23;</th>
                     {/* <th>Approved by</th> */}
                     <th>Member</th>
                     {/* <th>Posted by</th> */}
                     <th>Loan Type</th>
                     <th>Amount</th>
                     <th>Interest Rate</th>
                     <th>Date Applied</th>
                     <th>Guarantors</th>
                     <th>Status</th>
                     <th>Actions</th>
                 </tr>
                 </thead>
                 <tbody>
                 { sorted.map((loan, index) => (
                 <tr key={index}>
                     <td>{index + 1}</td>
                     {/* <td>{ txn.approved ? txn.approved.surname + " " + txn.approved.other_names : "Not Yet Approved"}</td> */}
                     {/* <td>{ txn.posted.surname } { txn.posted.other_names }</td> */}
                     <td>{ loan.member.surname } { txn.member.other_names }</td>
                     <td>
                        {loan.txn_type == 1 ? <Badge type='success' title='CREDITED'/> : <Badge type='moved' title='DEBITED'/>}
                    </td>
                     <td>{loan.amount}</td>
                     <td className={txn.status}>
                        {loan.status == 1 ? <Badge type='success' title='POSTED'/> : <Badge type='moved' title='PRE-POST'/>}
                          {/* <Status status={txn.status} /> */}
                    </td>
                     <td><WatchIcon size="meduim" isBold primaryColor="#0052CC" /> <span className="view-icon">VIEW</span>
                     <Dropdown className="drop-link">
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="ks-menu-dropdown bg-menu">
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => viewTxn(loan)}>View Txn</Dropdown.Item>
                            <Dropdown.Divider />
                            {txn.status === 0 && <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => this.approveTransaction(loan)}>Approve</Dropdown.Item>}
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
                     <EmptyData title="Empty Transactions" text="No Available Transactions Data"/>
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
                <CreateMember />
            </div>
        }
        </div>
        </div>

    )
}
};

export default Transactions;

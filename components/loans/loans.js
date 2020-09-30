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
import AvatarGroup from '@atlaskit/avatar-group';
import SingleLoanRequests from './single-loan-requests';

const RANDOM_USERS = [
    {id: 1, name: "john"},
    {id: 2, name: "john"},
    {id: 3, name: "john"}
]

class Transactions extends Component {
    constructor(props) {
        super(props);
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
            filter_txn_type: '',
            guarantors : RANDOM_USERS.map(d => ({
                name: d.name,
              })),
            selectedLoan: null
        }

        this.refresh = this.refresh.bind(this);

    }

    componentDidMount()
    {
        if(this.props.status)
        {
            this.filterLoans({status: parseInt(this.props.status)})
        }else{
            this.getTransactions()
        }
        
        // this.getMemberTotals()
    }

    refresh(){
        // this.filterLoans({status: 0})
    }

    getTransactions(page = 1)
    {
        createApolloClient.query({
            query: GET_LOANS,
            variables: {page}
          }).then(response => {
              let { data: {paginateLoans}} = response
              console.log(paginateLoans)

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

    filterLoans(variables)
    {
        createApolloClient.mutate({
            mutation: FILTER_LOANS,
            variables: variables
          }).then(response => {
              const { data: {filterLoans}} = response
            console.log(filterLoans)
              this.setState({
                    loans: filterLoans, 
                  sorted: filterLoans,
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
    const {loans, sorted, setMode, activeWidget, totalPages, memberTotals, filter_from, filter_to, filter_status, filter_txn_id, filter_txn_type, guarantors, selectedLoan } = this.state
    
    const filter_form = () => {

        let variables = {}
        if(filter_from || filter_status)
        {
            filter_from ? variables.from = new Date(filter_from)  : null
            filter_to ? variables.to = new Date(filter_to)  : null
            filter_txn_type ? variables.txn_type = parseInt(filter_txn_type) : null
            filter_status ? variables.status = parseInt(filter_status) : null
            // variables.member_id =  this.state.memberData.id
            this.filterLoans(variables)
        }
    }

    const viewTxn = (txn) => {
        console.log(txn)
    }

    const guarantorAvatar = (guarantors) => {
    //     let array = [];
    //     guarantors.map( g => {
    //       array.push({id: g.member.id, name: g.member.surname +' '+g.member.other_names, href: g.member.avatar_url})
    //   })
    //   console.log(array)
    const data = guarantors.map(g => ({id: g.member.id, name: g.member.surname +' '+g.member.other_names, href: g.member.avatar_url}));

        return (
            <AvatarGroup appearance="stack" data={data} />
        )
    }
    const showSelectedLoan = (loan) => {
        this.setState({setMode: 1, selectedLoan: loan })
    }
    return (
        <div>
            
        <div className="bg-grey">
            
        {setMode === 0 &&
             <div >
                 {this.props.showSearch && 
                    <div style={{padding:'20px'}}>
                        <div className="row">
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
                                <label>Loan Type</label>
                                <select className="ks-form-control form-control" 
                                    value={filter_txn_type || ""}
                                    onChange={({ target }) => this.setState({filter_txn_type: target.value})}
                                    >
                                    <option value="">Status</option>
                                    <option value="1">Credit</option>
                                    <option value="2">Debit</option>
                                </select>
                            </div>
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
                        </div>
                        <div className="row mt-3">
                            
                            <div className="col-md-2 ks-col">
                                <button type="button" className="btn" onClick={()=> filter_form()}>Filter</button>
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
                     <th>Interest Rate</th>
                     <th>&#8358; Amount</th>
                     <th>&#8358; Approved Amount</th>
                     <th>&#8358; Amount Payable</th>
                     <th>&#8358; Balance Payable</th>
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
                     <td>{ loan.member.surname } { loan.member.other_names }</td>
                     <td>{loan.loan_type.name}</td>
                     <td>{loan.loan_type.interest}</td>
                     <td>{loan.loan_amount}</td>
                     <td>{loan.approved_amount || '0.0'}</td>
                     <td>{loan.amount_payable}</td>
                     <td>{loan.balance_payable || "0.0"}</td>
                     <td>{loan.inserted_at}</td>
                     <td>
                        {guarantorAvatar(loan.guarantors)}
                     </td>
                     <td className={loan.status}>
                     {loan.status == 1 && <Badge type='success' title='APPROVED'/>}
                     {loan.status == 0 && <Badge type='moved' title='PENDING'/>}
                        {loan.status == 2 && <Badge type='inprogress' title='DECLINED'/>}
                          {/* <Status status={txn.status} /> */}
                    </td>
                     <td onClick={() => showSelectedLoan(loan)}><WatchIcon size="meduim" isBold primaryColor="#0052CC" /> <span className="view-icon">VIEW</span></td>
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
                     <EmptyData title="Empty Loans" text="No Available Loans Data"/>
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
                <p className="page-title mt-5">
                    <span onClick={() => this.setState({setMode: 0})} className="float-right close-button">Close <CrossCircleIcon primaryColor="#FF7452" /></span>
                </p>
            <SingleLoanRequests loan={selectedLoan} onRefresh={this.refresh}/>
            </div>
        }
        </div>
        </div>

    )
}
};

export default Transactions;

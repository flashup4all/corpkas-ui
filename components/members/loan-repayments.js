import React, { Component } from 'react';
import { useQuery, gql } from '@apollo/client';
import { createApolloClient } from '../../lib/apolloClient'
import WatchIcon from '@atlaskit/icon/glyph/watch';
import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import PeopleGroupIcon from '@atlaskit/icon/glyph/people-group';
import PersonWithTickIcon from '@atlaskit/icon/glyph/person-with-tick';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import { getStaff, getUser } from '../shared/local'

import Dropdown from 'react-bootstrap/Dropdown'
import EmptyData from '../../layouts/empty';
import Loader from '../../layouts/loader';
import Pagination from '@atlaskit/pagination';
import { GET_MEMBER_LOANS_TXNS } from '../../gql/members';
import { LOAN_TYPES, CREATE_LOANS_TXNS, FILTER_LOANS, APPROVE_LOAN_TXN, CANCEL_LOAN_TXN } from '../../gql/loans';
import { CustomToggle, Status, Badge } from '../../layouts/extras'
import { page_range } from '../shared/utils'
import { ShortDate, MonthYear, FormatCurrency } from '../../components/shared/utils';

class Transactions extends Component {
    constructor(props) {
        console.log(props.memberData)
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            members: [],
            loanTxns: [],
            activeLoans: [],
            memberData: props.memberData,
            memberTotals: {},
            pageNumber: 1,
            pageSize: 0,
            totalEntries: 0,
            totalPages: 0,
            sorted: [],
            loanTypes: [],
            setMode: 0,
            activeWidget: '',
            txn_loader: false,
            txnType:'',
            txnAmount:'',
            txnLoanId:'',
            txnNaration:''
        }
    }

    componentDidMount()
    {
        this.getLoanTypes()
        this.filterMemberActiveLoans(this.state.memberData.id)
        this.getMemberLoanTxns(this.state.memberData.id)
    }

    getMemberLoanTxns(member_id, page = 1)
    {
        console.log(member_id)
        createApolloClient.query({
            query: GET_MEMBER_LOANS_TXNS,
            variables: {member_id: member_id, page: page}
          }).then(response => {
            let {data: {memberLoanTransactions: {entries, total_pages, total_entries}}} =  response
            this.setState({
                  members: entries, 
                  sorted: entries,
                  totalEntries: total_entries,
                  totalPages: total_pages

                })
            }, error => console.log(error))
    }
    getLoanTypes()
    {
        createApolloClient.query({
            query: LOAN_TYPES
          }).then(response => {
              const result = response.data.loanTypes
              console.log(result)
              this.setState({
                  loanTypes: result

                })
            }, error => console.log(error))
    }
    filterMemberActiveLoans(member_id)
    {
        createApolloClient.mutate({
            mutation: FILTER_LOANS,
            variables:{ member_id: member_id, state: 1}
          }).then(response => {
              const {data: {filterLoans}} = response
              console.log(response)
              this.setState({
                  activeLoans: filterLoans

                })
            }, error => console.log(error))
    }
    filterLoanName(loan_type_id)
    {
                console.log(this.state.loanTypes.find(type => type.id == loan_type_id).name)
                return this.state.loanTypes.find(type => type.id == loan_type_id).name
    }
    
    paginate = (e, page, analyticsEvent) => {
        this.getMembers(page)
      }
      showMakeTransactionForm(txnType){
        this.setState({setMode: 2, txnType: txnType})
    }
    validTransaction(){
        const {txnType, txnAmount, txnNaration, memberData} = this.state 
        return (txnAmount)
    }
    makeTransactionForm(){
        this.setState({txn_loader: true})
        const {txnType, txnAmount, txnNaration, txnLoanId, memberData} = this.state 
        console.log(txnType)
        console.log(txnAmount)
        console.log(txnNaration)
        console.log(txnLoanId)

        swal({
            title: "Are you sure?",
            text: "Approval cannot be undone!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
            .then((yes) => {
                if (yes) {
                    createApolloClient.mutate({
                        mutation: CREATE_LOANS_TXNS,
                        variables:{
                            loan_id: parseInt(txnLoanId),
                            naration: txnNaration, 
                            txn_type: txnType,
                            amount: parseFloat(txnAmount), 
                            member_id: memberData.id, 
                            posted_by: parseInt(getStaff().id),
                            status: 0
                        },
                        refetchQueries:[{query: GET_MEMBER_LOANS_TXNS, variables:{member_id: this.state.memberData.id, page:1}}]
                    
                    }).then(response => {
                        console.log(response)
                        let {data: {createTransaction}} = response
                        this.setState({
                            txnType: '', txnAmount: '', txnNaration:'', setMode:0, txn_loader:false
                        })
                        this.getMemberLoanTxns(this.state.memberData.id)
                        // this.props.onrefreshMember();
                        swal("Contribution was Successful! awaiting approval", {
                            icon: "success",
                        });

                }, (error) => {
                    console.log(error) 
                    this.setState({txn_loader: false})
                })
                }
            })
    }
    approveTransaction(txn, status){
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this  file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                createApolloClient.mutate({
                    mutation: APPROVE_LOAN_TXN,
                    variables: {id: txn.id, status: status, approved_by: parseInt(getStaff().id), loan_id: parseInt(txn.loan_id), member_id: parseInt(txn.member_id)},
                    refetchQueries:[{query: GET_MEMBER_LOANS_TXNS, variables:{member_id: txn.member_id, page:1}}]
                }).then(response => {
                    const {data: {approveLoanTransaction}} = response
                    this.getMemberLoanTxns(txn.member_id)
                    swal("Transaction Processed", {
                        icon: "success",
                    });
                    }, error => console.log(error))
              
            } else {
              return;
            }
          });
    }
    cancelTransaction(txn, status){
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this  file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                createApolloClient.mutate({
                    mutation: CANCEL_LOAN_TXN,
                    variables: {id: txn.id, status: status, approved_by: parseInt(getStaff().id), loan_id: parseInt(txn.loan_id), member_id: parseInt(txn.member_id)},
                    refetchQueries:[{query: GET_MEMBER_LOANS_TXNS, variables:{member_id: txn.member_id, page:1}}]
                }).then(response => {
                    const {data: {approveLoanTransaction}} = response
                    this.getMemberLoanTxns(txn.member_id)
                    swal("Transaction Processed", {
                        icon: "success",
                    });
                    }, error => console.log(error))
              
            } else {
              return;
            }
          });
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
    const {loanTypes, activeLoans, members, sorted, setMode, activeWidget, totalPages, memberData } = this.state
    const validTransaction = () =>{
        const {txnType, txnAmount, txnNaration, memberData} = this.state 
        return (txnAmount)
    }
    return (
        <div>
            
            <div className="widget-section">
        <div className="bg-grey">
        <p className="transaction-header">Loan Transaction Details</p>
        {setMode === 0 &&
             <div style={{padding:'20px'}}>
                 
                 <div className="row">
                 <div className="col-md-3">
                    <select className="ks-form-control form-control" 
                        >
                        <option value="">Loan Type</option>
                        {loanTypes && loanTypes.map( (type, index) => <option key={index} value={type.id}>{type.name}</option> )}
                    </select>
                </div>
                    <div className="col-md-8">
                        <button type="button" className="btn float-right" onClick={()=> this.setState({setMode: 1})}>Print Transaction</button>
                    </div>
                    <div className="col-md-12 ks-col">
                        <button type="button" className="btn btn-danger float-right mt-4 ml-3" onClick={()=> this.showMakeTransactionForm(2)}>Payback</button>
                        <button type="button" className="btn btn-secondary float-right mt-4" onClick={()=> this.showMakeTransactionForm(1)}>Credit</button>
                    </div>
                 </div>
             

             <div className="table-responsive p-3">
                 { sorted.length > 0 &&
                 <div>
                 <table className="table table-borderless">
                 <thead>
                 <tr>
                     <th>#</th>
                     <th>Txn Type</th>
                     <th>Loan</th>
                     <th>Amount Paid</th>
                     <th>Payment Type</th>
                     <th>Loan Status</th>
                     <th>Date</th>
                     <th>Actions</th>
                 </tr>
                 </thead>
                 <tbody>
                 { sorted.map((loan_repayment, index) => (
                 <tr key={index}>
                     <td>{index + 1}</td>
                     <td>
                        {loan_repayment.txn_type == 1 ? <Badge type='success' title='PAID'/> : <Badge type='moved' title='DEDUCTED'/>}
                     </td>
                     <td>{this.filterLoanName(loan_repayment.loan.loan_type_id)}</td>
                     <td>{loan_repayment.amount}</td>
                     <td>
                        {loan_repayment.payment_type == "full" ? <Badge type='success' title='FULL'/> : <Badge type='moved' title='PART'/>}
                     </td>
                     <td className={loan_repayment.status}> <Status status={loan_repayment.status} /></td>
                     <td>{MonthYear(loan_repayment.loan.inserted_at)}</td>
                     <td><WatchIcon size="meduim" isBold primaryColor="#0052CC" /> <span className="view-icon">VIEW</span>
                     <Dropdown className="drop-link">
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="ks-menu-dropdown bg-menu">
                        <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => console.log('view transaction')}>View Txn</Dropdown.Item>
                        {/* <Dropdown.Divider /> */}
                        {
                            loan_repayment.status === 0 && 
                            <>
                            <Dropdown.Divider />
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => this.approveTransaction(loan_repayment, 1)}>Approve</Dropdown.Item>
                            </>
                        }
                        { getUser().role=="admin" && 
                        <>
                            <Dropdown.Divider />
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => this.cancelTransaction(loan_repayment, 2)}>Cancel</Dropdown.Item>
                        </>
                        }
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
                     <EmptyData title="Empty Loan Payments" text="No Available Repayments Data"/>
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
                <p className="page-title mt-5">Print Transaction
                    <span onClick={() => this.setState({setMode: 0})} className="float-right close-button">Close <CrossCircleIcon primaryColor="#FF7452" /></span>
                </p>
                <span>Print Transaction</span>
            </div>
        }
        {setMode === 2 &&
            <div style={{padding:'20px'}}>
                 <p className="page-title mt-5">Make a Contribution/Saving
                    <span onClick={() => this.setState({setMode: 0})} className="float-right close-button">Close <CrossCircleIcon primaryColor="#FF7452" /></span>
                </p>
                <div className="row mt-4">
                    <div className="col-md-4 ks-col">
                        <label>Active Loan</label>
                        <select className="ks-form-control form-control" 
                            onChange={({ target }) => this.setState({txnLoanId: target.value})}
                            >
                            <option value="">Loan Type</option>
                            {activeLoans && activeLoans.map( (loan, index) => <option key={index} value={loan.id}>{loan.loan_type.name}</option> )}
                        </select>
                    </div>
                    <div className="col-md-4 ks-col">
                        <label>Amount</label>
                        <input name="search" 
                        className="mini-search form-control ks-form-control" type="number"
                        placeholder="100000"
                        onChange={({ target }) => this.setState({txnAmount: target.value})}
                        ></input>
                    </div>
                    <div className="col-md-4 ks-col">
                        <label>Narration</label>
                        <input name="search" 
                        className="mini-search form-control ks-form-control" 
                        placeholder="Naration"
                        onChange={({ target }) => this.setState({txnNaration: target.value})}
                        ></input>
                    </div>
                    <div className="col-md-12">
                    <button type="button" disabled={!validTransaction()} className="btn btn-secondary float-right mt-4" onClick={()=> this.makeTransactionForm()}>Contribute</button>
                    </div>
                </div>
            </div>
        }
            {/* <StyledMain> */}
            
           
            {/* </StyledMain> */}
        </div>
        </div>
        </div>

    )
}};

export default Transactions;

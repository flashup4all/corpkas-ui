import React, { Component } from 'react';
import { createApolloClient } from '../../lib/apolloClient'
import Spinner from '@atlaskit/spinner';

import EmptyData from '../../layouts/empty';
import { FILTER_LOANS, GET_LOANS, CREATE_LOANS_TXNS } from '../../gql/loans';
import { ShortDate, FormatCurrency } from '../../components/shared/utils';
import swal from 'sweetalert';
import { getStaff } from '../shared/local'
import { Checkbox } from '@atlaskit/checkbox';

const RANDOM_USERS = [
    {id: 1, name: "john"},
    {id: 2, name: "john"},
    {id: 3, name: "john"}
]

class LoanBankSchedule extends Component {
    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            loans: [],
            scheduleForm: [{member_id: '', loan_id: '', new_amount_payable: ''}],
            txn_status: '',
            narration: '',
            save_loader: false,
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
              }))
        }
    }

    componentDidMount()
    {
        // if(this.props.status)
        // {
            this.filterLoans({status: 1, loan_payment_status: 0, })
        // }else{
        //     this.getTransactions()
        // }
        
        // this.getMemberTotals()
    }

    getTransactions(page = 1)
    {
        createApolloClient.query({
            query: GET_LOANS,
            variables: {page}
          }).then(response => {
              const { data: {paginateLoans}} = response
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
              filterLoans.map(loan => {
                  loan.new_amount_payable = loan.balance_payable
                  loan.check = true
                } )
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
    save_loan_txn(variables){
        createApolloClient.mutate({
         mutation: CREATE_LOANS_TXNS,
         variables: variables
       }).then(response => {
           const { data: {createLoanTransaction}} = response
           console.log(createLoanTransaction)
         //   filterLoans.map(loan => {
         //       loan.new_amount_payable = loan.balance_payable
         //     })
         //   this.setState({
         //         loans: filterLoans, 
         //       sorted: filterLoans,
         //       totalEntries: 0,
         //       totalPages: 0,
         //       pageNumber: 0,
         //       pageSize: 0,
 
         //     })
         }, error => console.log(error))
    }

    handleScheduleFormChange = (value,index) => {
        const newShareholders = this.state.sorted.map((loan, idx) => {
          if (idx !== index) return loan;
          if(parseFloat(value) > parseFloat(loan.balance_payable) ){
              swal("Amount cant be more than Amount Payable")
              return { ...loan, new_amount_payable: loan.balance_payable };
          }else{
            return { ...loan, new_amount_payable: value };
          }
        });
        this.setState({ sorted: newShareholders });
        
      };

      handleScheduleFormCheckBoxChange = (checked,index) => {
          console.log(checked)
        let array = this.state.sorted.map((loan, idx) => {
            if (idx !== index) return loan;
            return { ...loan, check: checked };
        });
        this.setState({ sorted: array });
      };
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
    const {txn_status, narration, sorted, setMode, save_loader, activeWidget, totalPages, memberTotals, filter_from, filter_to, filter_status, filter_txn_id, filter_txn_type, guarantors } = this.state
    
    const filter_form = () => {

        let variables = {}
        if(filter_from || filter_status)
        {
            filter_from ? variables.from = new Date(filter_from)  : null
            filter_to ? variables.to = new Date(filter_to)  : null
            filter_txn_type ? variables.txn_type = parseInt(filter_txn_type) : null
            filter_status ? variables.status = parseInt(filter_status) : null
            this.filterLoans(variables)
        }
    }

    const viewTxn = (txn) => {
        console.log(txn)
    }

    const save_schedule = () => {
        console.log(sorted) 
        swal({
            title: "Are you sure?",
            text: "Application save this Transactions be undone!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((yes) => {
            if (yes) {
                this.setState({save_loader: true})
                sorted.map((loan) =>{
                    if(loan.check)
                    {
                        let paymentType ='';
                        if (parseFloat(loan.new_amount_payable) == parseFloat(loan.balance_payable))
                        { 
                            paymentType = 'full'
                        }else{
                            paymentType = 'part'
                        }
                        let variables = {
                            member_id: loan.member_id,
                            naration: narration,
                            txn_type: 1,
                            payment_type: paymentType,
                            amount: parseFloat(loan.new_amount_payable),
                            posted_by: parseInt(getStaff().id),
                            loan_id: parseInt(loan.id),
                            status: parseInt(txn_status)
                        }
                        this.save_loan_txn(variables)
                    }
                })
                swal("Bulk transaction was successful", {icon:'success'})

                this.setState({save_loader: false})
            } 
          });

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
                 <>
                 <table className="table table-borderless">
                    <thead>
                    <tr>
                        <th>&#x23;</th>
                        <th>&#x23;</th>
                        {/* <th>Approved by</th> */}
                        <th>Member</th>
                        {/* <th>Posted by</th> */}
                        <th>Loan Type</th>
                        <th>Interest Rate</th>
                        <th>&#8358; Approved Amount</th>
                        <th>&#8358; Payable</th>
                        <th>&#8358; Payable</th>
                        {/* <th>Bank</th> */}
                        {/* <th>Account Number</th> */}
                    </tr>
                    </thead>
                    <tbody>
                    { sorted.map((loan, index) => (
                    <tr key={index}>
                        <td>
                        <Checkbox
                            defaultChecked={loan.check}
                            onChange={({target}) => this.handleScheduleFormCheckBoxChange(target.checked, index)}
                            name="checkbox-default"
                            testId="cb-default"
                        />
                        </td>
                        <td>{index + 1}</td>
                        {/* <td>{ txn.approved ? txn.approved.surname + " " + txn.approved.other_names : "Not Yet Approved"}</td> */}
                        {/* <td>{ txn.posted.surname } { txn.posted.other_names }</td> */}
                        <td>{ loan.member.surname } { loan.member.other_names }</td>
                        <td>{loan.loan_type.name}</td>
                        <td>{ FormatCurrency(loan.loan_type.interest)}</td>
                        <td>{ FormatCurrency(loan.approved_amount) }</td>
                        <td>{ FormatCurrency(loan.new_amount_payable) }</td>
                        <td>
                            <input className="form-control ks-control"
                                defaultValue={loan.new_amount_payable}
                                onChange={({target}) => this.handleScheduleFormChange(target.value, index)}
                            />
                        </td>
                            {/* <td></td>
                            <td></td> */}
                    </tr>
                    ))}
                    
                    </tbody>
                </table>

                <div className="row">
                    <div className="col-md-3 ks-col">
                        <label>Status</label>
                        <select className="ks-form-control form-control" 
                            value={txn_status || ""}
                            onChange={({ target }) => this.setState({txn_status: target.value})}
                            >
                            <option value="">Status</option>
                            <option value="1">Approve</option>
                        </select>
                    </div>
                    <div className="col-md-3 ks-col">
                        <label>Narration</label>
                        <input type="text" name="search" 
                        className="form-control ks-form-control" 
                        placeholder="Search"
                        value={narration || ""}
                        onChange={({ target }) => this.setState({narration: target.value})}
                        ></input>
                    </div>
                    <div className="col-md-3 ks-col">
                        <button type="button" disabled={save_loader} className="btn" style={{ marginTop: '32px'}} onClick={()=> save_schedule()}>
                        { save_loader &&
                            <Spinner appearance="invert" size="medium"/>
                        }
                            Make Payment</button>
                    </div>
                </div>
                </>
                }
                 {/* { sorted && !sorted.length && 
                     <EmptyData title="Empty Loans" text="No Available Loans Data"/>
                 } 
                 { !sorted
                     &&
                    <Loader />
                 } */}
             
             </div>
         </div>
        } 
        </div>
        </div>

    )
}
};

export default LoanBankSchedule;

import React, { Component } from 'react';
import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { createApolloClient } from '../../lib/apolloClient'

import { GET_MEMBER_LOANS} from '../../gql/members'
import { CREATE_LOAN, GET_LOAN_GUARANTORS, CREAT_LOAN_GUARANTOR, APPROVE_LOAN } from '../../gql/loans'
import Spinner from '@atlaskit/spinner';
import { ToastProvider, useToasts } from 'react-toast-notifications'
import EmptyData from '../../layouts/empty';
import {Badge} from '../../layouts/extras';
import { getUser } from '../shared/local';
import GuarantorAndPayslip from '../shared/component/guarantor-and-payslip';
import swal from '@sweetalert/with-react'
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import { ShortDate, FormatCurrency } from '../shared/utils';

import { Checkbox } from '@atlaskit/checkbox';

const LOAN_TYPES = gql`
query {
    loanTypes {
      id
      name
      duration
  }
    }
`;

export const DECLINE_LOAN = gql`
  mutation updateLoan(
    $status: Int!,
    $id: Int!,
  ) {
      updateLoan(loan: {
      status: $status
    }, id: $id){
      id
      status
      }
  }
`;

const FILTER_LOANS = gql`
  mutation filterLoans(
    $member_id: Int,
    $status: Int
  ) {
    filterLoans(loan: {
      member_id: $member_id,
      status: $status
    }){
        
      actual_amount
      amount_payable
      approved_date
      reason
      detail
      due_date
      insurance_amount
      insurance_percent
      interest_amount
      interest_percent
      is_insured
      loan_amount
      status
      total_deduction
      total_loan
      total_paid
      upfront_deduction
      monthly_deduction
      duration
      loan_type_id
      member_id
      inserted_at
      updated_at
      }
  }
`


class MobileSingleLoanRequests extends Component {

    constructor(props) {
        super(props);
        const {loan} = this.props
        console.log(loan)
        this.state = {
            user : {},
            memberLoans: [],
            sorted: [],
            setMode: 0,
            loanTypes: [],
            // loanGuarantors: loan.guarantors,
            appliedLoanGuarantors: loan.guarantors,

            // payslip: loan.payslip_url,
            applied_payslip:loan.payslip_url,
            loan_type_id: loan.loan_type_id,
            approved_amount: loan.loan_amount,
            loan_amount: loan.loan_amount,
            monthly_deduction: loan.monthly_deduction,
            monthly_net_income: loan.monthly_net_income,
            reason: loan.reason,
            upfront_deduction: loan.upfront_deduction,
            upfront_deduction_charge:'',
            is_insured:loan.is_insured,
            insurance_charge: loan.insurance_charge,
            duration: loan.duration,
            total_deduction: loan.total_deduction,
            loan: loan,
            memberData: loan.member,
            apply_loader: false,
            apply_guarantors: loan.guarantors

        }
        this.handleGuarantorList = this.handleGuarantorList.bind(this);
        this.handlePayslip = this.handlePayslip.bind(this);
        
    }

    componentDidMount()
    {
        let user = getUser()
        this.setState({user: user})
        this.getLoanTypes()
        // this.getMemberLoans(this.state.memberData.id)
    }
   

    getLoanTypes(){
        createApolloClient.query({
            query: LOAN_TYPES,
          }).then(response => {
              let {data: {loanTypes}} = response
              this.setState({
                loanTypes: loanTypes, 
                })
            }, error => console.log(error))
    }

    getAppliedLoanGuarantors(id){
        createApolloClient.query({
            query: GET_LOAN_GUARANTORS,
            variables: {loan_id: parseInt(id)}
          }).then(response => {
              let {data: {loanGuarantors}} = response
              this.setState({
                appliedLoanGuarantors: loanGuarantors, 
                })
            }, error => console.log(error))
    }

    resetApplyForm()
    {
        this.setState({
            apply_loan_type_id: '',
            apply_loan_amount:0.0,
            apply_reason: '',
            apply_monthly_net_income: 0.0,
            apply_loader: false,
            apply_guarantors: [],
            loanGuarantors: [],
            payslip: null
        })
    }
    
    handleGuarantorList(list)
    {
        
        const { memberData} = this.state
        let newList = list
        let validList = []
        list.map(x => validList.push({member_id: x.id, status: 0}))
        this.setState({loanGuarantors: list, apply_guarantors: validList})

    }
    handlePayslip(payslip){
        this.setState({payslip: payslip})
    }
    render(){
        const {appliedLoanGuarantors, memberData, setMode, memberLoans, loanTypes, sorted, 
                loan_type_id, reason, monthly_deduction, duration, loan_amount, is_insured, 
                upfront_deduction, insurance_charge, upfront_deduction_charge, approved_amount, total_deduction,
                monthly_net_income, loanGuarantors, applied_payslip, payslip,
                apply_loan_type_id, apply_loan_amount, apply_monthly_net_income, apply_reason, apply_loader, loan, user
            } = this.state

        const cancelLoan = () =>{
            swal({
                title: "Are you sure?",
                text: "This action cannot be undone!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((yes) => {
                if (yes) {
                    createApolloClient.mutate(
                        {
                            mutation: DECLINE_LOAN, 
                            variables:{
                                status: 3, 
                                id: parseInt(loan.id)
                            }
                        }).then(response => {
                        let {data: {updateLoan}} = response
                        swal("This Loan has been Declined", {icon:'success'})
                      }, error => console.log(error))
                }
              });
        }
        
        return (
            <div className="grey-container">
                <p className="">Loan Requests</p>
                { setMode == 0 && loan && 
                <div>
                            <form>
                                <div className="row mt-5 pb-5 bg-white">
                                    <div className="col-md-6 mt-3">
                                        <p className="ks-request-text">Loan request for {FormatCurrency(loan.loan_amount)}</p>
                                            { loan.status == 0 && <p className="">This Loan is still pending approval <Badge type="_removed" title="PENDING"/></p> }
                                            { loan.status == 1 && <p className="">This Loan is  <Badge type="_success" title="APPROVED"/></p> }
                                            { loan.status == 2 && <p className="">This Loan is  <Badge type="removed" title="DECLINED"/></p> }
                                            { loan.status == 3 && <p className="">This Loan is  <Badge type="removed" title="CANCELLED"/></p> }
                                    </div>
                                    <div className="col-md-6 mt-3" style={{ textAlign: "end"}}>
                                        <h6 className="ks-request-text">{ShortDate(loan.inserted_at)}</h6>
                                        {/* <p className="">9:10am</p> */}
                                    </div>
                                <div className="loan-request-row">
                                </div>
                                    <>
                                        <div className="col-md-3">
                                            <label className="ks-label">Type of Loan</label>
                                            <div className="control-div">{loan.loan_type.name}</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="ks-label">Period of Repayment</label>
                                            <div className="control-div">{loan.duration}</div>

                                        </div>
                                        <div className="col-md-3">
                                            <label className="ks-label">Loan Amount</label>
                                            <div className="control-div">{FormatCurrency(loan.loan_amount)}</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="ks-label">Approved Amount</label>
                                            <div className="control-div">{FormatCurrency(loan.approved_amount)}</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="ks-label">Upfront Deduction</label>
                                            <div className="">
                                            { loan.upfront_deduction && <Badge type="_removed" title="True"/>}
                                            { !loan.upfront_deduction && <Badge type="_success" title="False"/> }
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="ks-label">Insurance </label>
                                            <div className="">
                                                { loan.is_insured && <Badge type="_removed" title="True"/>}
                                                { !loan.is_insured && <Badge type="_success" title="False"/> }
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="ks-label">Amount Payable</label>
                                            <div className="control-div">{FormatCurrency(loan.amount_payable)}</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="ks-label">Balance Paid</label>
                                            <div className="control-div">{FormatCurrency(loan.balance_payable) || "0.0"}</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="ks-label">Payback Amount</label>
                                            <div className="control-div">{FormatCurrency(loan.payback_amount)}</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="ks-label">Amount Paid Back</label>
                                            <div className="control-div">{FormatCurrency(loan.amount_paid) || "0.0"}</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="ks-label"> Applied Date</label>
                                            <div className="control-div">{ShortDate(loan.inserted_at)}</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="ks-label"> Approved Date</label>
                                            <div className="control-div">{ShortDate(loan.approved_date)}</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="ks-label"> Start Date</label>
                                            <div className="control-div">
                                                { !loan.loan_payment_status && "Not Yet" }
                                                { loan.loan_payment_status && ShortDate(loan.start_date) }
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="ks-label"> Due Date</label>
                                            <div className="control-div">
                                                { !loan.loan_payment_status && "Not Yet" }
                                                { loan.loan_payment_status && ShortDate(loan.due_date) }
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="ks-label">Total Paid Loan</label>
                                            <div className="control-div">{loan.total_paid || "Not Yet"}</div>
                                        </div>
                                    </>
                                    
                                    
                                    <div className="row justify-content-md-center mt-4 mb-4 col-md-12">
                                        { applied_payslip !== null  && 
                                            <div  className="col-md-3 ks-col">
                                            <div className="d-flex form-card">
                                                <div>
                                                <img src={applied_payslip} style={{width: "50px",height: "56px"}}/>
                                                </div>
                                                <div className="form-card-p-con">
                                                    <p>
                                                    Payslip
                                                    </p>
                                                </div>
                                                
                                            </div>
                                        </div>
                                        }
                                        { appliedLoanGuarantors &&
                                            appliedLoanGuarantors.map((guarantors, key) => 
                                                <div key={key} className="col-md-3 ks-col">
                                                    <div className="d-flex form-card">
                                                        <div>
                                                            { guarantors.member.avatar_url ?
                                                                 <img width="55" height="55" className="form-card-img" src={guarantors.member.avatar_url} alt=""></img>
                                                                :
                                                                <img width="55" height="55" src="/cards-icons/avata.png" alt=""></img>
                                                            }
                                                            
                                                        </div>
                                                        <div className="form-card-p-con">
                                                            <p>
                                                                {guarantors.member.surname} {guarantors.member.other_names}
                                                            {/* <span onClick={() => {
                                                                let new_list  =  loanGuarantors.filter(x => x.id !== guarantor.id)
                                                                this.setState({loanGuarantors: new_list})
                                                            }} className="float-right close-button"> <CrossCircleIcon primaryColor="#FF7452" /></span> */}
                                                            </p>
                                                            <p className="bold">{guarantors.member.staff_no} </p>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            )
                                            
                                        }
                                     </div>
                                    {loan.status == 0 &&
                                        <div className="col-12">
                                            <button className="btn float-right mt-5 btn-danger ml-3 " type="button" onClick={() => cancelLoan()}>
                                                {/* disabled={loading} */}
                                                {/* {
                                                    loading &&
                                                    <Spinner appearance="invert" size="medium"/>
                                                } */}
                                                CANCEL LOAN APPLICATION</button>
                                            </div>
                                    }
                                    
                                </div>
                                
                                <div className="row d-flex justify-content-center">  
                                
                                </div>
                                
                            </form>
                </div>
                    
                }
                
            </div>
        )
    }

}        

export default MobileSingleLoanRequests;
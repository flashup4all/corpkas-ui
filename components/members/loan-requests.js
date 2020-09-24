import React, { Component } from 'react';
import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { createApolloClient } from '../../lib/apolloClient'

import { GET_MEMBER_LOANS} from '../../gql/members'
import { CREATE_LOAN, GET_LOAN_GUARANTORS } from '../../gql/loans'
import Spinner from '@atlaskit/spinner';
import { ToastProvider, useToasts } from 'react-toast-notifications'
import EmptyData from '../../layouts/empty';
import {Badge} from '../../layouts/extras';
import { getUser } from '../../components/shared/local';
import GuarantorAndPayslip from '../../components/shared/component/guarantor-and-payslip';
import swal from '@sweetalert/with-react'
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';

import { Checkbox } from '@atlaskit/checkbox';

const LOAN_TYPES = gql`
query {
    loanTypes {
      id
      name
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


class LoanRequests extends Component {

    constructor(props) {
        super(props);
        this.state = {
            memberLoans: [],
            firstLoan: [],
            sorted: [],
            setMode: 0,
            loanTypes: [],
            loanGuarantors: [],
            appliedLoanGuarantors: [],

            payslip: '',
            loan_type_id: '',
            approved_amount: 0.0,
            loan_amount:0.0,
            monthly_deduction: '',
            upfront_deduction: null,
            upfront_deduction_charge:'',
            is_insured:'',
            insurance_charge: null,
            duration: '',
            reason: '',
            total_deduction: 0.0,
            memberData: this.props.memberData
        }
        console.log(this.state.memberData)
        this.handleGuarantorList = this.handleGuarantorList.bind(this);
        this.handlePayslip = this.handlePayslip.bind(this);
        
    }

    componentDidMount()
    {
        this.getLoanTypes()
        this.getMemberLoans(this.state.memberData.id)
    }
   

    getMemberLoans(member_id){

        createApolloClient.query({
            query: GET_MEMBER_LOANS,
            variables: {member_id: member_id, status: 0},
            fetchPolicy: 'no-cache'
          }).then(response => {
              let {data: {memberLoans}} = response
              console.log(memberLoans)
              let firstLoan= memberLoans[0]
              if(firstLoan)
              {

                this.setState({
                    memberLoans: memberLoans, 
                    sorted: memberLoans, 
                    firstLoan: firstLoan,
                    loan_type_id: firstLoan.loan_type_id,
                    loan_amount: firstLoan.loan_amount,
                    approved_amount: firstLoan.loan_amount,
                    monthly_deduction: firstLoan.monthly_deduction,
                    upfront_deduction: firstLoan.upfront_deduction,
                    upfront_deduction_charge:'',
                    is_insured: firstLoan.is_insured,
                    insurance_charge: firstLoan.insurance_amount,
                    duration: firstLoan.duration,
                    reason: firstLoan.reason,
                    total_deduction: firstLoan.total_deduction
                })
                this.getAppliedLoanGuarantors(firstLoan.id)
              }
              
            }, error => console.log(error))
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
        console.log(id)
        createApolloClient.query({
            query: GET_LOAN_GUARANTORS,
            variables: {loan_id: parseInt(id)}
          }).then(response => {
              let {data: {loanGuarantors}} = response
              console.log(response)
              console.log(loanGuarantors)

              this.setState({
                appliedLoanGuarantors: loanGuarantors, 
                })
            }, error => console.log(error))
    }


    resetForm = () => {
        setLoanTypeId('')
        setLoanAmount('')
        setReason('')
    }


    submit = async (e) => {
        e.preventDefault();
        const { loanGuarantors, payslip} = this.state
        if(payslip == null){
            swal("You must upload payslip", {icon:'error'})
        }
        console.log(getUser())
        console.log(loanGuarantors)
        console.log(payslip)
        // this.createLoan({variables:{loan_type_id: parseInt(loan_type_id), loan_amount, member_id: memberData.id, user_id: parseInt(getUser().id), reason }})
        }
    
    handleGuarantorList(list)
    {
        console.log(list)
        this.setState({loanGuarantors: list})

    }
    handlePayslip(payslip){
        this.setState({payslip: payslip})
        console.log(payslip)
    }
    render(){
        const {appliedLoanGuarantors, memberData, firstLoan, setMode, memberLoans, loanTypes, sorted, 
                loan_type_id, reason, monthly_deduction, duration, loan_amount, is_insured, 
                upfront_deduction, insurance_charge, upfront_deduction_charge, approved_amount, total_deduction} = this.state
        const approveLoan = (e) => {
            e.preventDefault();
            console.log(getUser())
            console.log(approved_amount)
            console.log(upfront_deduction)
            console.log(is_insured)
            console.log(insurance_charge)
        }

        const declineLoan = () =>{
            createApolloClient.mutate({mutation: DECLINE_LOAN, variables:{status: 2, id: parseInt(firstLoan.id)}}).then(response => {
                let {data: {updateLoan}} = response
                console.log(response)
                console.log(updateLoan)
              }, error => console.log(error))
        }
        
        return (
            <div className="grey-container">
                <p className="">Loan Requests</p>
                { setMode == 0 && memberLoans.length > 0 && 
                <div>
                    {memberLoans.length > 0 && 
                            <form onSubmit={approveLoan}>
                                <div className="row mt-5 pb-5 bg-white">
                                    <div className="col-md-6 mt-3">
                                        <p className="ks-request-text">Loan request for ₦ {firstLoan.actual_amount}</p>
                                        <p className="">This Loan is still pending approval <Badge type="_removed" title="PENDING"/></p>
                                    </div>
                                    <div className="col-md-6 mt-3 justify-content-right">
                                    <p className="ks-request-text float-right">{firstLoan.inserted_at}</p>
                                    <p className="">Loan Requests</p>
                                    </div>
                                <div className="loan-request-row">
                                </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Type of Loan</label>
                                        <select className="ks-form-control form-control" 
                                            defaultValue={loan_type_id || ""}
                                            onChange={({ target }) => this.setState({ loan_type_id :target.value})}
                                            >
                                            <option value="">Options</option>
                                            { loanTypes && loanTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Period of Repayment (Months)</label>
                                        <input className="ks-form-control form-control" 
                                            placeholder="18 months" disabled
                                            defaultValue={duration || ""}
                                            onChange={({ target }) => this.setState({ duration :target.value})}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Amount Applied</label>
                                        <input className="ks-form-control form-control"
                                        placeholder="Access Diamond" disabled
                                            defaultValue={loan_amount || ""}
                                            onChange={({ target }) => this.setState({ loan_amount :target.value})}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Approved Amount</label>
                                        <input className="ks-form-control form-control"
                                        placeholder="Access Diamond"
                                            defaultValue={approved_amount || ""}
                                            onChange={({ target }) => {
                                                console.log(target.value)
                                                let calc_monthly_deduction = target.value/duration
                                                this.setState({ approved_amount :target.value, monthly_deduction: calc_monthly_deduction.toFixed(2)})
                                                console.log(monthly_deduction)
                                            }
                                        }
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Monthly Deduction</label>
                                        <input className="ks-form-control form-control"
                                        placeholder="Access Diamond" disabled
                                            value={monthly_deduction || ""}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Reason</label>
                                        <div className="control-div">{reason ? reason : "Nil"}</div>
                                    </div>
                                    <div className="col-md-3 mt-5">
                                        <Checkbox
                                            defaultChecked={is_insured}
                                            label="Apply Insurance"
                                            // value={is_insured}
                                            onChange={({target}) => this.setState({ is_insured: target.checked})}
                                            name="checkbox-default"
                                            testId="cb-default"
                                        />
                                    </div>
                                    <div className="col-md-3 mt-5">
                                        <Checkbox
                                            defaultChecked={upfront_deduction}
                                            // value={upfront_deduction}
                                            label="Upfront Deduction"
                                            onChange={({target}) => this.setState({ upfront_deduction: target.checked})}
                                            name="checkbox-default"
                                            testId="cb-default"
                                        />
                                    </div>
                                    {/* <div className="row col-md-12">
                                        <div className="col-md-3">
                                            <Checkbox
                                                defaultChecked={is_insured}
                                                label="Apply Insurance"
                                                // value={is_insured}
                                                onChange={({target}) => this.setState({ is_insured: target.checked})}
                                                name="checkbox-default"
                                                testId="cb-default"
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <Checkbox
                                                defaultChecked={upfront_deduction}
                                                // value={upfront_deduction}
                                                label="Upfront Deduction"
                                                onChange={({target}) => this.setState({ upfront_deduction: target.checked})}
                                                name="checkbox-default"
                                                testId="cb-default"
                                            />
                                        </div>
                                    </div> */}
                                    {
                                        is_insured && 
                                        <div className="col-md-3">
                                            <label className="ks-label">Insurance Charge (1.5%)</label>
                                            <input className="ks-form-control form-control"
                                            placeholder="Access Diamond"
                                                value={insurance_charge || ""}
                                                onChange={({ target }) => this.setState({ insurance_charge: target.checked})}
                                            />
                                        </div>
                                    }
                                    {
                                        upfront_deduction && 
                                        <div className="col-md-3">
                                            <label className="ks-label">Total Deduction</label>
                                            <input className="ks-form-control form-control"
                                            placeholder="Total Deduction"
                                                value={total_deduction || ""}
                                                onChange={({ target }) => this.setState({upfront_deduction_charge: target.checked})}
                                            />
                                        </div>
                                    }
                                    {/* <div className="row d-flex justify-content-center">
                                        <div className="col-md-4">
                                            <img src="/images/loan.svg" className="img-responsive" alt="Some picture" width="410" height="307"></img>
                                            </div>
                                        <div className="col-md-4">
                                            <p className="text mt-5">We are currently working on your loan and we will get back to you soon with an offer. If you think this is taking longer than it should, feel free to leave us a follow up messgae.</p>
                                        </div>
                                    </div> */}
                                    <div className="row justify-content-md-center mt-4 mb-4 col-md-12">
                                        { appliedLoanGuarantors &&
                                            appliedLoanGuarantors.map(guarantors => 
                                                <div key={guarantors.id} className="col-md-3 ks-col">
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
                                    
                                    {/* <div className="col-md-3">
                                        <label className="ks-label">Monthly Deduction</label>
                                        <input className="ks-form-control form-control"
                                        placeholder="Access Diamond"
                                            value={loan.monthly_deduction || ""}
                                            onChange={({ target }) => setLoanAmount(target.value)}
                                        />
                                    </div> */}

                                    <div className="col-12">
                                    <button className="btn float-left mt-5 btn-danger " type="button" onClick={() => declineLoan()}>
                                        {/* disabled={loading} */}
                                        {/* {
                                            loading &&
                                            <Spinner appearance="invert" size="medium"/>
                                        } */}
                                        DECLINE LOAN</button>
                                        <button className="btn float-right mt-5 " type="submit">
                                        {/* disabled={loading} */}
                                        {/* {
                                            loading &&
                                            <Spinner appearance="invert" size="medium"/>
                                        } */}
                                        APPROVE LOAN</button>
                                    </div>
                                </div>
                                
                                <div className="row d-flex justify-content-center">  
                                
                                </div>
                                
                            </form>
                        
                    }
                </div>
                    
                }
                {setMode == 0 && sorted && !sorted.length &&
                    <div>
                        <EmptyData title="" text=""/>
                        <p className="row align-items-center justify-content-center">You do not have any active loan running currently. 
                        <br />You can click the button below to apply for one.</p> 
                        <div className="row align-items-center justify-content-center">
                            <button className="btn" type="submit" onClick={() => this.setState({ setMode: 1})}>APPLY FOR LOAN</button>
                        </div>
                    </div>
                }
                {
                    setMode == 1 &&
                    <div>
                        <p className="page-title mt-5">Loan Application
                            <span onClick={() => {this.setState({ setMode: 0}) }} className="float-right close-button">Close <CrossCircleIcon primaryColor="#FF7452" /></span>
                        </p>
                    
                        <form onSubmit={this.submit}>
                            <div className="row mt-5 white">
                                <div className="col-md-3">
                                    <label className="ks-label">Type of Loan</label>
                                    <select className="ks-form-control form-control" 
                                        value={loan_type_id || ""}
                                        onChange={({ target }) => this.setState({ loan_type_id :target.value})}
                                        >
                                        <option value="">Options</option>
                                        {
                                            loanTypes && 
                                            loanTypes.map( type => <option key={type.id} value={type.id}>{type.name}</option>)
                                            
                                        }
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="ks-label">Loan Amount</label>
                                    <input className="ks-form-control form-control"
                                    placeholder="E.g 500000 "
                                        value={monthly_deduction || ""}
                                        onChange={({ target }) => this.setState({monthly_deduction: target.value})}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="ks-label">Reason</label>
                                    <input className="ks-form-control form-control"
                                        value={reason || ""}
                                        placeholder="Reason for Application"
                                        onChange={({ target }) => this.setState({ reason: target.value})}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <button className="btn float-right mt-5 " type="submit">APPLY</button>
                                </div>
                            </div>
                            <div className="">
                            {
                                memberData &&
                                <GuarantorAndPayslip selectedMember={memberData} onSelectGuarantors={this.handleGuarantorList} onSelecPayslip={this.handlePayslip}/>
                            }
                            </div>
                        </form>
                    </div>
                }
                
            </div>
        )
    }

}        

export default LoanRequests;
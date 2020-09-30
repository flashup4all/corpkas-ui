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
import { ShortDate, FormatCurrency } from '../../components/shared/utils';

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


class SingleLoanRequests extends Component {

    constructor(props) {
        super(props);
        const {loan} = this.props
        console.log(loan)
        this.state = {
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
                apply_loan_type_id, apply_loan_amount, apply_monthly_net_income, apply_reason, apply_loader, loan
            } = this.state

        const approveLoan = (e) => {
            e.preventDefault();
            swal({
                title: "Are you sure?",
                text: "Approval cannot be undone!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((yes) => {
                if (yes) {
                    this.setState({apply_loader: true})
                    createApolloClient.mutate({
                        mutation: APPROVE_LOAN,
                        // refetchQueries:[{ query: GET_MEMBER_LOANS, variables:{member_id: memberData.id, status: 0}}],
                        variables: {
                            approved_amount: parseFloat(approved_amount), 
                            loan_amount : parseFloat(loan_amount), upfront_deduction, is_insured, 
                            insurance_charge, user_id: parseInt(getUser().id), 
                            member_id: parseInt(memberData.id),
                            loan_type_id: parseInt(loan_type_id),
                            id: parseInt(loan.id)
                        }
                    }).then(response => {
                        let {data: {approveLoan}} = response
                        swal("This Loan Approval was successful", {icon:'success'})
                        this.props.onRefresh();
                        this.setState({apply_loader: false})

                      }, error => console.log(error))
                } else {
                    this.setState({apply_loader: false})
                }
              });
        }

        const checkValidApplication = () => {

            return (apply_monthly_net_income && loanGuarantors.length > 0 && apply_loan_type_id && apply_loan_amount && payslip)
        }

        const declineLoan = () =>{
            swal({
                title: "Are you sure?",
                text: "Decline cannot be undone!",
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
                                status: 2, 
                                id: parseInt(loan.id)
                            }
                        }).then(response => {
                        let {data: {updateLoan}} = response
                        swal("This Loan has been Declined", {icon:'success'})
                      }, error => console.log(error))
                } else {
                  swal("Your imaginary file is safe!");
                }
              });
        }
        
        return (
            <div className="grey-container">
                <p className="">Loan Requests</p>
                { setMode == 0 && loan && 
                <div>
                            <form onSubmit={approveLoan}>
                                <div className="row mt-5 pb-5 bg-white">
                                    <div className="col-md-6 mt-3">
                                        <p className="ks-request-text">Loan request for {FormatCurrency(loan.loan_amount)}</p>
                                            { loan.status == 0 && <p className="">This Loan is still pending approval <Badge type="_removed" title="PENDING"/></p> }
                                            { loan.status == 1 && <p className="">This Loan is  <Badge type="_success" title="APPROVED"/></p> }
                                            { loan.status == 2 && <p className="">This Loan is  <Badge type="removed" title="DECLINED"/></p> }
                                    </div>
                                    <div className="col-md-6 mt-3" style={{ textAlign: "end"}}>
                                        <h6 className="ks-request-text">{ShortDate(loan.inserted_at)}</h6>
                                        {/* <p className="">9:10am</p> */}
                                    </div>
                                <div className="loan-request-row">
                                </div>
                                { loan.status == 0 &&
                                    <>
                                        <div className="col-md-3">
                                            <label className="ks-label">Type of Loan</label>
                                            <select className="ks-form-control form-control" disabled
                                                value={loan_type_id || ""}
                                                onChange={({ target }) => this.setState({ loan_type_id :target.value})}
                                                >
                                                <option value="">Options</option>
                                                { loanTypes && loanTypes.map(type => <option key={type.id} value={type.id}>{type.name} - {type.interest}%</option>)}
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
                                            placeholder="" disabled
                                                defaultValue={loan_amount || ""}
                                                onChange={({ target }) => this.setState({ loan_amount :target.value})}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="ks-label">Approved Amount</label>
                                            <input className="ks-form-control form-control"
                                            placeholder=""
                                                defaultValue={loan_amount || ""}
                                                onChange={({ target }) => {
                                                    let calc_monthly_deduction = target.value/duration
                                                    this.setState({ approved_amount :target.value, monthly_deduction: calc_monthly_deduction.toFixed(2)})
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
                                        <div className="row d-flex justify-content-center">
                                            <div className="col-md-4">
                                                <img src="/images/loan.svg" className="img-responsive" alt="Some picture" width="410" height="307"></img>
                                                </div>
                                            <div className="col-md-4">
                                                <p className="text mt-5">We are currently working on your loan and we will get back to you soon with an offer. If you think this is taking longer than it should, feel free to leave us a follow up messgae.</p>
                                            </div>
                                        </div>
                                    </>
                                }
                                { loan.status !== 0 && 
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

                                }
                                    
                                    
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
                                    
                                    {/* <div className="col-md-3">
                                        <label className="ks-label">Monthly Deduction</label>
                                        <input className="ks-form-control form-control"
                                        placeholder="Access Diamond"
                                            value={loan.monthly_deduction || ""}
                                            onChange={({ target }) => setLoanAmount(target.value)}
                                        />
                                    </div> */}
                                    {loan.status == 0 && 
                                        <div className="col-12">
                                            <button className="btn float-right mt-5 btn-danger ml-3 " type="button" onClick={() => declineLoan()}>
                                                {/* disabled={loading} */}
                                                {/* {
                                                    loading &&
                                                    <Spinner appearance="invert" size="medium"/>
                                                } */}
                                                DECLINE LOAN</button>
                                                <button className="btn float-right mt-5 " disabled={apply_loader} type="submit">
                                                {
                                                    apply_loader &&
                                                    <Spinner appearance="invert" size="medium"/>
                                                }
                                                APPROVE LOAN</button>
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

export default SingleLoanRequests;
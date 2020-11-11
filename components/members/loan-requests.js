import React, { Component } from 'react';
import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { createApolloClient } from '../../lib/apolloClient'

import { GET_MEMBER_LOANS} from '../../gql/members'
import { CREATE_LOAN, GET_LOAN_GUARANTORS, CREAT_LOAN_GUARANTOR, APPROVE_LOAN } from '../../gql/loans'
import Spinner from '@atlaskit/spinner';
import { ToastProvider, useToasts } from 'react-toast-notifications'
import EmptyData from '../../layouts/empty';
import {Badge} from '../../layouts/extras';
import { getUser } from '../../components/shared/local';
import GuarantorAndPayslip from '../../components/shared/component/guarantor-and-payslip';
import swal from '@sweetalert/with-react'
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import { ShortDate, ShortTime, FormatCurrency } from '../../components/shared/utils';
import Loader from '../../layouts/loader';

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


class LoanRequests extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user:{},
            memberLoans: [],
            firstLoan: [],
            sorted: [],
            setMode: 0,
            loanTypes: [],
            loanGuarantors: [],
            appliedLoanGuarantors: [],

            payslip: null,
            applied_payslip:'',
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
            memberData: this.props.memberData,
            apply_loan_type_id: '',
            apply_loan_amount:0.0,
            apply_reason: '',
            apply_monthly_net_income: 0.0,
            apply_loader: false,
            apply_guarantors: [],
            tableLoader: false
        }
        this.handleGuarantorList = this.handleGuarantorList.bind(this);
        this.handlePayslip = this.handlePayslip.bind(this);
        
    }

    componentDidMount()
    {
        this.getLoanTypes()
        this.getMemberLoans(this.state.memberData.id)
        let user = getUser()
        this.setState({user: user})
    }
   

    getMemberLoans(member_id){
        this.setState({tableLoader: true})
        setTimeout(() => {
            createApolloClient.query({
                query: GET_MEMBER_LOANS,
                variables: {member_id: member_id, status: 0},
                fetchPolicy: 'no-cache'
              }).then(response => {
                  let {data: {memberLoans}} = response
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
                        interest_amount: firstLoan.interest_amount,
                        duration: firstLoan.duration,
                        reason: firstLoan.reason,
                        total_deduction: firstLoan.total_deduction,
                        applied_payslip: firstLoan.payslip_url,
                        tableLoader: false
                    })
                    this.getAppliedLoanGuarantors(firstLoan.id)
                  }
                this.setState({tableLoader: false})
                }, error => {
                    this.setState({tableLoader: false})
                })
        }, 500)
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


    submit = async (e) => {
        this.setState({apply_loader: true})
        e.preventDefault();
        const { loanGuarantors, payslip, apply_guarantors} = this.state
        if(payslip == null){
            swal("You must upload payslip", {icon:'error'})
        }
        if(loanGuarantors.length == 0){
            swal("You must provide 2  guarantors", {icon:'error'})
        }
        const {apply_monthly_net_income, apply_loan_amount, apply_loan_type_id, apply_reason, memberData} = this.state
        createApolloClient.mutate({
            mutation: CREATE_LOAN,
            variables:{
                loan_type_id: parseInt(apply_loan_type_id), 
                monthly_net_income: apply_monthly_net_income,
                loan_amount: apply_loan_amount, member_id: memberData.id, 
                user_id: parseInt(getUser().id),
                reason: apply_reason,
                payslip_image: payslip,
            }
        }).then(response => {
            let {data: {createLoan}} = response
            loanGuarantors.map(x => {
                createApolloClient.mutate({
                    mutation: CREAT_LOAN_GUARANTOR,
                    variables: {loan_id: parseInt(createLoan.id), member_id: parseInt(x.id), status: 0}
                }).then(res => {
                    let {data: {createLoanGuarantor}} = res

                }, error => console.log(error))
            })
            this.getMemberLoans(memberData.id)
            swal("Loan Application Successful! awaiting approval", {
                icon: "success",
            });
            this.resetApplyForm()
            
            this.setState({apply_loader: false, setMode: 0})

          }, error => { 
            this.setState({apply_loader: false})
          })
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
        const {interest_amount, tableLoader, user, appliedLoanGuarantors, memberData, firstLoan, setMode, memberLoans, loanTypes, sorted, 
                loan_type_id, reason, monthly_deduction, duration, loan_amount, is_insured, 
                upfront_deduction, insurance_charge, upfront_deduction_charge, approved_amount, total_deduction,
                monthly_net_income, loanGuarantors, applied_payslip, payslip,
                apply_loan_type_id, apply_loan_amount, apply_monthly_net_income, apply_reason, apply_loader
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
                    createApolloClient.mutate({
                        mutation: APPROVE_LOAN,
                        refetchQueries:[{ query: GET_MEMBER_LOANS, variables:{member_id: memberData.id, status: 1}}],
                        variables: {
                            approved_amount: parseFloat(approved_amount), 
                            loan_amount, upfront_deduction, is_insured, 
                            insurance_charge, user_id: parseInt(getUser().id), 
                            member_id: parseInt(memberData.id),
                            loan_type_id: parseInt(loan_type_id),
                            id: parseInt(firstLoan.id)
                        }
                    }).then(response => {
                        let {data: {approveLoan}} = response
                        swal("Loan Approval was successful", {icon:'success'})
                        this.getMemberLoans(memberData.id)
                        this.props.onChangeTab(3);
                      }, error => console.log(error))
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
                                id: parseInt(firstLoan.id)
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
                {tableLoader && <Loader />}
                { setMode == 0 && memberLoans.length > 0 && 
                <div>
                    {memberLoans.length > 0 && 
                            <form onSubmit={approveLoan}>
                                <div className="row mt-5 pb-5 bg-white">
                                    <div className="col-md-6 mt-3">
                                        <p className="ks-request-text">Loan request for ₦ {FormatCurrency(firstLoan.loan_amount)}</p>
                                        <p className="">This Loan is still pending approval <Badge type="_removed" title="PENDING"/></p>
                                    </div>
                                    <div className="col-md-6 mt-3" style={{ textAlign: "end"}}>
                                        <h6 className="ks-request-text">{firstLoan.inserted_at}</h6>
                                        {/* <p className="">9:10am</p> */}
                                    </div>
                                <div className="loan-request-row">
                                </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Type of Loan</label>
                                        <select className="ks-form-control form-control" disabled
                                            defaultValue={loan_type_id || ""}
                                            onChange={({ target }) => this.setState({ loan_type_id :target.value})}
                                            >
                                            <option value="">Options</option>
                                            { loanTypes && loanTypes.map(type => <option key={type.id} value={type.id}>{type.name} - {type.duration}</option>)}
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
                                            defaultValue={FormatCurrency(loan_amount) || ""}
                                            onChange={({ target }) => this.setState({ loan_amount :target.value})}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Approved Amount</label>
                                        <input className="ks-form-control form-control"
                                        placeholder="Access Diamond"
                                            defaultValue={approved_amount || ""}
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
                                            <label className="ks-label">Insurance Charge</label>
                                            <input className="ks-form-control form-control"
                                            placeholder="Access Diamond" disabled
                                                value={insurance_charge || ""}
                                                onChange={({ target }) => this.setState({ insurance_charge: target.checked})}
                                            />
                                        </div>
                                    }
                                    {
                                        upfront_deduction && 
                                        <div className="col-md-3">
                                            <label className="ks-label">Interest Charge</label>
                                            <input className="ks-form-control form-control"
                                            placeholder="Total Deduction" disabled
                                                value={interest_amount || ""}
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
                                    { user.role == 'super_admin' || user.role == 'admin' || user.role == 'manager' && 

                                    <div className="col-12">
                                        <button className="btn float-right mt-5 btn-danger ml-3 " type="button" onClick={() => declineLoan()}>
                                        DECLINE LOAN</button>
                                        <button className="btn float-right mt-5 " type="submit">
                                        APPROVE LOAN</button>
                                    </div>
                                     }
                                </div>
                                
                                <div className="row d-flex justify-content-center">  
                                
                                </div>
                                
                            </form>
                        
                    }
                </div>
                    
                }
                {setMode == 0 && sorted && !sorted.length && !tableLoader &&
                    <div>
                        <EmptyData title="" text=""/>
                        <p className="row align-items-center justify-content-center">You do not have any pending loan currently. 
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
                            <div className="row mt-5">
                                <div className="col-md-3">
                                    <label className="ks-label">Type of Loan</label>
                                    <select className="ks-form-control form-control" 
                                        value={apply_loan_type_id || ""}
                                        onChange={({ target }) => this.setState({ apply_loan_type_id :target.value})}
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
                                        value={apply_loan_amount || ""}
                                        onChange={({ target }) => this.setState({apply_loan_amount: target.value})}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="ks-label">Current Monthly Salary</label>
                                    <input className="ks-form-control form-control"
                                    placeholder="E.g 500000 "
                                        value={apply_monthly_net_income || ""}
                                        onChange={({ target }) => this.setState({apply_monthly_net_income: target.value})}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="ks-label">Reason</label>
                                    <input className="ks-form-control form-control"
                                        value={apply_reason || ""}
                                        placeholder="Reason for Application"
                                        onChange={({ target }) => this.setState({ apply_reason: target.value})}
                                    />
                                </div>
                                <div className="col-md-12">
                                {
                                    memberData &&
                                    <GuarantorAndPayslip selectedMember={memberData} onSelectGuarantors={this.handleGuarantorList} onSelecPayslip={this.handlePayslip}/>
                                }
                                   
                                </div>  
                                <div className="col-md-12">
                                        <button disabled={!checkValidApplication() || apply_loader} className="btn float-right mt-5 " type="submit">
                                            {
                                                apply_loader &&
                                                <Spinner appearance="invert" size="medium"/>
                                            }
                                        APPLY</button>
                                    </div>
                            </div>
                            
                        </form>
                    </div>
                }
                
            </div>
        )
    }

}        

export default LoanRequests;
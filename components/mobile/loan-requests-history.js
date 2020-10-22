import React, { Component } from 'react';
import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { createApolloClient } from '../../lib/apolloClient'

import { GET_MEMBER_LOANS} from '../../gql/members'
import { CREATE_LOAN, GET_LOAN_GUARANTORS, CREAT_LOAN_GUARANTOR, APPROVE_LOAN, FILTER_LOANS } from '../../gql/loans'
import Spinner from '@atlaskit/spinner';
import { ToastProvider, useToasts } from 'react-toast-notifications'
import EmptyData from '../../layouts/empty';
import {Badge} from '../../layouts/extras';
import { getUser } from '../shared/local';
import GuarantorAndPayslip from '../shared/component/guarantor-and-payslip';
import swal from '@sweetalert/with-react'
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import { ShortDate, ShortTime, FormatCurrency } from '../shared/utils';
import MobileSingleLoanRequests from './mobile-single-loan-requests';

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


class MobileLoanHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user:{},
            memberLoans: [],
            sorted: [],
            setMode: 0,
            loanTypes: [],
            loanGuarantors: [],
            memberData: this.props.memberData,
            selectedLoan: {}

        }
        this.handleGuarantorList = this.handleGuarantorList.bind(this);
        this.handlePayslip = this.handlePayslip.bind(this);
        
    }

    componentDidMount()
    {
        this.getLoanTypes()
        // this.getMemberLoans(this.state.memberData.id)
        this.filterLoans({member_id: 4})
        let user = getUser()
        this.setState({user: user})
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
                memberLoans: filterLoans, 
                  sorted: filterLoans,

                })
            }, error => console.log(error))
    }
    getMemberLoans(member_id){

        createApolloClient.query({
            query: GET_MEMBER_LOANS,
            variables: {member_id: member_id, status: 0},
            fetchPolicy: 'no-cache'
          }).then(response => {
              let {data: {memberLoans}} = response
              console.log(memberLoans)
              
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
            swal("Loan Application Successful! awaiting approval", {
                icon: "success",
            });
            this.resetApplyForm()
            this.setState({apply_loader: false})

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
        const {user, memberData, setMode, memberLoans, selectedLoan} = this.state

        

            const showSelectedLoan = (loan) => {
                this.setState({setMode: 1, selectedLoan: loan })
            }

        
        return (
            <>
                { setMode == 0 && 
                    <div className="grey-container">
                    <p className="">Loan Requests</p>
                    { memberLoans && memberLoans.map((loan, index) =>{
                        return (
                            <div key={index} className="row bg-gray pt-3 pb-2" onClick={() => showSelectedLoan(loan)}>
                                <div className="col-7 d-flex">
                                    <div>
                                    {loan.txn_type == 1 && <p className="txn-widget-icon bg-success"><SendIcon primaryColor="white"/></p>}
                                    {loan.txn_type == 2 && <p className="txn-widget-icon bg-danger"><CreditcardIcon primaryColor="white"/> </p>}
                                   
                                    </div>
                                    <div className="pl-3">
                                        <h2 className="bold-h2">{loan.loan_type.name}</h2>
                                        <h3 className="date-h3">{ShortDate(loan.inserted_at)}</h3>
                                    </div>
                                </div>
                                <div className="col-5 ml-0 text-right ">
                                    { loan.status == 1 && <h3 className="green-figure">+ {FormatCurrency(loan.approved_amount)}</h3>}
                                    { loan.status !== 1 && <h3 className="green-figure">+ {FormatCurrency(loan.loan_amount)}</h3>}
                                    { loan.status == 1 && <Badge type='success' title='APPROVED'/>}
                                    { loan.status == 0 && <Badge type='moved' title='PENDING'/>}
                                    { loan.status == 2 && <Badge type='inprogress' title='DECLINED'/>}
                                </div>
                            </div> 
                        )
                    })
                }
                    </div>
                   
                }
                {
                    setMode === 1 &&
                    <div className="p-4">
                        <p className="page-title mt-5">
                            <span onClick={() => this.setState({setMode: 0})} className="float-right close-button">Close <CrossCircleIcon primaryColor="#FF7452" /></span>
                        </p>
                    <MobileSingleLoanRequests loan={selectedLoan} onRefresh={this.refresh}/>
                    </div>
                }
            </>
            
        )
    }

}        

export default MobileLoanHistory;
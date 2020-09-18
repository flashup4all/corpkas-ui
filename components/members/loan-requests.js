import React, { useState } from 'react';
import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { GET_MEMBER_LOANS} from '../../gql/members'
import { CREATE_LOAN } from '../../gql/loans'
import Spinner from '@atlaskit/spinner';
import { ToastProvider, useToasts } from 'react-toast-notifications'
import EmptyData from '../../layouts/empty';
import { getUser } from '../../components/shared/local';
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

const LoanRequests = ({memberData}) =>  {

    const { addToast } = useToasts()
    const [memberLoans, setMemberLoans] = useState([])
    const [firstLoan, setMemberFirstLoan] = useState([])
    const [sorted, setSorted] = useState([])
    const [setMode, setPageMode] = useState(0)
    const [loanTypes, setLoanTypes] = useState([])

        
    // get member loans
    // const filterMemberLoans = (variables) => {
        // const  [filterLoans, {loading, error}] = useMutation( FILTER_LOANS, {
        //     onError: (e) => {
        //         // console.log(e.graphQLErrors[0].message)
        //         console.log(e)
        //         addToast("Validation Error", {
        //             appearance: 'warning',
        //             autoDismiss: true,
        //           })
        //     },
        //     onCompleted: ({filterLoans}) =>{
        //         console.log(filterLoans)
        //         addToast("Loan Application Successful", {
        //             appearance: 'success',
        //             autoDismiss: true,
        //           })
        //           swal("Member has been Updated!", {
        //             icon: "success",
        //          });
        //           resetForm()
        //     },
        //     refetchQueries:[{query: GET_MEMBER_LOANS, variables:{member_id: memberData.id}}]
        // })
    // }
    const {loading, error, data} = useQuery(GET_MEMBER_LOANS,
    {
        variables: {member_id: memberData.id, status: 0},
        onError: (error) => {
            console.log(error)
        },
        onCompleted: ({memberLoans}) =>{
            console.log(memberLoans)
            setMemberLoans(memberLoans)
            setMemberFirstLoan(memberLoans[0])
            setSorted(memberLoans)
        }
    })
    const {loanTypeLoading, loanTypeError, loanTypeData} = useQuery(LOAN_TYPES,
        {
            onError: (error) => {
                console.log(error)
            },
            onCompleted: ({loanTypes}) =>{
                setLoanTypes(loanTypes)

            },
            
        })
        console.log(firstLoan)
    const [loan_type_id, setLoanTypeId] = useState()
    const [loan_amount, setLoanAmount] = useState(firstLoan.loan_amount)
    const [monthly_deduction, setMonthlyDeduction] = useState()
    const [total_deduction, setTotalDeduction] = useState()
    const [total_loan, setTotalLoan] = useState()
    const [total_paid, setTotalPaid] = useState()
    const [upfront_deduction, setUpfrontDeduction] = useState(firstLoan.upfront_deduction)
    const [upfront_deduction_charge, setUpfrontDeductionCharge] = useState()
    const [is_insured, setIsInsured] = useState(firstLoan.is_insured)
    const [insurance_charge, setInsurance] = useState()
    const [amount_payable, setAmountPayable] = useState()
    const [actual_amount, setActualAmount] = useState(firstLoan.actual_amount)
    const [duration, setDuration] = useState(firstLoan.duration)
    const [reason, setReason] = useState(firstLoan.reason)

    // const [account_no, setAccountNo] = useState()
   

    // create loan mutation
    const  [createLoan, {loanLoading, loanError}] = useMutation( CREATE_LOAN, {
        onError: (e) => {
            // console.log(e.graphQLErrors[0].message)
            console.log(e)
            addToast("Validation Error", {
                appearance: 'warning',
                autoDismiss: true,
              })
        },
        onCompleted: ({createLoan}) =>{
            addToast("Loan Application Successful", {
                appearance: 'success',
                autoDismiss: true,
              })
              swal("Member has been Updated!", {
                icon: "success",
             });
              resetForm()
        },
        refetchQueries:[{query: GET_MEMBER_LOANS, variables:{member_id: memberData.id}}]
    })

    const resetForm = () => {
        setLoanTypeId('')
        setLoanAmount('')
        setReason('')
    }


    const submit = async (e) => {
        e.preventDefault();
        console.log(getUser())
        createLoan({variables:{loan_type_id: parseInt(loan_type_id), loan_amount, member_id: memberData.id, user_id: parseInt(getUser().id), reason }})
        }
    
        return (
            <div className="grey-container">
                <p className="">Loan Requests</p>
                { setMode == 0 && memberLoans.length > 0 && 
                <div>
                    {memberLoans.length > 0 && 
                        // setIsInsured(loan.is_insured)
                            // setUpfrontDeduction(loan.upfront_deduction)

                            <form onSubmit={submit}>
                                <div className="row mt-5 pb-5 bg-white">
                                    <div className="col-md-6 mt-3">
                                        <p className="ks-request-text">Loan request for ₦ {firstLoan.actual_amount}</p>
                                        <p className="">Loan Requests</p>
                                    </div>
                                    <div className="col-md-6 mt-3">
                                    <p className="ks-request-text float-right">Loan request for ₦ {firstLoan.actual_amount}</p>
                                    <p className="float-right">Loan Requests</p>
                                    </div>
                                <div className="loan-request-row">
                                </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Type of Loan</label>
                                        <select className="ks-form-control form-control" 
                                            value={loan_type_id || ""}
                                            onChange={({ target }) => setLoanTypeId(target.value)}
                                            >
                                            <option value="">Options</option>
                                            { loanTypes && loanTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                                        </select>
                                    {/* <span style={{color: "red"}}>{errors.staff_no}</span> */}
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Period of Repayment</label>
                                        <input className="ks-form-control form-control" 
                                            placeholder="18 months"
                                            value={duration || ""}
                                            onChange={({ target }) => setDuration(target.value)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Loan Amount</label>
                                        <input className="ks-form-control form-control"
                                        placeholder="Access Diamond"
                                            value={loan_amount || ""}
                                            onChange={({ target }) => setLoanAmount(target.value)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Monthly Deduction</label>
                                        <input className="ks-form-control form-control"
                                        placeholder="Access Diamond"
                                            value={monthly_deduction || ""}
                                            onChange={({ target }) => setLoanAmount(target.value)}
                                        />
                                    </div>
                                    {/* <div className="col-md-3">
                                        <label className="ks-label">Account Number</label>
                                        <input className="ks-form-control form-control"
                                            value={account_no || ""}
                                            placeholder="0026637289"
                                            onChange={({ target }) => setAccountNo(target.value)}
                                        />
                                    </div> */}
                                
                                    <div className="row d-flex justify-content-center">
                                        <div className="col-md-4">
                                            <img src="/images/loan.svg" className="img-responsive" alt="Some picture" width="410" height="307"></img>
                                            </div>
                                        <div className="col-md-4">
                                            <p className="text mt-5">We are currently working on your loan and we will get back to you soon with an offer. If you think this is taking longer than it should, feel free to leave us a follow up messgae.</p>
                                        </div>
                                    </div>
                                    <div className="row col-md-12">
                                        <div className="col-md-3">
                                            <Checkbox
                                                isChecked={is_insured}
                                                label="Apply Insurance"
                                                value={is_insured}
                                                onChange={(e) => setIsInsured(e.target.checked)}
                                                name="checkbox-default"
                                                testId="cb-default"
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <Checkbox
                                                isChecked={upfront_deduction}
                                                value={upfront_deduction}
                                                label="Upfront Deduction"
                                                onChange={(e) => setUpfrontDeduction(e.target.checked)}
                                                name="checkbox-default"
                                                testId="cb-default"
                                            />
                                        </div>
                                    </div>
                                    
                                    {
                                        is_insured && 
                                        <div className="col-md-3">
                                            <label className="ks-label">Insurance Charge</label>
                                            <input className="ks-form-control form-control"
                                            placeholder="Access Diamond"
                                                value={insurance_charge || ""}
                                                onChange={({ target }) => setInsurance(target.value)}
                                            />
                                        </div>
                                    }
                                    {
                                        upfront_deduction && 
                                        <div className="col-md-3">
                                            <label className="ks-label">Upfront Deduction</label>
                                            <input className="ks-form-control form-control"
                                            placeholder="Access Diamond"
                                                value={upfront_deduction_charge || ""}
                                                onChange={({ target }) => setUpfrontDeductionCharge(target.value)}
                                            />
                                        </div>
                                    }
                                    
                                    {/* <div className="col-md-3">
                                        <label className="ks-label">Monthly Deduction</label>
                                        <input className="ks-form-control form-control"
                                        placeholder="Access Diamond"
                                            value={loan.monthly_deduction || ""}
                                            onChange={({ target }) => setLoanAmount(target.value)}
                                        />
                                    </div> */}
                                    <div className="col-12">
                                    <button className="btn float-left mt-5 btn-danger " type="submit">
                                        {/* disabled={loading} */}
                                        {/* {
                                            loading &&
                                            <Spinner appearance="invert" size="medium"/>
                                        } */}
                                        REJECT LOAN</button>
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
                            <button className="btn" type="submit" onClick={() => setPageMode(1)}>APPLY FOR LOAN</button>
                        </div>
                    </div>
                }
                {
                    setMode == 1 &&
                    <div>
                        <p className="page-title mt-5">Loan Application
                            <span onClick={() => {setPageMode(0); }} className="float-right close-button">Close <CrossCircleIcon primaryColor="#FF7452" /></span>
                        </p>
                    
                        <form onSubmit={submit}>
                            <div className="row mt-5 white">
                                <div className="col-md-3">
                                    <label className="ks-label">Type of Loan</label>
                                    <select className="ks-form-control form-control" 
                                        value={loan_type_id || ""}
                                        onChange={({ target }) => setLoanTypeId(target.value)}
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
                                        onChange={({ target }) => setMonthlyDeduction(target.value)}
                                    />
                                </div>
                                <div className="col-md-4">
                                <label className="ks-label">Reason</label>
                                <input className="ks-form-control form-control"
                                    value={reason || ""}
                                    placeholder="Reason for Application"
                                    onChange={({ target }) => setReason(target.value)}
                                />
                            </div>
                                <div className="col-md-2">
                                    <button className="btn float-right mt-5 " type="submit">APPLY</button>
                                </div>
                            </div>
                        </form>
                    </div>
                }
                
            </div>
        )
}

export default LoanRequests;
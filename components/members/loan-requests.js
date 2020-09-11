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
    const [loan_type_id, setLoanTypeId] = useState()
    const [loan_amount, setLoanAmount] = useState()
    const [reason, setReason] = useState()

    // update loan state
    const [duration, setDuration] = useState()
    // const [reason, setReason] = useState()

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
                        memberLoans.map(loan => {
                            return(
                            <form key={loan.id} onSubmit={submit}>
                                <div className="row mt-5 bg-white">
                                <div className="loan-request-row">
                            <p className="ks-request-text">Loan request for ₦ {loan.actual_amount}</p>
                                </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Type of Loan</label>
                                        <select className="ks-form-control form-control" 
                                            value={loan.loan_type_id || ""}
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
                                            value={loan.duration || ""}
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
                                    {/* <div className="col-md-3">
                                        <label className="ks-label">Account Number</label>
                                        <input className="ks-form-control form-control"
                                            value={account_no || ""}
                                            placeholder="0026637289"
                                            onChange={({ target }) => setAccountNo(target.value)}
                                        />
                                    </div> */}
                                
                                
                                </div>
                                <div className="col-12">
                                        <button className="btn float-right mt-5 " type="submit">
                                        {/* disabled={loading} */}
                                        {/* {
                                            loading &&
                                            <Spinner appearance="invert" size="medium"/>
                                        } */}
                                        APPLY</button>
                                    </div>
                            </form>
                            )
                        })
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
                                        value={loan_amount || ""}
                                        onChange={({ target }) => setLoanAmount(target.value)}
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
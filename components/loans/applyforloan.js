import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_LOAN } from '../../gql/loans'
import { getUser } from '../../components/shared/local'
import Spinner from '@atlaskit/spinner';
import {  useToasts } from 'react-toast-notifications'
import { Checkbox } from '@atlaskit/checkbox';

import swal from '@sweetalert/with-react'

const CreateLoan = ({ handleClick, selectedLoanType }) =>  {
    console.log(getUser())
    // const editLoanType = selectedLoanType
    const { addToast } = useToasts()
    const [buttonName, setButtonName] = useState('Create')
    const [showGuarantorsForm, setShowGuarantorsForm] = useState(false)
    // const [name, setName] = useState(editLoanType == null ? '' : editLoanType.name)
    // const [duration, setDuration] = useState(editLoanType == null ? '' : editLoanType.duration)
    // const [interest, setInterest] = useState(editLoanType == null ? '' : editLoanType.interest)
    // const [interest_type, setInterestType] = useState(editLoanType == null ? 1 : editLoanType.interest_type)
    // const [is_insured, setInsurance] = useState(editLoanType == null ? false : editLoanType.is_insured)
    // const [insurance_percent_charge, setInsurancePercentCharge] = useState(editLoanType == null ? 0.0 : editLoanType.insurance_percent_charge)
    // const [upfront_deduction, setUpfrontDeduction] = useState(editLoanType == null ? false : editLoanType.upfront_deduction)
    // const [compare_with_income, setCompareWithIncome] = useState(editLoanType == null ? false : editLoanType.compare_with_income)
    // const [minimum_amount, setMinimumAmount] = useState(editLoanType == null ? 0.0 : editLoanType.minimum_amount)
    // const [maximum_amount, setMaximumAmount] = useState(editLoanType == null ? 0.0 : editLoanType.maximum_amount)
    // const [description, setDescription] = useState(editLoanType == null ? '' : editLoanType.description)
    // const [requirements, setRequirements] = useState(editLoanType == null ? '' : editLoanType.requirements)
    // const [status, setStatus] = useState(editLoanType == null ? '' : editLoanType.status)
    const [loan_amount, setLoanAmount] = useState()
    const [member_id, setMemberId] = useState()
    const [user_id, setUserid] = useState()
    const [loan_type_id, setLoanTypeId] = useState()

    //create staff mutation
    const  [createLoan, {loading, error}] = useMutation( CREATE_LOAN, {
        onError: (e) => {
            console.log(e)
            addToast("Validation Error", {
                appearance: 'warning',
                autoDismiss: true,
              })
        },
        onCompleted: (createLoan) =>{
            addToast("Loan Type Created", {
                appearance: 'success',
                autoDismiss: true,
              })
              swal("Data has been Created!", {
                icon: "success",
            });
              resetForm()
        },
        // refetchQueries: [{ query: LOAN_TYPES }]
    })
    const  [ {createLoanLoading, createError}] = useMutation( CREATE_LOAN, {
        onError: (e) => {
            // console.log(e.graphQLErrors[0].message)
            console.log(e)
            addToast("Validation Error", {
                appearance: 'warning',
                autoDismiss: true,
              })
        },
        onCompleted: (updateLoanType) =>{
            addToast("Loan Type Updated", {
                appearance: 'success',
                autoDismiss: true,
              })
              swal("Data has been Created!", {
                    icon: "success",
                });
              resetForm()
        },
        // refetchQueries: [{ query: LOAN_TYPES}],
        // update: (cache, {data: {updateLoanType}}) => {
        //     try {
        //         let { loanTypes } = cache.readQuery({ query: LOAN_TYPES });
        //         var foundIndex = loanTypes.findIndex(x => x.id == data.id);
        //         loanTypes[foundIndex] = data;
        //         cache.writeQuery({
        //           query: LOAN_TYPES,
        //           data: {
        //               'loanTypes': loanTypes
        //           }
        //         });
        //         LoanSettings.selectTab(0,0)
        //       } catch (e) {
        //           console.log(e)
        //       }
        // }
    })
    const resetForm = () => {
        // setName('')
        // setDuration('')
        // setInterest('')
        // setInterestType('')
        // setInsurance(false)
        // setUpfrontDeduction(false)
        // setCompareWithIncome(false)
        // // setMinimumAmount('')
        // setMaximumAmount('')
        // setDescription('')
        // setRequirements('')
        // setStatus('')
        // setInsurancePercentCharge('')
    }

    let errors = { loan_amount: '', member_id: '', user_id: '', loan_type_id:''};


    const submit = async (e) => {
        e.preventDefault();
        if(createLoan == null)
        {
            createLoan({variables:{ loan_amount: parseFloat(loan_amount),
                member_id: parseInt(getUser().id) , user_id: parseInt(getUser().id), 
                loan_type_id: parseInt(loan_type_id),
               }})
        }
        // else{
        //     updateLoanType({variables:{ id: editLoanType.id, name, duration: parseInt(duration), interest: parseFloat(interest), 
        //         is_insured, insurance_percent_charge: parseFloat(insurance_percent_charge), 
        //         upfront_deduction, status: parseInt(status), minimum_amount: parseFloat(minimum_amount), 
        //         maximum_amount: parseFloat(maximum_amount), description, requirements, user_id: parseInt(getUser().id), 
        //         compare_with_income}})
        // }
        
    }

    const Guarantorsform = () => {
        return(
            <div style={{padding: '20px 0 20px 0'}}>
                
                <form>
                <h5 style={{marginBottom:'-50px'}}>Enter Guarantor(s) Details</h5>
                    <div className="row mt-5">
                    <div className="col-md-3">
                        <label className="ks-label">Staff No</label>
                        <input className="ks-form-control form-control"
                            placeholder="Pu459CS12 "
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Full name</label>
                        <input className="ks-form-control form-control"
                            placeholder="Agada Purest"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">GSM</label>
                        <input className="ks-form-control form-control"
                            placeholder="09000000000"
                            type="number"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Department</label>
                        <input className="ks-form-control form-control"
                            placeholder="Agada Purest"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Email</label>
                        <input className="ks-form-control form-control"
                            placeholder="Agadapurest@gmail.com"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Department</label>
                        <input className="ks-form-control form-control"
                            placeholder="Computer Science"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Membership Number</label>
                        <input className="ks-form-control form-control"
                            placeholder="Agada Purest"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                            <label className="ks-label">Type of Loan</label>
                            <select className="ks-form-control form-control"
                                // value={status || ""}
                                // onChange={({ target }) => setStatus(target.value)} 
                            >
                                <option value="">Option 1 </option>
                                <option value="1">Option 2</option>
                                <option value="0">Option 3</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                        <label className="ks-label">Amount Requested</label>
                        <input className="ks-form-control form-control"
                            placeholder="120,000"
                            type="number"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Period of Payment</label>
                        <input className="ks-form-control form-control"
                            placeholder="18 months"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                            <label className="ks-label">Select your bank</label>
                            <select className="ks-form-control form-control"
                                // value={status || ""}
                                // onChange={({ target }) => setStatus(target.value)} 
                            >
                                <option value="">Access Bank </option>
                                <option value="1">UBA</option>
                                <option value="0">Zenith Bank</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                        <label className="ks-label">Account Number</label>
                        <input className="ks-form-control form-control"
                            placeholder="18 months"
                            type="number"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    </div>
                </form> <br></br>
                <form>
                    <div style={{marginBottom:'-65px', paddingTop:'20px'}}>
                        <h5>Enter Guarantor(s) Details</h5>
                        <h6 style={{color:'#a4a4a4'}}>First Guarantor</h6>
                    </div>
                    <div className="row mt-5">
                    <div className="col-md-3">
                        <label className="ks-label">Staff No</label>
                        <input className="ks-form-control form-control"
                            placeholder="KW459CS12"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Full Name</label>
                        <input className="ks-form-control form-control"
                            placeholder="Kwatmi Tyrone"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                            <label className="ks-label">Select your bank</label>
                            <select className="ks-form-control form-control"
                                // value={status || ""}
                                // onChange={({ target }) => setStatus(target.value)} 
                            >
                                <option value="">Access Bank</option>
                                <option value="1">UBA</option>
                                <option value="0">Zenith Bank</option>
                            </select>
                        </div>
                    <div className="col-md-3">
                        <label className="ks-label">Account Number</label>
                        <input className="ks-form-control form-control"
                            placeholder="00130000000"
                            type="number"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    </div><div style={{marginBottom:'-65px', paddingTop:'20px'}}>
                        <h6 style={{color:'#a4a4a4'}}>Second Guarantor</h6>
                    </div>
                    <div className="row mt-5">
                    <div className="col-md-3">
                        <label className="ks-label">Staff No</label>
                        <input className="ks-form-control form-control"
                            placeholder="KW459CS12"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Full Name</label>
                        <input className="ks-form-control form-control"
                            placeholder="Kwatmi Tyrone"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                            <label className="ks-label">Select your bank</label>
                            <select className="ks-form-control form-control"
                                // value={status || ""}
                                // onChange={({ target }) => setStatus(target.value)} 
                            >
                                <option value="">Access Bank</option>
                                <option value="1">UBA</option>
                                <option value="0">Zenith Bank</option>
                            </select>
                        </div>
                    <div className="col-md-3">
                        <label className="ks-label">Account Number</label>
                        <input className="ks-form-control form-control"
                            placeholder="00130000000"
                            type="number"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    </div>
                    <div style={{marginBottom:'-65px', paddingTop:'20px'}}>
                        <h6 style={{color:'#a4a4a4'}}>Third Guarantor</h6>
                    </div>
                    <div className="row mt-5">
                    <div className="col-md-3">
                        <label className="ks-label">Staff No</label>
                        <input className="ks-form-control form-control"
                            placeholder="KW459CS12"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Full Name</label>
                        <input className="ks-form-control form-control"
                            placeholder="Kwatmi Tyrone"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                            <label className="ks-label">Select your bank</label>
                            <select className="ks-form-control form-control"
                                // value={status || ""}
                                // onChange={({ target }) => setStatus(target.value)} 
                            >
                                <option value="">Access Bank</option>
                                <option value="1">UBA</option>
                                <option value="0">Zenith Bank</option>
                            </select>
                        </div>
                    <div className="col-md-3">
                        <label className="ks-label">Account Number</label>
                        <input className="ks-form-control form-control"
                            placeholder="00130000000"
                            type="number"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-12">
                            <button className="btn float-right mt-5" type="submit">
                                Apply for Loan
                            {/* {
                                 disabled={loading}
                                loading &&
                                <Spinner appearance="invert" size="medium"/>
                            } */}
                            {/* {createLoan == null ? "Create" : ""} */}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }

    const checkBoxValue = (e,) => {
        console.log(e)
    }

        return (
            <div className="" style={{padding:'20px'}}>
                <form onSubmit={(e) => submit(e)}>
                <h5 style={{marginBottom:'-65px', paddingTop:'20px'}}>Enter Loan Details</h5>
                <div className="row mt-5">
                    <div className="col-md-3">
                            <label className="ks-label">Staff ID</label>
                            <input className="ks-form-control form-control"
                                placeholder="e.g KASU001"
                                type="number"
                                value={member_id || ""}
                                onChange={({ target }) => setMemberId(target.value)}
                             />
                    </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-md-3">
                            <label className="ks-label">Loan Amount</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g 10000"
                                value={loan_amount || ""}
                                onChange={({ target }) => setLoanAmount(target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">User ID</label>
                            <input className="ks-form-control form-control"
                                type="number"
                                value={user_id || ""}
                                placeholder="e.g KASU001"
                                onChange={({ target }) => setUserid(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Loan Type ID</label>
                            <input className="ks-form-control form-control"
                                type="number"
                                value={loan_type_id || ""}
                                placeholder="e.g 1"
                                onChange={({ target }) => setLoanTypeId(target.value)}
                             />
                        </div>
                        {/* <div className="col-md-3">
                            <label className="ks-label">Select Your Bank</label>
                            <select className="ks-form-control form-control"
                                value={status || ""}
                                onChange={({ target }) => setStatus(target.value)} 
                            >
                                <option value="">Options</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div> */}
                       
                        <div className="col-3">
                            <button className="btn float-right mt-5 " onClick={() => {setShowGuarantorsForm(true)}} type="submit">
                                Next Step
                            {/* {
                                 disabled={loading}
                                loading &&
                                <Spinner appearance="invert" size="medium"/>
                            } */}
                            {createLoan == null ? "Create" : ""}</button>
                        </div>
                    </div>
                </form>
                { showGuarantorsForm && 
                    <Guarantorsform />
                }
            </div>
        )
}

export default CreateLoan;
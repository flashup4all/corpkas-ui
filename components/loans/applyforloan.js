import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_LOAN } from '../../gql/loans'
import { getUser } from '../../components/shared/local'
import { Radio } from '@atlaskit/radio';
import Spinner from '@atlaskit/spinner';
import {  useToasts } from 'react-toast-notifications'
import Autosuggest from 'react-autosuggest';
import { Checkbox } from '@atlaskit/checkbox';
import swal from '@sweetalert/with-react'


const CreateLoan = ({ handleClick, selectedLoanType }) =>  {
    console.log(getUser())
    const { addToast } = useToasts()
    const [buttonName, setButtonName] = useState('Create')
    const [showGuarantorsForm, setShowGuarantorsForm] = useState(false)
    const [loan_amount, setLoanAmount] = useState()
    const [member_id, setMemberId] = useState()
    const [user_id, setUserid] = useState()
    const [loan_type_id, setLoanTypeId] = useState()
    const setMode = useState(0)

    //create loan mutation
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
            <div className="ks-guarantorform">
                 {
            setMode === 1 &&
            <div className="p-4">
                    <span onClick={() => setState({setMode: 1})} className="float-right close-button">Close <CrossCircleIcon primaryColor="#FF7452" /></span>
            </div>
        }
                <form>
                <h5 className="ks-guarantordetail">Enter Loan Details</h5>
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
                    <div className="ks-guarantorform-header">
                        <h5>Enter Guarantor(s) Details</h5>
                        <p className="ks-subheader">You are almost there...just provide us a few more information</p>
                        <h6 className="ks-guarantor-label">First Guarantor</h6>
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
                                <option>Select your bank</option>
                                <option value="2">Access Bank</option>
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
                    </div><div className="ks-guarantorform-header">
                        <h6 className="ks-guarantor-label">Second Guarantor</h6>
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
                                <option>Select your bank</option>
                                <option value="2">Access Bank</option>
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
                    <div className="ks-guarantorform-header">
                        <h6 className="ks-guarantor-label">Third Guarantor</h6>
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
                                <option>Select your bank</option>
                                <option value="2">Access Bank</option>
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
                    <div className="col-md-3 ks-guarantor-radio">
                        <Radio
                            value="default radio"
                            // label="Accept Applicant's Undertaking"
                            name="radio-default"
                            testId="radio-default"
                            isChecked={true}
                            onChange={() => {}}
                            />
                            <p className="ks-guarantor-radio-text">Accept Applicant's Undertaking</p>
                    </div>
                    <div className="col-md-3 ks-guarantor-radio">
                        <Radio
                            value="default radio"
                            // label="Accept Insurance Guarantee"
                            name="radio-default"
                            testId="radio-default"
                            isChecked={false}
                            onChange={() => {}}
                            />
                            <p className="ks-guarantor-radio-text">Accept Insurance Guarantee</p>
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
            
            <div className="Ks-createloan">
                {/* {setMode === 1 && */}
                <form onSubmit={(e) => submit(e)}>
                <h5 className="ks-guarantorform-header">Enter Loan Details</h5>
                <div className="row mt-5">
                    <div className="col-md-3">
                            <label className="ks-label">Staff ID</label>
                            <input className="ks-form-control form-control"
                                placeholder="e.g KASU001"
                                value={member_id || ""}
                                onChange={({ target }) => setMemberId(target.value)}
                             />
                    </div>
                    <div className="col-md-3">
                            <label className="ks-label">Loan Amount</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g 10000"
                                type="number"
                                value={loan_amount || ""}
                                onChange={({ target }) => setLoanAmount(target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">User ID</label>
                            <input className="ks-form-control form-control"
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
                    </div>
                    <div className="row mt-5">
                        <div className="col-12">
                            <button className="btn float-right mt-1 " onClick={() => {setShowGuarantorsForm(true)}} type="submit">
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
                {/* } */}
                { showGuarantorsForm && 
                    <Guarantorsform />
                }
            
            </div>
           
        )
}

export default CreateLoan;
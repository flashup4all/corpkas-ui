import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_LOAN_TYPE, UPDATE_LOAN_TYPE, LOAN_TYPES } from '../../gql/loans'
import { getUser } from '../../components/shared/local'
import Spinner from '@atlaskit/spinner';
import {  useToasts } from 'react-toast-notifications'
import { Checkbox } from '@atlaskit/checkbox';

import swal from '@sweetalert/with-react'

const AddLoanType = ({ handleClick, selectedLoanType }) =>  {
    const editLoanType = selectedLoanType
    const { addToast } = useToasts()
    const [buttonName, setButtonName] = useState('Create')
    const [name, setName] = useState(editLoanType == null ? '' : editLoanType.name)
    const [duration, setDuration] = useState(editLoanType == null ? '' : editLoanType.duration)
    const [interest, setInterest] = useState(editLoanType == null ? '' : editLoanType.interest)
    const [interest_type, setInterestType] = useState(editLoanType == null ? 1 : editLoanType.interest_type)
    const [is_insured, setInsurance] = useState(editLoanType == null ? false : editLoanType.is_insured)
    const [insurance_percent_charge, setInsurancePercentCharge] = useState(editLoanType == null ? 0.0 : editLoanType.insurance_percent_charge)
    const [upfront_deduction, setUpfrontDeduction] = useState(editLoanType == null ? false : editLoanType.upfront_deduction)
    const [compare_with_income, setCompareWithIncome] = useState(editLoanType == null ? false : editLoanType.compare_with_income)
    const [minimum_amount, setMinimumAmount] = useState(editLoanType == null ? 0.0 : editLoanType.minimum_amount)
    const [maximum_amount, setMaximumAmount] = useState(editLoanType == null ? 0.0 : editLoanType.maximum_amount)
    const [description, setDescription] = useState(editLoanType == null ? '' : editLoanType.description)
    const [requirements, setRequirements] = useState(editLoanType == null ? '' : editLoanType.requirements)
    const [status, setStatus] = useState(editLoanType == null ? '' : editLoanType.status)
    //create staff mutation
    const  [createLoanType, {loading, error}] = useMutation( CREATE_LOAN_TYPE, {
        onError: (e) => {
            console.log(e)
            addToast("Validation Error", {
                appearance: 'warning',
                autoDismiss: true,
              })
        },
        onCompleted: (createLoanType) =>{
            addToast("Loan Type Created", {
                appearance: 'success',
                autoDismiss: true,
              })
              swal("Data has been Created!", {
                icon: "success",
            });
              resetForm()
        },
        refetchQueries: [{ query: LOAN_TYPES }]
    })
    const  [updateLoanType, {updateLoading, updateError}] = useMutation( UPDATE_LOAN_TYPE, {
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
            //   resetForm()
        },
        refetchQueries: [{ query: LOAN_TYPES}],
    })
    const resetForm = () => {
        setName('')
        setDuration('')
        setInterest('')
        setInterestType('')
        setInsurance(false)
        setUpfrontDeduction(false)
        setCompareWithIncome(false)
        // setMinimumAmount('')
        setMaximumAmount('')
        setDescription('')
        setRequirements('')
        setStatus('')
        setInsurancePercentCharge('')
    }

    let errors = { staff_no: '', surname: '', other_names: '', dept:'', rank:'', gender: '', dob: '', current_monthly_income:'', monthly_contribution:'', phone_number: '', alt_phone_number:'', status:'', role:'', email:'', password: '' };


    const submit = async (e) => {
        e.preventDefault();
        if(editLoanType == null)
        {
            createLoanType({variables:{ name, duration: parseInt(duration), interest: parseFloat(interest), 
                is_insured, insurance_percent_charge: parseFloat(insurance_percent_charge), 
                upfront_deduction, status: parseInt(status), minimum_amount: parseFloat(minimum_amount), 
                maximum_amount: parseFloat(maximum_amount), description, requirements, user_id: parseInt(getUser().id), 
                compare_with_income}})
        }else{
            updateLoanType({variables:{ id: editLoanType.id, name, duration: parseInt(duration), interest: parseFloat(interest), 
                is_insured, insurance_percent_charge: parseFloat(insurance_percent_charge), 
                upfront_deduction, status: parseInt(status), minimum_amount: parseFloat(minimum_amount), 
                maximum_amount: parseFloat(maximum_amount), description, requirements, user_id: parseInt(getUser().id), 
                compare_with_income}})
        }
        
    }
    const checkBoxValue = (e,) => {
        console.log(e)
    }
    const checkValid = () => {
        return (name && duration && maximum_amount && interest && insurance_percent_charge && status)
    }
        return (
            <div className="">
                <form onSubmit={(e) => submit(e)}>
                    <div className="row mt-5">
                        <div className="col-md-3">
                            <label className="ks-label">Loan Type</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g Emergency Loan"
                                value={name || ""}
                                onChange={({ target }) => setName(target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Max Duration (Months)</label>
                            <input className="ks-form-control form-control"
                                placeholder="e.g 3"
                                type="number"
                                value={duration || ""}
                                onChange={({ target }) => setDuration(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Max Amount</label>
                            <input className="ks-form-control form-control"
                                type="number"
                                value={maximum_amount || ""}
                                placeholder="e.g 50000.00"
                                onChange={({ target }) => setMaximumAmount(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Interest Rate (%)</label>
                            <input className="ks-form-control form-control"
                                type="number"
                                value={interest || ""}
                                placeholder="e.g 5"
                                onChange={({ target }) => setInterest(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Insurance Rate (%)</label>
                            <input className="ks-form-control form-control"
                                type="number"
                                value={insurance_percent_charge || ""}
                                placeholder="e.g 5"
                                onChange={({ target }) => setInsurancePercentCharge(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Description</label>
                            <input className="ks-form-control form-control"
                                value={description || ""}
                                placeholder="e.g Loan Details"
                                onChange={({ target }) => setDescription(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Loan Requirements</label>
                            <input className="ks-form-control form-control" 
                                placeholder=""
                                value={requirements || ""}
                                onChange={({ target }) => setRequirements(target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Account Status</label>
                            <select className="ks-form-control form-control"
                                value={status || ""}
                                onChange={({ target }) => setStatus(target.value)} 
                            >
                                <option value="">Options</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                        <div className="col-md-3 mt-4">
                            <Checkbox
                                isChecked={is_insured}
                                label="Apply Insurance"
                                value={is_insured}
                                onChange={(e) => setInsurance(e.target.checked)}
                                name="checkbox-default"
                                testId="cb-default"
                            />
                        </div>
                        <div className="col-md-3 mt-4">
                        <Checkbox
                                isChecked={upfront_deduction}
                                value={upfront_deduction}
                                label="Upfront Deduction"
                                onChange={(e) => setUpfrontDeduction(e.target.checked)}
                                name="checkbox-default"
                                testId="cb-default"
                            />
                        </div>
                        <div className="col-md-3 mt-4">
                        <Checkbox
                                isChecked={compare_with_income}
                                value={compare_with_income}
                                label="Compare With Income"
                                onChange={(e) => setCompareWithIncome(e.target.checked)}
                                name="checkbox-default"
                                testId="cb-default"
                            />
                        </div>
                        <div className="col-12">
                            <button disabled={loading || !checkValid()}  className="btn float-right mt-5 " type="submit">
                            {
                                loading &&
                                <Spinner appearance="invert" size="medium"/>
                            }
                            {editLoanType == null ? "Create" : "Update"}</button>
                        </div>
                    </div>
                </form>
            </div>
        )
}

export default AddLoanType;
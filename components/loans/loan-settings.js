import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { LOAN_SETTING, UPDATE_LOAN_SETTING } from '../../gql/loans'
import Spinner from '@atlaskit/spinner';
import { ToastProvider, useToasts } from 'react-toast-notifications'
import { Checkbox } from '@atlaskit/checkbox';
import swal from '@sweetalert/with-react'

const LoanSetting = ({loanSettingData}) =>  {
    const { addToast } = useToasts(null)
    const loanSetting = loanSettingData
    const [membership_duration_value, setMembershipDurationValue] = useState(loanSetting.membership_duration_value)
    const [monthly_threshold, setMonthlyThreshold] = useState( loanSetting ? loanSetting.monthly_threshold : '')
    const [check_maximum_active_loans, setCheckMaximumActiveLoans] = useState(loanSetting ? loanSetting.check_maximum_active_loans : false)
    const [check_membership_duration, setCheckMembershipDuration] = useState(loanSetting ? loanSetting.check_membership_duration : false)
    const [check_monthly_net_eligibility, setCheckMonthlyNetEligibility] = useState(loanSetting ? loanSetting.check_monthly_net_eligibility : false)
    const [eligibility_monthly_net_charge_percent, setEligibilityMonthlyNetChargePercent] = useState(loanSetting ? loanSetting.eligibility_monthly_net_charge_percent : 0.0)
    const [insurance_percentage_charge, setInsurancePercentageCharge] = useState(loanSetting ? loanSetting.insurance_percentage_charge : 0.0)
    const [maximum_active_loans, setMaximumActiveLoans] = useState(loanSetting ? loanSetting.maximum_active_loans : '')
    const [set_insurance, setInsurance] = useState(loanSetting ? loanSetting.set_insurance : false)
 
    

    //update loan setting mutation
    

    const  [updateLoanSettings, {loading, error}] = useMutation( UPDATE_LOAN_SETTING, {
        onError: (e) => {
            console.log(e)
            addToast("Validation Error", {
                appearance: 'warning',
                autoDismiss: true,
              })
        },
        onCompleted: (updateLoanSettings) =>{
            addToast("Loan Settings Updated", {
                appearance: 'success',
                autoDismiss: true,
              })
              swal("Loan Settings Updated!", {
                icon: "success",
            });
            //   resetForm()
        },
        refetchQueries: [{ query: LOAN_SETTING }]
    })

    let errors = { staff_no: '', surname: '', other_names: '', dept:'', rank:'', gender: '', dob: '', current_monthly_income:'', monthly_contribution:'', phone_number: '', alt_phone_number:'', status:'', role:'', email:'', password: '' };

  

    const submit = async (e) => {
        e.preventDefault();
        updateLoanSettings({variables:{
            set_insurance,
            membership_duration_value: parseInt(membership_duration_value),
            monthly_threshold: parseFloat(monthly_threshold),
            check_maximum_active_loans,
            check_membership_duration,
            check_monthly_net_eligibility,
            eligibility_monthly_net_charge_percent: parseFloat(eligibility_monthly_net_charge_percent),
            insurance_percentage_charge: parseFloat(insurance_percentage_charge),
            maximum_active_loans: parseInt(maximum_active_loans), id: loanSetting.id}})

    }
        return (
            <div className="p-2">
                {loanSetting && 
                    <form onSubmit={submit}>
                    <div className="row mt-5">
                    <div className="col-md-6">
                        <Checkbox
                                isChecked={check_maximum_active_loans}
                                label="No. of Active Loans"
                                value={check_maximum_active_loans}
                                onChange={(e) => setCheckMaximumActiveLoans(e.target.checked)}
                                name="checkbox-default"
                                testId="cb-default"
                            />
                            { check_maximum_active_loans &&
                                <>
                                <label className="ks-label">Maximum Active Loans</label>
                                <input className="ks-form-control form-control" 
                                    type="number" 
                                    placeholder="Eg. 1"
                                    value={maximum_active_loans || ""}
                                    onChange={({ target }) => setMaximumActiveLoans(target.value)}
                                />
                                </>
                            }
                            
                        </div>
                        <div className="col-md-6">
                        <Checkbox
                                isChecked={check_membership_duration}
                                label="Check Membership Duration"
                                value={check_membership_duration}
                                onChange={(e) => setCheckMembershipDuration(e.target.checked)}
                                name="checkbox-default"
                                testId="cb-default"
                            />
                            { check_membership_duration &&
                                <div>
                                <label className="ks-label">Membership Duration (Months)</label>
                                <input className="ks-form-control form-control" 
                                    placeholder="How long before a new member can apply for loan"
                                    type="number"
                                    value={membership_duration_value || ""}
                                    onChange={({ target }) => setMembershipDurationValue(target.value)}
                                />
                                </div>
                            }
                            
                        </div>
                        <div className="col-md-6 mt-3">
                        <Checkbox
                                isChecked={set_insurance}
                                label="Apply Insurance"
                                value={set_insurance}
                                onChange={(e) => setInsurance(e.target.checked)}
                                name="checkbox-default"
                                testId="cb-default"
                            />
                            { set_insurance &&
                                <>
                                <label className="ks-label">Insurance Charge (%)</label>
                                <input className="ks-form-control form-control" 
                                    type="number"
                                    placeholder="E.g 1.5"
                                    value={insurance_percentage_charge || ""}
                                    onChange={({ target }) => setInsurancePercentageCharge(target.value)}
                                />
                                </>
                            }
                            
                        </div>
                        <div className="col-md-6 mt-3">
                        <Checkbox
                                isChecked={check_monthly_net_eligibility}
                                label="Check Monthly Net Balance After Loan"
                                value={check_monthly_net_eligibility}
                                onChange={(e) => setCheckMonthlyNetEligibility(e.target.checked)}
                                name="checkbox-default"
                                testId="cb-default"
                            />
                            { check_monthly_net_eligibility &&
                                <>
                                <label className="ks-label">Default Monthly Left Balance (%)</label>
                                <input className="ks-form-control form-control" 
                                    type="number"
                                    placeholder="E.g 33.333%"
                                    value={eligibility_monthly_net_charge_percent || ""}
                                    onChange={({ target }) => setEligibilityMonthlyNetChargePercent(target.value)}
                                />
                                </>
                            }
                            
                        </div>
                        <div className="col-md-6">
                            <label className="ks-label">Monthly Threshold Amount {errors && errors.staff_no}</label>
                            <input 
                                className="ks-form-control form-control" 
                                placeholder="Enter amount"
                                type="number"
                                value={monthly_threshold || ""}
                                onChange={({ target }) => setMonthlyThreshold(target.value)}
                            />
                         <span style={{color: "red"}}>{errors.staff_no}</span>                            
                        </div>
                        <div className="col-12">
                            <button disabled={loading}  className="btn float-right mt-5 " type="submit">
                            {
                                loading &&
                                <Spinner appearance="invert" size="medium"/>
                            }
                           UPDATE AND SAVE</button>
                        </div>
                    </div>
                </form>
                }
                
            </div>
        )
}

export default LoanSetting;
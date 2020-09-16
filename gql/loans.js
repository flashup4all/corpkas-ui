import { gql } from '@apollo/client';

//loan types
export const LOAN_TYPES = gql`
query {
  loanTypes {
    id
    name
    interest
    interest_type
    requirements
    insurance_percent_charge
    is_insured
    insurance_percent_charge
    description
    duration
    status
    minimum_amount
    maximum_amount
    upfront_deduction
    user_id
    inserted_at
    updated_at
}
  }
`;

export const CREATE_LOAN_TYPE = gql`
  mutation createLoanType(
    $description: String,
    $requirements: String,
     $name: String!,
     $interest: Int!,
     $duration: String!,
     $is_insured: String!,
     $insurance_percent_charge: String!,
     $maximum_amount: String!,
     $minimum_amount: String!,
     $upfront_deduction: String!,
     $compare_with_income: String!,
     $user_id: Int!,
     $status: Int!,
     ) {
    createLoanType(loanType: {
      name: $name,
      requirements: $requirements,
      description: $description,
      duration: $duration,
      isInsured: $is_insured
      insurancePercentCharge: $insurance_percent_charge
      maximum_amount: $maximum_amount
      minimum_amount: $minimum_amount
      status: $status
      upfront_deduction: $upfront_deduction
      compare_with_income: $compare_with_income
      interest: $interest,
      user_id: $user_id
      
    }){
        
      id
      name
      interest
      interest_type
      requirements
      insurance_percent_charge
      is_insured
      insurance_percent_charge
      description
      duration
      status
      minimum_amount
      maximum_amount
      upfront_deduction
      compare_with_income
      user_id
      }
  }
`;

export const UPDATE_LOAN_TYPE = gql`
  mutation updateLoanType(
    $description: String,
    $requirements: String,
     $name: String!,
     $interest: Int!,
     $duration: String!,
     $is_insured: String!,
     $insurance_percent_charge: String!,
     $maximum_amount: String!,
     $minimum_amount: String!,
     $upfront_deduction: String!,
     $compare_with_income: String!,
     $user_id: Int!,
     $status: Int!,
     $id: Int!,
     ) {
    updateLoanType(loanType: {
      name: $name,
      requirements: $requirements,
      description: $description,
      duration: $duration,
      isInsured: $is_insured
      insurancePercentCharge: $insurance_percent_charge
      maximum_amount: $maximum_amount
      minimum_amount: $minimum_amount
      status: $status
      upfront_deduction: $upfront_deduction
      compare_with_income: $compare_with_income
      interest: $interest,
      user_id: $user_id
    }, id: $id){
        
      id
      name
      interest
      interest_type
      requirements
      insurance_percent_charge
      is_insured
      insurance_percent_charge
      description
      duration
      status
      minimum_amount
      maximum_amount
      upfront_deduction
      compare_with_income
      user_id
      }
  }
`;
export const DELETE_LOAN_TYPE = gql`
mutation deleteLoanType($id: Int) {
  deleteLoanType(id: $id) {
    id
    name
    interest
    interest_type
    requirements
    insurance_percent_charge
    is_insured
    insurance_percent_charge
    description
    duration
    status
    minimum_amount
    maximum_amount
    upfront_deduction
    compare_with_income
    user_id
    inserted_at
  }
}
`;


//loan settings

export const LOAN_SETTING = gql`
query {
  getLoanSetting {
    id
    check_maximum_active_loans
    check_membership_duration
    check_monthly_net_eligibility
    eligibility_monthly_net_charge_percent
    inserted_at
    insurance_percentage_charge
    maximum_active_loans
    membership_duration_value
    monthly_threshold
    set_insurance
    updated_at
  }
}
`;

export const UPDATE_LOAN_SETTING = gql`
mutation updateLoanSetting(
  $membership_duration_value: Int,
  $monthly_threshold: String,
  $check_maximum_active_loans: String,
  $check_membership_duration: String,
  $check_monthly_net_eligibility: String,
  $eligibility_monthly_net_charge_percent: String,
  $insurance_percentage_charge: String,
  $maximum_active_loans: String,
  $set_insurance: String,
  $id: Int!
) {
  updateLoanSetting(loanSettings: {
    membership_duration_value: $membership_duration_value,
    monthly_threshold: $monthly_threshold,
    check_maximum_active_loans: $check_maximum_active_loans,
    check_membership_duration: $check_membership_duration,
    check_monthly_net_eligibility: $check_monthly_net_eligibility,
    eligibility_monthly_net_charge_percent: $eligibility_monthly_net_charge_percent,
    insurance_percentage_charge: $insurance_percentage_charge,
    maximum_active_loans: $maximum_active_loans,
    set_insurance: $set_insurance,
  }, id: $id){
    id
    membership_duration_value
    monthly_threshold
    check_maximum_active_loans
    check_membership_duration
    check_monthly_net_eligibility
    eligibility_monthly_net_charge_percent
    insurance_percentage_charge
    maximum_active_loans
    set_insurance
    
  }
}`;


//loans

export const CREATE_LOAN = gql`
  mutation createLoan(
    $loan_amount: String!,
    $member_id: Int!,
    $user_id: Int!,
    $loan_type_id: Int!
  ) {
      createLoan(loan: {
      loan_amount: $loan_amount,
      member_id: $member_id,
      user_id: $user_id,
      loan_type_id: $loan_type_id
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
`;

export const FILTER_LOANS = gql`
  mutation filterLoans(
    $loan_amount: String,
    $member_id: Int,
    $loan_type_id: Int
    $status: Int
    $upfront_deduction: Int
  ) {
    filterLoans(loan: {
      loan_amount: $loan_amount,
      member_id: $member_id,
      loan_type_id: $loan_type_id
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
`;

export const GET_LOANS = gql`
query ($page: Int!){
  paginateLoans(page: $page) {
    entries{
      id
      actual_amount
      amount_payable
      approved_date
      detail
      due_date
      insurance_amount
      insurance_percent
      interest_amount
      interest_percent
      is_insured
      duration
      loan_amount
      status
      monthly_deduction
      total_deduction
      total_loan
      total_paid
      upfront_deduction
      loan_type_id
      member_id
      user_id
      due_date
      approved_date
      inserted_at
      updated_at
      member{
        id
        surname
        other_names
      }
      loan_type{
        id
        name
        interest
      }
    }
    page_size
    page_number
    total_pages
    total_entries
  }
}
`;
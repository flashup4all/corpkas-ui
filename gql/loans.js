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
    $monthly_net_income: String!,
    $loan_amount: String!,
    $member_id: Int!,
    $user_id: Int!,
    $loan_type_id: Int!
    $payslip_image: Upload!
  ) {
      createLoan(loan: {
        payslip_image: $payslip_image,
      loan_amount: $loan_amount,
      member_id: $member_id,
      user_id: $user_id,
      loan_type_id: $loan_type_id,
      monthly_net_income: $monthly_net_income
    }){
      id
      payslip_url
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

export const APPROVE_LOAN = gql`
  mutation approveLoan(
    $loan_amount: String!,
    $id: Int!,
    $member_id: Int!,
    $user_id: Int!,
    $loan_type_id: Int!
    $approved_amount: String!
    $is_insured: Boolean!
    $upfront_deduction: Boolean!

  ) {
    approveLoan(loan: {
      member_id: $member_id,
      user_id: $user_id,
      loan_amount: $loan_amount,
      loan_type_id: $loan_type_id,
      approved_amount: $approved_amount,
      is_insured: $is_insured,
      upfront_deduction: $upfront_deduction,
    }, id: $id){
      id
      payslip_url
      
      }
  }
`;

export const FILTER_LOANS = gql`
  mutation filterLoans(
    $member_id: Int,
    $loan_type_id: Int
    $status: Int
    $loan_payment_status: Int
    $loan_repayment_status: Int
    $from: String
    $to: String
    $overdue: String
  ) {
    filterLoans(filter: {
      loan_payment_status: $loan_payment_status,
      loan_repayment_status: $loan_repayment_status,
      member_id: $member_id,
      loan_type_id: $loan_type_id
      status: $status
      from: $from
      to: $to
      overdue: $overdue
    }){
      id
      actual_amount
      approved_amount
      amount_paid
      amount_payable
      payback_amount
      balance_payable
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
      guarantors{
       
        member{
          id
          surname
          other_names
          avatar_url
        }
      }
    }
  }
`;

export const GET_LOANS = gql`
query ($page: Int!){
  paginateLoans(page: $page) {
    entries{
      id
      approved_amount
      amount_paid
      payback_amount
      balance_payable
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
      reason
      loan_amount
      status
      payslip_url
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
        avatar_url
        status
        staff_no
      }
      loan_type{
        id
        name
        interest
      }
      guarantors{
       
        member{
          id
          surname
          other_names
          avatar_url
        }
      }
    }
    page_size
    page_number
    total_pages
    total_entries
  }
}
`;

//loan guarantors
export const CREAT_LOAN_GUARANTOR = gql`
mutation createLoanGuarantor(
  $member_id: Int!,
  $loan_id: Int!,
  $status: Int!
){
  createLoanGuarantor(loanGuarantor: {
    status: $status
		loan_id: $loan_id
    member_id: $member_id
  }){
  
    
      id
      status
    	loan{
        id
      }
    	member{
        id
      }
    	member_id
    loan_id
  
    	
    	
    
  }
}
`
export const GET_LOAN_GUARANTORS = gql`
query ($loan_id: Int!){
  loanGuarantors(loan_id: $loan_id) {
    id
    loan {
      id
      loanAmount
    }
    member{
      id
      surname
      otherNames
      avatar
      avatar_url
      staff_no
    }
    memberId
      loanId
    comment
    status

    }
}
`;

export const CREATE_LOANS_TXNS = gql`
mutation createLoanTransaction(
    $status: Int
		$loan_id: Int!
    $member_id: Int!,
    $naration: String
    $txn_type: Int!
    $payment_type: String
    $amount: Int!
    $posted_by: Int!
  ){
    createLoanTransaction(
      loanTransaction: {
      member_id: $member_id,
      naration: $naration
      txn_type: $txn_type
      payment_type: $payment_type
      amount: $amount
      posted_by: $posted_by
      loan_id: $loan_id
      status: $status
      }
    ){


      id
      status
      amount
      postedBy
      approvedBy
      paymentType
      naration
        loan{
          id
          loanAmount
        }
        member{
          id
          surname
          otherNames
          avatar
        }
      posted{
        id
        surname
        otherNames
      }
      approved{
        id
        surname
        otherNames
        avatar
      }
      
        memberId
      loanId
    }
}
`;

export const APPROVE_LOAN_TXN = gql`
  mutation approveLoanTransaction(
      $status: Int!,
      $member_id: Int!,
      $id: Int!,
      $loan_id: Int!,
      $approved_by: Int!,
    ) {
      approveLoanTransaction(loanTransaction: {
        approved_by: $approved_by,
        status: $status,
        id: $id
        member_id: $member_id
        loan_id: $loan_id
      }){
      id
      approved_by
      status
      
        
    }
  }
`;
export const CANCEL_LOAN_TXN = gql`
  mutation cancelLoanTransaction(
      $status: Int!,
      $member_id: Int!,
      $id: Int!,
      $loan_id: Int!,
      $approved_by: Int!,
    ) {
      cancelLoanTransaction(loanTransaction: {
        approved_by: $approved_by,
        status: $status,
        id: $id
        member_id: $member_id
        loan_id: $loan_id
      }){
      id
      approved_by
      status
      
        
    }
  }
`;
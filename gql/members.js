import { gql } from '@apollo/client';


export const GET_PAGINATE_MEMBERS = gql`
query ($page: Int){
  paginateMembers(page: $page) {
    entries {
      id
      email
      surname
      other_names
      user_id
      altPhoneNumber
      current_balance
      avatar
      avatar_url
      monthly_contribution
      current_monthly_income
      dept
      details
      dob
      email
      faculty
      gender
      phone_number
      rank
      role
      insertedAt
      updatedAt
      status
      staff_no
      membership_date
        }
      pageSize
    pageNumber
    totalPages
    totalEntries
  }
}
`;
export const GET_MEMBER = gql`
query ($id: Int!){
  findMember(id: $id) {
      id
      email
      surname
      other_names
      user_id
      altPhoneNumber
      current_balance
      avatar
      avatar_url
      monthly_contribution
      current_monthly_income
      dept
      details
      dob
      email
      faculty
      gender
      phone_number
      rank
      role
      insertedAt
      updatedAt
      status
      staff_no
      membership_date
  }
}
`;
export const GET_MEMBERS = gql`
query {
    members {
        id
        email
      surname
      other_names
      user_id
      altPhoneNumber
      current_balance
      avatar
      avatar_url
      monthly_contribution
      current_monthly_income
      dept
      details
      dob
      email
      faculty
      gender
      phone_number
      rank
      role
      insertedAt
      updatedAt
      status
      staff_no
      membership_date
}
}
`;

export const GET_MEMBER_TOTALS = gql`
query {
  memberTotals {
      total
    active
    inactive
    closed
  }
}
`;
export const CREATE_MEMBER = gql`
  mutation createMember(
      $staff_no: String!, $surname: String!, 
      $other_names: String!, $role: String!,
      $dob: String!,$gender: String!, 
      $status: String!,$email: String!, 
      $alt_phone_number: String,
      $dept: String,
      $monthly_contribution: String!,
      $current_monthly_income: String!,
      $membership_date: String!,
      $rank: String,
      $phone_number: String!) {
    createMember(member: {
        email: $email,
        status: $status,
        role: $role,
        surname: $surname,
        other_names: $other_names,
        phone_number: $phone_number,
        alt_phone_number: $alt_phone_number,
        staff_no: $staff_no,
        dob: $dob,
        gender: $gender,
        rank: $rank,
        dept: $dept,
        monthly_contribution: $monthly_contribution,
        current_monthly_income: $current_monthly_income,
        membership_date: $membership_date
      }){
        
        id
        surname
        other_names
        email
        phone_number
        alt_phone_number
        gender
        avatar
        dob
        avatar_url
        role
        status
        userId
        staff_no
        inserted_at
        updated_at
        membership_date
           
        
      }
  }
`;

export const UPDATE_MEMBER = gql`
  mutation updateMember(
      $staff_no: String, $surname: String, 
      $other_names: String, $role: String,
      $dob: String, $gender: String, 
      $status: String,$email: String, 
      $alt_phone_number: String,
      $dept: String,
      $monthly_contribution: String,
      $current_monthly_income: String,
      $membership_date: String,
      $rank: String,
      $image: Upload!,
      $phone_number: String, $id: Int!) {
        updateMember(member: {
        email: $email,
        status: $status,
        role: $role,
        surname: $surname,
        other_names: $other_names,
        phone_number: $phone_number,
        alt_phone_number: $alt_phone_number,
        staff_no: $staff_no,
        dob: $dob,
        gender: $gender,
        rank: $rank,
        dept: $dept,
        image: $image,
        monthly_contribution: $monthly_contribution,
        current_monthly_income: $current_monthly_income,
        membership_date: $membership_date
      }, id: $id){
        
        id
        surname
        other_names
        email
        phone_number
        alt_phone_number
        gender
        dob
        avatar
        avatar_url
        role
        status
        userId
        staff_no
        inserted_at
        updated_at
        membership_date
           
        
      }
  }
`;
export const UPDATE_MEMBER_AVATAR = gql`
  mutation uploadMemberAvatar($image: Upload!, $id: Int!) {
        uploadMemberAvatar(image: $image, id: $id){
        
        id
        surname
        other_names
        email
        phone_number
        alt_phone_number
        gender
        dob
        avatar
        avatar_url
        role
        status
        userId
        staff_no
        inserted_at
        updated_at
        membership_date
           
        
      }
  }
`;

export const SEARCH_MEMBERS = gql`
query ($searchTerm: String!){
  searchMember(searchTerm: $searchTerm) {
    
    id
    surname
    other_names
    email
    phone_number
    alt_phone_number
    gender
    avatar
    dob
    dept
    avatar_url
    role
    status
    userId
    staff_no
    inserted_at
    updated_at
    membership_date
  }
}
`;


//loans
export const GET_MEMBER_LOANS = gql`
query ($member_id: Int!, $status: Int){
  memberLoans(member_id: $member_id, status: $status) {
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
    reason
    approved_date
    inserted_at
    updated_at

  }
}
`;

// txns

export const GET_MEMBER_TXNS = gql`
query ($member_id: Int!, $page: Int){
  memberTransactions(member_id: $member_id, page: $page) {
    entries{
      id
      member_id
      amount
      current_balance
      previous_balance
      posted_by
      approved_by
      payment_channel
      txn_id
      txn_type
      naration
      status
      inserted_at
      updated_at
      members{
        id
        surname
        other_names
      }
      posted{
        id
        surname
        other_names
      }
      approved{
        id
        surname
        other_names
      }
    }
    page_size
    page_number
    total_pages
    total_entries

  }
}
`;

export const FILTER_MEMBERS = gql`
  mutation filterMembers(
      $status: Int,
      $from: String,
      $to: String, 
      $member_id: Int 
    ) {
      filterMembers(filter: {
        from: $from,
        status: $status,
        id: $member_id,
        to: $to,
      }){
        id
        email
        surname
        other_names
        user_id
        altPhoneNumber
        current_balance
        avatar
        avatar_url
        monthly_contribution
        current_monthly_income
        dept
        details
        dob
        email
        faculty
        gender
        phone_number
        rank
        role
        insertedAt
        updatedAt
        status
        staff_no
        membership_date
        
    }
  }
`;
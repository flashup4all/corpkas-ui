import { gql } from '@apollo/client';

export const GET_TRANSACTIONS = gql`
query ($page: Int, $status: Int){
  paginateTransactions(page: $page, status: $status) {
    entries {
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
        staff_no
        surname
        first_name
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

export const FILTER_TRANSACTION = gql`
  mutation filterTransactions(
      $status: String,
      $from: String,
      $to: String, 
      $member_id: Int 
      $txn_type: Int 
    ) {
        filterTransactions(filter: {
        from: $from,
        status: $status,
        member_id: $member_id,
        to: $to,
        txn_type: $txn_type,
      }){
        
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
        staff_no
        surname
        first_name
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
  }
`;


export const CREATE_TRANSACTION = gql`
  mutation createTransaction(
      $amount: String!
      $payment_channel: String!
      $member_id: Int 
      $txn_type: Int
      $posted_by: Int 
    ) {
      createTransaction(transaction: {
        amount: $amount,
        payment_channel: $payment_channel,
        member_id: $member_id,
        txn_type: $txn_type,
        posted_by: $posted_by,
      }){
        
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
        staff_no
        surname
        first_name
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
  }
`;

export const APPROVE_TRANSACTION = gql`
  mutation approveTransaction(
      $status: Int!,
      $approved_by: Int!,
      $id: Int!
    ) {
      approveTransaction(transaction: {
        approved_by: $approved_by,
        status: $status,
      }, id: $id){
      id
      approved_by
      status
      
        
    }
  }
`;


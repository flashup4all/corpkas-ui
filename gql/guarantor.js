import { gql } from '@apollo/client';



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


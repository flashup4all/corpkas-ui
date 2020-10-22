import { gql } from '@apollo/client';

export const GET_VAULT_TYPES = gql`
query {
  vaultTypes {
    id
    name
    description

  }
}
`;

export const GET_VAULT_TRANSACTIONS = gql`
query ($page: Int){
  paginateVaultTransactions(page: $page) {
    entries {
      id
      amount
      current_balance
      previous_balance
      posted_by
      approved_by
      txn_ref
      txn_type
      naration
      status
      inserted_at
      updated_at
      vault_type{
        name
        id
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
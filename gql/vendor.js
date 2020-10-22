import { gql } from '@apollo/client';

export const UPDATE_VENDOR = gql`
  mutation updateVendorProfile(
    $id: Int!,
    $name: String!, $description: String, 
    $account_status: String!, $address: String, 
    $default_currency: String,
    $phone_numbers: String) {
      updateVendorProfile(vendor: {
      name: $name,
      default_currency: $default_currency,
      description: $description,
      account_status: $account_status,
      address: $address
      phone_numbers: $phone_numbers
      }, id: $id){
        
        id
        name
        account_status
        default_currency
        description
        address
        phone_numbers
      }
  }
`;
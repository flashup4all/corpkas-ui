import React, {useState, useCallback} from 'react';
import { useRouter} from 'next/router';
import Tabs from '@atlaskit/tabs';
import {GET_MEMBER, GET_MEMBER_LOANS} from '../../gql/members'
import { useQuery } from '@apollo/client';

import AdminMainLayout from '../../layouts/main/main';
import ProfileSetting from '../../components/members/profile-setting';
import Transactions from '../../components/members/transactions';
import LoanRequests from '../../components/members/loan-requests';
import ActiveLoanRequests from '../../components/members/active-loans';
import LoanRepayments from '../../components/members/loan-repayments';
import Loader from '../../layouts/loader'
import { Badge } from '../../layouts/extras'
import { ShortDate, ShortTime, FormatCurrency } from '../../components/shared/utils';


const tabs = [
  { label: 'Profile Settings', components: () => null },
  { label: 'Transactions', components: null },
  { label: 'Loan Requests', components: null },
  { label: 'Active Loans', components: null },
  { label: 'Loan Repayments', components: null },

];

const MemberProfile = () => {
  const router = useRouter()
  const {member_id} = router.query
  const [memberData, setMemberData] = useState();
  const [memberActiveLoans, setMemberActiveLoans] = useState('');

  const {loading, error, data, refetch} = useQuery( GET_MEMBER,
    {
      variables:{id : member_id},
      onError: (error) => {
          console.log(error)
      },
      onCompleted: ({findMember}) =>{
        setMemberData(findMember)
      }
    })

    const {loansLoading, loansError, loansData} = useQuery( GET_MEMBER_LOANS,
    {
      variables:{member_id : parseInt(member_id), status: 1},
      onError: (error) => {
          console.log(error)
      },
      onCompleted: ({memberLoans}) =>{
        setMemberActiveLoans(memberLoans.length)
      }
    })
    
  const [seletedTab, setSeletedTab] = useState(0)
  const selectTab = (selected, selectedIndex) => {
    setSeletedTab(selectedIndex)
  }

  const changeTab = (index) => {
    setSeletedTab(index)
  }
  const refreshMember = () => {
    refetch().then(({data: {findMember}}) => setMemberData(findMember))
  }
  
  return (
    <div>
      {loading && <Loader />}
      { memberData && 
      <div>
        <div className="individual-card d-flex mb-5">
          <div className="individual-card_img">
            { memberData.avatar ?
              <img src={memberData.avatar_url} alt="" style={{width:'160px', height:'160px', borderRadius: '50%'}}></img>
            :
              <img src="/cards-icons/avata.png" alt=""></img>
            }
          </div>
          <div className="individual-card_des">
            <p onClick={() => refreshMember()}>Available Balance</p>
            <h1>{FormatCurrency(memberData.current_balance)}</h1>
            <p className="mb-3">
              A/C Name: 
              <span className="bold"> {memberData.surname} {memberData.first_name} {memberData.other_names} </span>
            </p>
            <p className="d-flex"
            ><span className="mr-2">
              {memberData.status == 1 && <Badge title='Activated' type="inprogress" />}
              {memberData.status == 0 && <Badge title='Pending' type="moved" />}
              {memberData.status == 2 && <Badge title='Closed' type="removed" />}
              </span> 
            <span className="">
              <Badge title={'active loans: '+memberActiveLoans} type="default" />
              </span>
            </p>
          </div>
        </div>
        <div className="bg-grey ks-tabs">
          <Tabs onSelect={(selected, selectedIndex) => selectTab(selected, selectedIndex)} tabs={tabs} />
        </div>

        <div className="bg-grey mt-5">
          { seletedTab === 0 &&
            <ProfileSetting onrefreshMember={() => refreshMember()} memberData={memberData}/>
          }
          { seletedTab === 1 &&
            <Transactions onrefreshMember={() => refreshMember()} memberData={memberData} />
          }
          { seletedTab === 2 &&
            <LoanRequests onChangeTab={changeTab} memberData={memberData} />
          }
          { seletedTab === 3 &&
            <ActiveLoanRequests memberData={memberData} />
          }
          { seletedTab === 4 &&
            <LoanRepayments memberData={memberData} />
          }
        </div>
      </div>
      }
      
    </div>
    )
  }

export default MemberProfile;
MemberProfile.layout = AdminMainLayout;
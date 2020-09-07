import React, {useState} from 'react';

import Tabs from '@atlaskit/tabs';
import AdminMainLayout from '../../layouts/main/main';
import ProfileSetting from '../../components/members/profile-setting';
import Transactions from '../../components/members/transactions';
import LoanRequests from '../../components/members/loan-requests';
import ActiveLoans from '../../components/members/active-loans';
import LoanRepayments from '../../components/members/loan-repayments';

const tabs = [
  { label: 'Profile Settings', components: () => null },
  { label: 'Transactions', components: null },
  { label: 'Loan Requests', components: null },
  { label: 'Active Loans', components: null },
  { label: 'Loan Repayments', components: null },

];

const LoanSettings = () => {
  const [seletedTab, setSeletedTab] = useState(0)
  const selectTab = (selected, selectedIndex) => {
    setSeletedTab(selectedIndex)
  }
  return (
    <div>
      <div className="bg-grey ks-tabs">
        <Tabs onSelect={(selected, selectedIndex) => selectTab(selected, selectedIndex)} tabs={tabs} />
      </div>

      <div className="bg-grey mt-5">
        { seletedTab === 0 &&
          <ProfileSetting />
        }
        { seletedTab === 1 &&
          <Transactions />
        }
        { seletedTab === 2 &&
          <LoanRequests />
        }
        { seletedTab === 3 &&
          <ActiveLoans />
        }
        { seletedTab === 4 &&
          <LoanRepayments />
        }
      </div>
    </div>
    )
  }

export default LoanSettings;
LoanSettings.layout = AdminMainLayout;
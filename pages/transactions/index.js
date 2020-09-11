import React, {useState} from 'react';

import Tabs from '@atlaskit/tabs';
import AdminMainLayout from '../../layouts/main/main';
import Savings from '../../components/transactions/savings';
import Withdrawals from '../../components/transactions/withdrawals';

const tabs = [
  { label: 'Savings', components: () => null },
  { label: 'Withdrawals', components: null },

];

const Managestaff = () => {
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
          <Savings />
        }
        { seletedTab === 1 &&
          <Withdrawals />
        }
      </div>
    </div>
    )
  }

export default Managestaff;
Managestaff.layout = AdminMainLayout;
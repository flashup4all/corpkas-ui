import React, {useState} from 'react';

import Tabs from '@atlaskit/tabs';
import AdminMainLayout from '../../layouts/main/main';
import LoanTypes from '../../components/settings/loantypes';
import LoanSetting from '../../components/settings/loan-settings';

const tabs = [
  { label: 'Loan Types', components: () => null },
  { label: 'Loan Setting', components: null },

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
          <LoanTypes />
        }
        { seletedTab === 1 &&
          <LoanSetting />
        }
      </div>
    </div>
    )
  }

export default LoanSettings;
LoanSettings.layout = AdminMainLayout;
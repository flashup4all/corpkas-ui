import React, {useState} from 'react';

import Tabs from '@atlaskit/tabs';
import AdminMainLayout from '../../layouts/main/main';
import ChangePassword from '../../components/settings/change-password';

const tabs = [
  { label: 'Change Password', components: () => null },
  // { label: 'Create Staff', components: null },

];

const UpdatePassword = () => {
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
          <ChangePassword />
        }
      </div>
    </div>
    )
  }

export default UpdatePassword;
UpdatePassword.layout = AdminMainLayout;
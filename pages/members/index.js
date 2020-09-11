import React from 'react';
import ManageMembers from '../../components/members/manage-members';
import AdminMainLayout from '../../layouts/main/main';


const Members = () => {
    return (
        <div>
            <ManageMembers/>
        </div>
    )
};

export default Members;
Members.layout = AdminMainLayout;
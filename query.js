{
    findMember(id: 1) {
        id
      email
    surname
    other_names
    user_id
    altPhoneNumber
    currentBalance
    avatar
    monthlyContribution
    currentMonthlyIncome
    dept
    details
    dob
    email
    faculty
    gender
    phoneNumber
    rank
    role
    insertedAt
    updatedAt
    
    }
}
{
    deleteMember(id:5) {
        id
      email
      role
    }
}


mutation {
createMember(member: {
    email: "member@kasumpcs.com",
    role: "member",
    rank: "HOD",
    dept: "Engineering",
    surname: "Bardeson",
    other_names: "Lucky",
    phone_number: "08023913264",
    staff_no: "Kasu/321",
    dob: "2011-05-18 15:01:01",
    gender: "Male",
    monthly_contribution: 0.0
    current_monthly_income: 0.0
    membershipDate:"2015-05-18 15:01:01",
  }){
  
    
      id
      email
        surname
        other_names
        user_id
        altPhoneNumber
        currentBalance
        avatar
        monthlyContribution
        currentMonthlyIncome
        dept
        details
        dob
        email
        faculty
        gender
        phoneNumber
        rank
        role
        insertedAt
        updatedAt
    
  }
}

mutation {
    updateMember(member: {
  
        role: "member",
        rank: "HOD",
        dept: "Engineering",
        surname: "Bardeson",
        other_names: "Lucky",
        phone_number: "08023913264",
        staff_no: "Kasu/321",
        dob: "2011-05-18 15:01:01",
        gender: "Male",
        monthly_contribution: 0.0
        current_monthly_income: 0.0
        membershipDate:"2015-05-18 15:01:01",
    }, id: 18){
    
      
        id
        role
             phoneNumber
          surname
      
    }
  }


  mutation {
    createStaff(staff: {
      email: "staff@gmail.com",
      role: "member",
      surname: "Staff1",
      other_names: "Lucky",
      phone_number: "08034567889",
      staff_no: "Kasu/01",
      dob: "2011-05-18 15:01:01",
      gender: "Male"
    }){
    
      
        id
        email
        role
      user_id
      
    }
  }

  mutation {
    updateStaff(staff: {
      surname: "Jerimiah",
      other_names: "Lucky",
      dob: "2011-05-18 15:01:01",
      gender: "Male",
    }, id: 5){
    
      
        id
        role
             phoneNumber
          surname
      
    }
  }

  {
    findStaff(id: 5) {
        id
        surname
				otherNames
      email
      phoneNumber
      altPhoneNumber
      gender
      avatar
      dob
      avatar
      role
      status
      userId
      insertedAt
      updatedAt
    }
}

{
    staff {
        id
        surname
				otherNames
      email
      phoneNumber
      altPhoneNumber
      gender
      avatar
      dob
      avatar
      role
      status
      userId
      insertedAt
      updatedAt
      
    }
}
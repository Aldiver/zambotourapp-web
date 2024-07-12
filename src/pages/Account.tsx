import React, { useContext } from 'react';
import SectionMain from '../components/SectionMain';
import SectionTitle from '../components/SectionTitle';
import CardBox from '../components/CardBox';
import { AuthContext } from "../context/AuthContext";
import UserDetail from '../pages/UserDetail';

const Account: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser)
  return (
    <SectionMain>
      <SectionTitle title="Account" />
      <CardBox>
        <UserDetail userDetail={currentUser.userId}/>
      </CardBox>
    </SectionMain>
  );
};

export default Account;

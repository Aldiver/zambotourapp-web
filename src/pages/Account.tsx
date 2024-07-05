import React from 'react';
import SectionMain from '../components/SectionMain';
import SectionTitle from '../components/SectionTitle';
import CardBox from '../components/CardBox';

const Account: React.FC = () => {
  return (
    <SectionMain>
      <SectionTitle title="Account" />
      <CardBox>
        <p>Account details will be here.</p>
      </CardBox>
    </SectionMain>
  );
};

export default Account;

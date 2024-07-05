import React from 'react';
import SectionMain from '../components/SectionMain';
import SectionTitle from '../components/SectionTitle';
import CardBox from '../components/CardBox';

const Dashboard: React.FC = () => {
  return (
    <SectionMain>
      <SectionTitle title="Dashboard" />
      <CardBox>
        <p>Welcome to the Dashboard!</p>
      </CardBox>
    </SectionMain>
  );
};

export default Dashboard;

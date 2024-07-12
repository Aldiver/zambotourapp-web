import React from 'react';
import SectionMain from '../components/SectionMain';
import SectionTitle from '../components/SectionTitle';
import CardBox from '../components/CardBox';
import DataTable from '../components/DataTable';


const Users: React.FC = () => {
  return (
    <SectionMain>
      <SectionTitle title="Users" route="add" />
      <CardBox>
        <DataTable collectionName="users" />
      </CardBox>
    </SectionMain>
  );
};

export default Users;

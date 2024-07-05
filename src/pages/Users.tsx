import React from 'react';
import SectionMain from '../components/SectionMain';
import SectionTitle from '../components/SectionTitle';
import CardBox from '../components/CardBox';
import DataTable from '../components/DataTable';
import { Link } from 'react-router-dom';

const Users: React.FC = () => {
  return (
    <SectionMain>
      <SectionTitle title="Users" />
      <Link to="add" className="btn btn-primary">Add New User</Link>
      <CardBox>
        <DataTable collectionName="users" />
      </CardBox>
    </SectionMain>
  );
};

export default Users;

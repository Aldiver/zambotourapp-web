import React from 'react';
import SectionMain from '../components/SectionMain';
import SectionTitle from '../components/SectionTitle';
import CardBox from '../components/CardBox';
import DataTable from '../components/DataTable';

const Menu: React.FC = () => {
  return (
    <SectionMain>
      <SectionTitle title="Menu" />
      <CardBox>
        <DataTable collectionName="menus" />
      </CardBox>
    </SectionMain>
  );
};

export default Menu;

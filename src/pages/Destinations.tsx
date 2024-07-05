import React from 'react';
import SectionMain from '../components/SectionMain';
import SectionTitle from '../components/SectionTitle';
import CardBox from '../components/CardBox';
import DataTable from '../components/DataTable';

const Destinations: React.FC = () => {
  return (
    <SectionMain>
        <SectionTitle title="Destination" />
        <CardBox>
          <DataTable collectionName="destinations" />
        </CardBox>
    </SectionMain>
  );
};

export default Destinations;
import React from 'react';
import SectionMain from '../components/SectionMain';
import SectionTitle from '../components/SectionTitle';
import CardBox from '../components/CardBox';
import DataTable from '../components/DataTable';


const Itinerary: React.FC = () => {
  return (
    <SectionMain>
      <SectionTitle title="Itinerary" route="add" />
      <CardBox>
        <DataTable collectionName="itineraries" />
      </CardBox>
    </SectionMain>
  );
};

export default Itinerary;

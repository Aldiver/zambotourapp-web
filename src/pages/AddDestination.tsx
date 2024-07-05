import React from 'react';
import SectionMain from '../components/SectionMain';
import SectionTitle from '../components/SectionTitle';
import CardBox from '../components/CardBox';
import DataTable from '../components/DataTable';
import AddDestinationForm from '../components/AddDestinationForm';

const AddDestination: React.FC = () => {
  return (
    <SectionMain>
        <SectionTitle title="Destination" />
        <CardBox>
          <AddDestinationForm />
        </CardBox>
    </SectionMain>
  );
};

export default AddDestination;
import React from 'react';
import {ControlPosition, MapControl} from '@vis.gl/react-google-maps';

import {PlaceAutocomplete} from './autocomplete';


type CustomAutocompleteControlProps = {
  controlPosition: ControlPosition;
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
};

export const CustomMapControl = ({
  controlPosition,
  onPlaceSelect
}: CustomAutocompleteControlProps) => {

  return (
    <MapControl position={controlPosition}>
      <div className="max-w-md">
          <PlaceAutocomplete onPlaceSelect={onPlaceSelect} />  
      </div>
    </MapControl>
  );
};
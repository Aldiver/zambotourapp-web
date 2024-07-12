import React, { useState } from 'react';
import {
    APIProvider,
    AdvancedMarker,
    Map,
    Pin,
} from '@vis.gl/react-google-maps';

const MAPS_API_KEY = import.meta.env.VITE_MAPS_API_KEY as string;



interface LocationSelectProps {
    currentLocation: { lat: number; lng: number };
}

const FixLocation: React.FC<LocationSelectProps> = ({ currentLocation }) => {
    return (
        <div className="flex flex-col h-96 w-full">
            
            <APIProvider apiKey={MAPS_API_KEY} solutionChannel="GMP_idx_templates_v0_reactts">
                <Map
                    className='h-full w-full'
                    mapId={'DEMO_MAP_ID'} // Replace with your actual map ID if needed
                    defaultCenter={currentLocation}
                    defaultZoom={15}
                    disableDefaultUI={true}
                >         
               
                        <AdvancedMarker
                            key="centerMarker"
                            position={currentLocation}
                        >
                            <Pin/>
                        </AdvancedMarker>
                      
                </Map>     
            </APIProvider>
        </div>
    );
};

export default FixLocation;

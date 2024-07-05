import React, { useState, useRef } from 'react';
import {
    APIProvider,
    Map,
    ControlPosition,
    MapCameraChangedEvent,
    AdvancedMarker,
} from '@vis.gl/react-google-maps';
import MapHandler from './map-handler';
import { CustomMapControl } from './map-control';

const MAPS_API_KEY = import.meta.env.VITE_MAPS_API_KEY as string;

const ZAMBOANGA_LOCATION = { lat: 6.903861, lng: 122.076480 };


interface LocationSelectProps {
    initialPosition?: { lat: number; lng: number };
    onLocationChange: (location: { lat: number; lng: number }) => void;
}

const LocationSelect: React.FC<LocationSelectProps> = ({ onLocationChange }) => {
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedPlace, setSelectedPlace] =
        useState<google.maps.places.PlaceResult | null>(null);

    const handleLocationSelect = (location: { lat: number; lng: number }) => {
        setSelectedLocation(location);
        setMarkerPosition(location);
        onLocationChange(location);
    };

    return (
        <div className="flex flex-col h-96 w-4/5">
            
            <APIProvider apiKey={MAPS_API_KEY} solutionChannel="GMP_idx_templates_v0_reactts">
                <Map
                    className='h-full w-full'
                    mapId={'DEMO_MAP_ID'} // Replace with your actual map ID if needed
                    defaultCenter={ZAMBOANGA_LOCATION}
                    defaultZoom={15}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    onCameraChanged={(ev: MapCameraChangedEvent) => {
                        const { center } = ev.detail;
                        console.log('Camera changed:', center);
                        handleLocationSelect(center);
                        setMarkerPosition(center); // Update marker position with map center
                    }}
                >
                    
                    {markerPosition && (
                        <AdvancedMarker
                            key="centerMarker"
                            position={markerPosition}
                        >
                            <div style={{ fontSize: '24px', color: 'red' }}>📍</div>
                        </AdvancedMarker>
                    )}
                </Map>
                <CustomMapControl controlPosition={ControlPosition.TOP} onPlaceSelect={setSelectedPlace} />
                <MapHandler place={selectedPlace} />
            </APIProvider>
            <div className="text-sm italic text-gray-500">
                Current coordinates: Lat: {selectedLocation?.lat?.toFixed(6)}, Lng: {selectedLocation?.lng?.toFixed(6)}
            </div>
        </div>
    );
};

export default LocationSelect;

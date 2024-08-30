import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface Destination {
  id: string;
  name: string;
  address: string;
  coverImage: string;
}

interface Itinerary {
  name: string;
  destinations: string[]; // Array of destination IDs
}

const ItineraryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get itinerary ID from URL
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [displayedDestinations, setDisplayedDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItineraryAndDestinations = async () => {
      try {
        // Fetch itinerary details
        const itineraryDocRef = doc(db, "itineraries", id!);
        const itineraryDoc = await getDoc(itineraryDocRef);
        if (itineraryDoc.exists()) {
          const itineraryData = itineraryDoc.data() as Itinerary;
          setItinerary(itineraryData);

          // Fetch all destinations
          const destinationsQuerySnapshot = await getDocs(collection(db, "destinations"));
          const destinations = destinationsQuerySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Destination[];

          setAllDestinations(destinations);

          // Filter displayed destinations based on itinerary
          const filteredDestinations = destinations.filter(destination =>
            itineraryData.destinations.includes(destination.id)
          );

          setDisplayedDestinations(filteredDestinations);
        } else {
          console.error("No such itinerary!");
        }
      } catch (error) {
        console.error("Error fetching itinerary or destinations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItineraryAndDestinations();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mx-auto px-4 py-16 sm:px-6 lg:px-8 w-full">
      <div className="max-w-screen-lg mx-auto w-full">
        <div className="space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 w-full">
          {itinerary ? (
            <>
              <h1 className="text-center text-2xl font-semibold">{itinerary.name}</h1>
              <div>
                <h2 className="text-lg font-medium mb-2">Destinations</h2>
                <ul className="space-y-2">
                  {displayedDestinations.map((destination) => (
                    <li
                      key={destination.id}
                      className="p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4"
                    >
                      <img
                        src={destination.coverImage}
                        alt={destination.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="text-sm font-medium">{destination.name}</p>
                        <p className="text-xs text-gray-500">{destination.address}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p>No itinerary found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryDetail;

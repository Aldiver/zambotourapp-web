import React, { useState, useEffect } from "react";
import {
  doc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

interface Destination {
  id: string;
  name: string;
  address: string;
  coverImage: string;
}

interface FormData {
  name: string;
  destinations: string[]; // Array of destination IDs
}

const AddItineraryForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    destinations: [],
  });
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [displayedDestinations, setdisplayedDestinations] = useState<
    Destination[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch destinations from Firebase
    const fetchDestinations = async () => {
      const querySnapshot = await getDocs(collection(db, "destinations"));
      const destinations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Destination[];
      setAllDestinations(destinations);
      setdisplayedDestinations(destinations);
    };
    fetchDestinations();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
    setPage(1); // Reset to first page on new search
  };

  const filteredDestinations = displayedDestinations
    ? displayedDestinations.filter(
        (destination) =>
          destination.name.toLowerCase().includes(searchQuery) ||
          destination.address.toLowerCase().includes(searchQuery)
      )
    : [];

  const paginatedDestinations = filteredDestinations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleDestinationClick = (id: string) => {
    if (formData.destinations.includes(id)) {
      handleRemoveDestination(id);
    } else {
      handleAddDestination(id);
    }
  };

  const handleAddDestination = (id: string) => {
    const selectedDestination = displayedDestinations.find(
      (destination) => destination.id === id
    );

    if (selectedDestination) {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          destinations: [...prevFormData.destinations, id],
        };
      });

      setdisplayedDestinations((prevAllDestinations) => {
        return prevAllDestinations.filter(
          (destination) => destination.id !== id
        );
      });
    }
  };

  const handleRemoveDestination = (id: string) => {
    const destinationToRemove = allDestinations.find(
      (destination) => destination.id === id
    );

    if (destinationToRemove) {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          destinations: prevFormData.destinations.filter(
            (destinationId) => destinationId !== id
          ),
        };
      });

      setdisplayedDestinations((prevAllDestinations) => {
        return [...prevAllDestinations, destinationToRemove];
      });
    }
  };

  const handleSaveItinerary = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const itineraryDocRef = doc(collection(db, "itineraries"));
      await setDoc(itineraryDocRef, {
        name: formData.name,
        destinations: formData.destinations,
      });

      setFormData({ name: "", destinations: [] });
      console.log("Itinerary created successfully!");
      navigate(`/itineraries/${itineraryDocRef.id}`);
    } catch (error) {
      console.error("Error creating itinerary:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto px-4 py-16 sm:px-6 lg:px-8 w-full">
      <div className="max-w-screen-lg mx-auto w-full">
        <form
          onSubmit={handleSaveItinerary}
          className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 w-full"
        >
          <p className="text-center text-lg font-medium">
            Create New Itinerary
          </p>
          <div>
            <input
              type="text"
              name="name"
              className="w-full md:w-4/5 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              placeholder="Itinerary Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="flex gap-4">
            {/* Left column: Destinations */}
            <div className="w-1/2 p-4 border border-gray-300 rounded-lg">
              <input
                type="text"
                className="w-full rounded-lg border-gray-200 p-4 mb-4 text-sm shadow-sm"
                placeholder="Search destinations by name or address"
                value={searchQuery}
                onChange={handleSearch}
              />
              <ul className="space-y-2">
                {paginatedDestinations.map((destination) => (
                  <li
                    key={destination.id}
                    className="cursor-pointer p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4"
                    onClick={() => handleDestinationClick(destination.id)}
                  >
                    <img
                      src={destination.coverImage}
                      alt={destination.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-sm font-medium">{destination.name}</p>
                      <p className="text-xs text-gray-500">
                        {destination.address}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between mt-4">
                <button
                  className="px-4 py-2 text-sm bg-gray-200 rounded-lg"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <button
                  className="px-4 py-2 text-sm bg-gray-200 rounded-lg"
                  onClick={() =>
                    setPage((prev) =>
                      prev * itemsPerPage >= filteredDestinations.length
                        ? prev
                        : prev + 1
                    )
                  }
                  disabled={page * itemsPerPage >= filteredDestinations.length}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Right column: Selected Itinerary */}
            <div className="w-1/2 p-4 border border-gray-300 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Selected Itinerary ({ formData.destinations.length }) </h3>
              <ul className="space-y-2">
                {formData.destinations.map((id) => {
                  const destination = allDestinations.find(
                    (dest) => dest.id === id
                  );
                  return (
                    <li
                      key={id}
                      className="cursor-pointer p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4"
                      onClick={() => handleDestinationClick(id)}
                    >
                      <img
                        src={destination?.coverImage}
                        alt={destination?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {destination?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {destination?.address}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <button
            type="submit"
            className="block w-full md:w-4/5 rounded-lg bg-orange-theme-500 px-5 py-3 text-sm font-medium text-white mt-4"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItineraryForm;

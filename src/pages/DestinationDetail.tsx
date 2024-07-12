import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import Icon from '@mdi/react';
import { mdiMapMarker } from '@mdi/js';
import { Description, Disclosure, RadioGroup, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import FixLocation from '../components/google-maps/FixLocation';

const DestinationDetail: React.FC = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<{ name: string; price: number }[]>(
    []
  );
  

  useEffect(() => {
    const fetchDestination = async () => {
      const items: { name: string; price: number }[] = [];
      const docRef = doc(db, 'destinations', id!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDestination(docSnap.data());
        setImages([docSnap.data().coverImage, ...(docSnap.data().images || [])]);
      } else {
        console.log('No such document!');
      }

      const q = query(
        collection(db, "menus"),
        where("destinationId", "==", id!)
      );
      
      const querySnapshot = await getDocs(q);
    
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const menuData = doc.data();
        if (menuData.menuItem && Array.isArray(menuData.menuItem)) {
          menuData.menuItem.forEach((item: { name: string; price: number }) => {
            items.push(item);
          });
    
          setMenuItems(items);
        }
      }
    };
    fetchDestination();
  }, [id]);

  if (!destination) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-full mx-auto'>
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <TabGroup as="div" className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
              <TabList className="grid grid-cols-4 gap-6">
                {images.map((img: string, index: number) => (
                  <Tab
                    key={index}
                    className="relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50"
                  >
                    {({ }) => (
                      <>
                        <span className="sr-only">{img}</span>
                        <span className="absolute inset-0 rounded-md overflow-hidden">
                          <img src={img} alt="" className="w-full h-full object-center object-cover" />
                        </span>

                      </>
                    )}
                  </Tab>
                ))}
              </TabList>
            </div>

            <TabPanels className="w-full aspect-w-1 aspect-h-1">
              {images.map((img: string, index: number) => (
                <TabPanel key={index}>
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-center object-cover sm:rounded-lg"
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{destination.name}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Destination information</h2>
              <div className="flex items-center mt-2">
                <Icon path={mdiMapMarker} size={1} className="text-gray-600 mr-1" />
                <span className="text-gray-600 text-lg">{destination.address}</span>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                {/* <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        product.rating > rating ? 'text-indigo-500' : 'text-gray-300',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div> */}
                <p className="sr-only"> out of 5 stars</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div
                className="text-base text-gray-700 space-y-6"
                dangerouslySetInnerHTML={{ __html: destination.description }}
              />
            </div>

            <div className="mt-6">
              <FixLocation
                currentLocation={{ lat: destination.locationCoords.latitude, lng: destination.locationCoords.longitude }}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-1">
              Tags:
              {destination.tags && destination.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            {destination.isFoodServiceEstablishment && (
            <div>
              <label
                htmlFor="items"
                className="block text-sm font-medium text-gray-700"
              >
                Additional Items
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className="relative w-32 p-4 border border-gray-300 flex"
                  >
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;

import React, { useState } from 'react';
import { setDoc, collection, addDoc, GeoPoint } from 'firebase/firestore';
import { db } from '../firebase';
import { getDownloadUrl } from '../firebase/helpers';
import LocationSelect from './google-maps/LocationSelect';

interface FormData {
    name: string;
    description: string;
    address: string;
    isFoodServiceEstablishment: boolean;
    coverImage: File | null;
    images: File[];
}

const AddDestinationForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        address: '',
        isFoodServiceEstablishment: false,
        coverImage: null,
        images: [],
    });

    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setFormData({
                ...formData,
                [name]: target.checked,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setFormData({
                ...formData,
                coverImage: file,
            });
            setCoverImagePreview(URL.createObjectURL(file));
        }
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFilesArray = Array.from(files);
            setFormData({
                ...formData,
                images: [...formData.images, ...newFilesArray],
            });
            setImagePreviews([...imagePreviews, ...newFilesArray.map(file => URL.createObjectURL(file))]);
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSaveDestination = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "destinations"), {
                name: formData.name,
                description: formData.description,
                address: formData.address,
            });

            // Upload cover image to Firebase Storage
            const coverImageFile = formData.coverImage;
            const coverImageUrl: string = coverImageFile ? await getDownloadUrl(coverImageFile) : "";
            console.log(`Cover image file name is ${coverImageUrl}`);

            // Upload images to Firebase Storage
            const imageUrls = await Promise.all(
                formData.images.map(async (imageFile) => {
                    return await getDownloadUrl(imageFile);
                })
            );

            console.log(coverImageUrl, imageUrls);
            // Update Firestore document with destination details and uploaded image URLs
            await setDoc(docRef, {
                id: docRef.id,
                isFoodServiceEstablishment: formData.isFoodServiceEstablishment,
                aveRating: 0,
                rating: 0,
                coverImage: coverImageUrl,
                images: imageUrls,
                locationCoords: new GeoPoint(locationCoords!.lat, locationCoords!.lng),
            }, { merge: true });

            // Clear form after saving
            setFormData({
                name: '',
                description: '',
                address: '',
                isFoodServiceEstablishment: false,
                coverImage: null,
                images: [],
            });
            setCoverImagePreview(null);
            setImagePreviews([]);

            console.log('Destination added successfully!');
        } catch (error) {
            console.error('Error adding destination:', error);
        }
    };

    return (
        <div className="rounded-lg border border-gray-200 mx-auto px-4 py-16 md:px-8">
            <div className="overflow-x-auto mx-auto">
                <a
                    className="inline-flex items-center gap-2 rounded border border-indigo-600 bg-indigo-600 px-8 py-3 text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                    href="/destinations"
                >
                    <svg
                        className="size-5 rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                    </svg>
                    <span className="text-sm font-medium"> Back </span>
                </a>
                <form onSubmit={handleSaveDestination} className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8">
                    <p className="text-center text-lg font-medium">Create New Destination</p>
                    <div>
                        {coverImagePreview ? (
                            <img src={coverImagePreview} alt="Cover Preview" className="mt-2 w-4/5 h-40 object-cover" />
                        ) : (
                            <div className="mt-2 w-4/5 h-40 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">No cover image selected</span>
                            </div>
                        )}
                        <label htmlFor="coverImage" className="sr-only">Cover Image</label>
                        <div className="">
                            <input
                                type="file"
                                name="coverImage"
                                className="w-4/5 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                onChange={handleCoverImageChange}
                                accept="image/*"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className="sr-only">Destination Name</label>
                        <div className="">
                            <input
                                type="text"
                                name="name"
                                className="w-4/5 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                placeholder="Destination Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description" className="sr-only">Description</label>
                        <div className="">
                            <textarea
                                id="OrderNotes"
                                name="description"
                                className="w-4/5 mt-2 rounded-lg border-gray-200 align-top shadow-sm sm:text-sm"
                                rows={4}
                                placeholder="Enter description here..."
                                value={formData.description}
                                onChange={handleDescriptionChange}
                                required
                            ></textarea>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="address" className="sr-only">Address</label>
                        <div className="">
                            <input
                                type="text"
                                name="address"
                                className="w-4/5 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="images" className="sr-only">Images</label>
                        <div className="">
                            <input
                                type="file"
                                name="images"
                                className="w-4/5 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                onChange={handleImagesChange}
                                accept="image/*"
                                multiple
                            />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {imagePreviews.map((src, index) => (
                                <img key={index} src={src} alt={`Preview ${index}`} className="w-24 h-24 object-cover" />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="isFoodServiceEstablishment" className="sr-only">Is Food Establishment</label>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isFoodServiceEstablishment"
                                className="mr-2"
                                checked={formData.isFoodServiceEstablishment}
                                onChange={handleChange}
                            />
                            <span>Is Food Establishment</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-start mt-4">
                        <LocationSelect onLocationChange={setLocationCoords} />
                    </div>

                    <span className="flex items-center">
                        <span className="h-px flex-1 bg-black"></span>
                    </span>
                    <button
                        type="submit"
                        className="block mx-auto w-20 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
                    >
                        Submit
                    </button>
                </form>

            </div>
        </div>
    );
};

export default AddDestinationForm;

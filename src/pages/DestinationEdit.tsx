import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GeoPoint, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import LocationSelect from '../components/google-maps/LocationSelect';
import { mdiAlphaXBox } from '@mdi/js';
import Icon from '@mdi/react';

interface FormData {
    name: string;
    aveRating: number;
    description: string;
    address: string;
    tags: string[];
    isFoodServiceEstablishment: boolean;
    coverImage: File | null;
    images: File[];
}

const tagOptions = ['Mountain', 'Beach', 'Forest', 'City', 'Food', 'Beds'];

const DestinationEdit: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        address: '',
        aveRating: 0,
        description: '',
        tags: [],
        isFoodServiceEstablishment: false,
        coverImage: null,
        images: [],
    });
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [existingCoverImage, setExistingCoverImage] = useState<string>('');
    const [existingImages, setExistingImages] = useState<string[]>([]);

    useEffect(() => {
        const fetchDestination = async () => {
            const docRef = doc(db, 'destinations', id!);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const coverImageUrl = await getDownloadURL(ref(storage, data.coverImage));
                const imageUrls = await Promise.all(data.images.map((imgPath: string) => getDownloadURL(ref(storage, imgPath))));

                setFormData({
                    name: data.name,
                    address: data.address,
                    description: data.description,
                    aveRating: data.aveRating,
                    tags: data.tags,
                    isFoodServiceEstablishment: data.isFoodServiceEstablishment,
                    coverImage: null,
                    images: [],
                });
                setExistingCoverImage(data.coverImage);
                setExistingImages(data.images);
                setLocationCoords({lat: data.locationCoords.latitude, lng: data.locationCoords.longitude});
                setCoverImagePreview(coverImageUrl);
                setImagePreviews(imageUrls);
                setLoading(false);
            } else {
                console.log('No such document!');
                setLoading(false);
            }
        };
        fetchDestination();
    }, [id]);

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
        console.log(formData);
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

    const uploadFile = (file: File, path: string) => {
        return new Promise<string>((resolve, reject) => {
            const fileRef = ref(storage, path);
            const uploadTask = uploadBytesResumable(fileRef, file);

            uploadTask.on('state_changed',
                () => { },
                (error) => reject(error),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
                }
            );
        });
    };

    const handleSaveDestination = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const docRef = doc(db, 'destinations', id!);
            const updates: any = {
                name: formData.name,
                address: formData.address,
                aveRating: formData.aveRating,
                description: formData.description,
                tags: formData.tags.map(tag => tag.trim()),
                locationCoords: new GeoPoint(locationCoords!.lat, locationCoords!.lng),
                isFoodServiceEstablishment: formData.isFoodServiceEstablishment,
            };

            if (formData.coverImage) {
                if (formData.coverImage.name !== existingCoverImage) {
                    updates.coverImage = await uploadFile(formData.coverImage, `coverImages/${formData.coverImage.name}`);
                }
            } else {
                updates.coverImage = existingCoverImage;
            }

            if (formData.images.length > 0) {
                const newImageFiles = formData.images.filter(file => !existingImages.includes(file.name));
                if (newImageFiles.length > 0) {
                    const imageUrls = await Promise.all(
                        newImageFiles.map(file => uploadFile(file, `images/${file.name}`))
                    );
                    updates.images = [...existingImages, ...imageUrls];
                } else {
                    updates.images = existingImages;
                }
            } else {
                updates.images = existingImages;
            }

            await updateDoc(docRef, updates);
            console.log('Destination updated successfully!');
            navigate(`/destinations/${id}`);
        } catch (error) {
            console.error('Error updating destination:', error);
        }
    };

    const handleTagChange = (tag: string) => {
        if (formData.tags.includes(tag)) {
            setFormData({
                ...formData,
                tags: formData.tags.filter(t => t !== tag),
            });
        } else {
            setFormData({
                ...formData,
                tags: [...formData.tags, tag],
            });
        }
        console.log(formData);
    };

    const handleRemoveImage = (index: number) => {
        const newImagePreviews = [...imagePreviews];
        const newImages = [...formData.images];
        newImagePreviews.splice(index, 1);
        newImages.splice(index, 1);
        setImagePreviews(newImagePreviews);
        setFormData({ ...formData, images: newImages });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mx-auto px-4 py-16 sm:px-6 lg:px-8 w-full">
            <div className="max-w-screen-lg mx-auto w-full">
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
                <form onSubmit={handleSaveDestination} className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 w-full">
                    <p className="text-center text-lg font-medium">Edit Destination</p>
                    <div>
                        <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Cover Image</label>
                        {coverImagePreview ? (
                            <img src={coverImagePreview} alt="Cover Preview" className="mt-2 w-4/5 h-40 object-cover" />
                        ) : (
                            <div className="mt-2 w-4/5 h-40 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">No cover image selected</span>
                            </div>
                        )}
                        <input
                            type="file"
                            name="coverImage"
                            className="w-4/5 mt-2 p-2 border border-gray-300 rounded-lg"
                            onChange={handleCoverImageChange}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="w-4/5 mt-2 p-2 border border-gray-300 rounded-lg"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            className="w-4/5 mt-2 p-2 border border-gray-300 rounded-lg"
                            value={formData.description}
                            onChange={handleDescriptionChange}
                            required
                        />
                    </div>
                    {/* <div>
                        <label htmlFor="aveRating" className="block text-sm font-medium text-gray-700">Average Rating</label>
                        <input
                            type="number"
                            name="aveRating"
                            className="w-4/5 mt-2 p-2 border border-gray-300 rounded-lg"
                            value={formData.aveRating}
                            onChange={handleChange}
                            min="0"
                            max="5"
                            step="0.1"
                            required
                        />
                    </div> */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            className="w-4/5 mt-2 p-2 border border-gray-300 rounded-lg"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="images" className="block text-sm font-medium text-gray-700">Additional Images</label>
                        <input
                            type="file"
                            name="images"
                            className="w-4/5 mt-2 p-2 border border-gray-300 rounded-lg"
                            onChange={handleImagesChange}
                            multiple
                        />
                        <div className="mt-2 w-4/5 flex flex-wrap gap-2">
                            {imagePreviews.map((image, index) => (
                                <div key={index} className="relative w-32 h-32">
                                    <img src={image} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        className="absolute top-0 right-0 bg-white text-red-500"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                         <Icon path={mdiAlphaXBox} size={1} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <LocationSelect
                            initialPosition={locationCoords}
                            onLocationChange={setLocationCoords}
                        />
                    </div>
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tagOptions.map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    className={`px-3 py-1 border rounded-lg ${formData.tags.includes(tag) ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border-indigo-600'}`}
                                    onClick={() => handleTagChange(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <label htmlFor="isFoodServiceEstablishment" className="block text-sm font-medium text-gray-700 mr-4">Food Service Establishment</label>
                        <input
                            type="checkbox"
                            name="isFoodServiceEstablishment"
                            className="form-checkbox h-4 w-4 text-indigo-600"
                            checked={formData.isFoodServiceEstablishment}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded border border-indigo-600 bg-indigo-600 px-8 py-3 text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DestinationEdit;

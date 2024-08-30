import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import LoadingModal from "../components/LoadingModal";
import { useNavigate, useParams } from "react-router-dom";

interface FormData {
  email: string;
  name: string;
  role: string; // Default role to "user"
}

const AddUserForm: React.FC = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    role: "", // Default role to "user"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const docRef = doc(db, "users", id!);
      
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
       
        setFormData({
          name: data.name,
          email: data.email,
          role: data.role,
        });
     
        setLoading(false);
      } else {
        console.log("No such document!");
        setLoading(false);
      }
    };
    fetchUsers();
  }, [id]);

  const [errors, setErrors] = useState({
    passwordMismatch: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();
  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
  

    try {
      const docRef = doc(db, "users", id!);
      const updates: any = {
        name: formData.name,
        role: formData.role,
      };

      // Clear form after saving
      setFormData({
        email: "",
        name: "",
        role: "",
      });

      await updateDoc(docRef, updates);

      setErrors({ passwordMismatch: false });

      console.log("User added successfully!");
      navigate(`/users/${docRef.id}`);
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setIsSaving(false); // Finish saving state
    }
  };

  return (
    <div className="mx-auto px-4 py-16 sm:px-6 lg:px-8 w-full">
      <LoadingModal isOpen={isSaving} label="Saving..." />
      <div className="max-w-screen-lg mx-auto w-full">
        <a
          className="inline-flex items-center gap-2 rounded border border-orange-theme-500 bg-orange-theme-500 px-8 py-3 text-white hover:bg-transparent hover:text-orange-theme-500 focus:outline-none focus:ring active:text-indigo-500"
          href="/users"
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
        <form
          onSubmit={handleSaveUser}
          className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 w-full"
        >
          <p className="text-center text-lg font-medium">Create New User</p>
          <div>
            <label htmlFor="name" className="sr-only">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                className="w-full md:w-4/5 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                className="w-full md:w-4/5 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>
          <div>
            <label htmlFor="role" className="sr-only">
              Role
            </label>
            <div className="relative">
              <select
                className="w-full md:w-4/5 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select a role
                </option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            className="block w-full md:w-4/5 rounded-lg bg-orange-theme-500 px-5 py-3 text-sm font-medium text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;

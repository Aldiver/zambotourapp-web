import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

const AddUserForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: '', // Default role to "user"
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    passwordMismatch: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, passwordMismatch: true });
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const userDocRef = doc(db, 'users', res.user.uid);

      await setDoc(userDocRef, {
        userId: res.user.uid, 
        email: formData.email,
        name: formData.name,
        role: formData.role || 'user', // Default role to "user" if not specified
      });

      // Clear form after saving
      setFormData({
        email: '',
        name: '',
        role: '',
        password: '',
        confirmPassword: '',
      });

      setErrors({ passwordMismatch: false });

      console.log('User added successfully!');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className="mx-auto px-4 py-16 sm:px-6 lg:px-8 w-full">
      <div className="max-w-screen-lg mx-auto w-full">
        <a
          className="inline-flex items-center gap-2 rounded border border-indigo-600 bg-indigo-600 px-8 py-3 text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
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
        <form onSubmit={handleSaveUser} className="mx-auto mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 w-full">
          <p className="text-center text-lg font-medium">Create New User</p>
          <div>
            <label htmlFor="name" className="sr-only">Full Name</label>
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
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                className="w-full md:w-4/5 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="role" className="sr-only">Role</label>
            <div className="relative">
              <select
                className="w-full md:w-4/5 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select a role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                className="w-full md:w-4/5 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
            <div className="relative">
              <input
                type="password"                                                                                    
                name="confirmPassword"
                className="w-full md:w-4/5 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Confirm password"
                value={formData.confirmPassword}                                                  
                onChange={handleChange}
                required                           
              />
            </div>
            {errors.passwordMismatch && (
              <p className="text-red-500 text-sm">Passwords do not match.</p>
            )}
          </div>
          <button
            type="submit"
            className="block w-full md:w-4/5 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;



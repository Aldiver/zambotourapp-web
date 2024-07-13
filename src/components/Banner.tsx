import React from 'react';
import { Link } from 'react-router-dom';

const Banner: React.FC = () => {
  const handleClick = () => {
    // Find the Blogs section using querySelector
    const blogsSection = document.querySelector("#blogs-section");

    if (blogsSection) {
      // Scroll to the Blogs section
      blogsSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <section className="relative bg-[url('/assets/zamboanga_header.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gray-900/75 "></div>

        <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
          <div className="max-w-xl text-center lg:flex lg:flex-col lg:items-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
              Explore, Discover, and
              <strong className="block font-extrabold text-rose-500">
                {" "}
                Create Unforgettable Memories.{" "}
              </strong>
            </h1>

            <p className="mt-4 max-w-lg text-white sm:text-xl/relaxed">
              Visit Asia's Latin City, various beaches and tourist spots,
              experience the local life and the culture of Zamboangueños.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center w-full">
              <Link
                to="/login"
                className="block w-full rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto"
              >
                Get Started
              </Link>

              <button
                onClick={handleClick}
                className="block w-full rounded bg-white px-12 py-3 text-sm font-medium text-rose-600 shadow hover:text-rose-700 focus:outline-none focus:ring active:text-rose-500 sm:w-auto"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
  );
}

export default Banner;

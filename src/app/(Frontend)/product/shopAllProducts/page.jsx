"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loader from "@/components/loader/loader";
import waveSvg from '../../../../../public/frontend/SvgAssets/wave-white.svg';
import Image from "next/image";
import banner from '../../../../../public/frontend/Banner/AllProductPageBannerlg.webp'


const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("best-selling");
  const [filters, setFilters] = useState({ availability: "", price: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  // Fetch products whenever sort option, filters, or current page changes
  useEffect(() => {
    fetchProducts();
  }, [sortOption, filters, currentPage]);

  // Fetch products from the API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/dashboard/product/addProduct");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle sort change
  const handleSortChange = (e) => setSortOption(e.target.value);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Filter and sort products based on user selection
  const filteredProducts = products
    .filter((product) => {
      if (filters.availability && product.availability !== filters.availability)
        return false;
      if (filters.price && product.price !== filters.price) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "best-selling") return a.sales - b.sales;
      if (sortOption === "price-low-high") return a.price - b.price;
      if (sortOption === "price-high-low") return b.price - a.price;
      return 0;
    });

  // Display products for the current page
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Product card component
  const ProductCard = ({ product }) => (
    <motion.div
      className="relative h-[25rem] w-full md:w-[18rem] lg:h-[28rem] lg:w-[22rem] bg-white rounded-3xl shadow-lg overflow-hidden group"
    >
      {/* Product Image */}
      <div className="overflow-hidden h-[18rem]">
        <img
          src={product.featuredImage}
          alt={product.name}
          className="object-cover h-full w-full transition-transform duration-300 ease-in-out transform group-hover:scale-110"
        />
      </div>
      {/* Product Details */}
      <div className="p-4 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mt-2 group-hover:text-orange-600">
          {product.name}
        </h3>
        <p className="text-gray-700 font-semibold mt-2 text-lg">
          ₹{product.salePrice}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="">
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Filters and Product List */}
          <div className="flex w-full flex-col mb-5">

          <div className="relative w-full h-[60vh] flex items-center">
            <Image 
              src={banner} 
              alt="Banner"
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
              priority 
            />
            <h1 className="absolute left-10 text-[#D07021] md:text-6xl text-3xl">
              All Products
            </h1>
          </div>

            <div className="relative w-full overflow-hidden md:-mt-[1rem] -mt-[1rem]">
                <Image 
                    src={waveSvg} 
                    alt="Wave"
                    layout="responsive"
                    objectFit="cover" 
                    className="w-full"
                    priority 
                />
            </div>
            <div className="flex gap-5 py-5">
              {/* Left Filter Section */}
            <aside className="w-1/4 p-6 bg-white border-r border-gray-300">
              <h2 className="text-xl font-semibold mb-6">Filters</h2>
              {/* Filter: Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option>All</option>
                  <option>Category 1</option>
                  <option>Category 2</option>
                </select>
              </div>
              {/* Filter: Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <input type="range" min="0" max="100" className="w-full" />
              </div>
              {/* Filter: Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" /> <span>4 Stars & up</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" className="w-4 h-4" /> <span>3 Stars & up</span>
                </div>
              </div>
              {/* Filter: Availability */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" /> <span>In Stock</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" className="w-4 h-4" /> <span>Out of Stock</span>
                </div>
              </div>
            </aside>



              {/* Products Grid */}
            <motion.div
              className="flex flex-wrap gap-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
            
            </div>
            

            {/* Pagination */}
          <motion.div className="mt-6 flex justify-center space-x-4">
            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === index + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </motion.div>
            
          </div>
          
        </>
      )}
    </div>
  );
};

export default AllProducts;

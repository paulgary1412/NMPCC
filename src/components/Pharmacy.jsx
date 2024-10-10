

import React, { useState } from 'react';
const Pharmacy = () => {
const products = [
    { id: 1, name: "Product 1", price: 500, sold: "0 sold", image: "img/placeholder.png", category: "Mobile", shippedFrom: "China" },
    { id: 2, name: "Product 2", price: 1000, sold: "10 sold", image: "img/placeholder.png", category: "Laptop", shippedFrom: "Philippines" },
    { id: 3, name: "Product 3", price: 1500, sold: "20 sold", image: "img/placeholder.png", category: "Tablet", shippedFrom: "USA" },
    { id: 4, name: "Product 4", price: 2000, sold: "5 sold", image: "img/placeholder.png", category: "Accessories", shippedFrom: "Japan" },
  ];

  const [category, setCategory] = useState('');
  const [shippedFrom, setShippedFrom] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const handleCategoryChange = (event) => setCategory(event.target.value);
  const handleShippedFromChange = (event) => setShippedFrom(event.target.value);
  const handlePriceChange = (event) => {
    const { name, value } = event.target;
    setPriceRange({ ...priceRange, [name]: value });
  };

  const filteredProducts = products.filter(product => {
    const inCategory = category === '' || product.category === category;
    const inShippedFrom = shippedFrom === '' || product.shippedFrom === shippedFrom;
    const inPriceRange = (!priceRange.min || product.price >= priceRange.min) && (!priceRange.max || product.price <= priceRange.max);
    return inCategory && inShippedFrom && inPriceRange;
  });

  return (
    <div className="shopping-page">
      <div className="filter-section">
        <h3>Filters</h3>
        {/* Category Filter */}
        <div className="filter-category">
          <h4>Category</h4>
          <select value={category} onChange={handleCategoryChange}>
            <option value="">All</option>
            <option value="Mobile">Mobile</option>
            <option value="Laptop">Laptop</option>
            <option value="Tablet">Tablet</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        {/* Shipped From Filter */}
        <div className="filter-shipped">
          <h4>Shipped From</h4>
          <select value={shippedFrom} onChange={handleShippedFromChange}>
            <option value="">All</option>
            <option value="China">China</option>
            <option value="Philippines">Philippines</option>
            <option value="USA">USA</option>
            <option value="Japan">Japan</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="filter-price">
          <h4>Price (PHP)</h4>
          <input
            type="number"
            placeholder="Min"
            name="min"
            value={priceRange.min}
            onChange={handlePriceChange}
          />
          <input
            type="number"
            placeholder="Max"
            name="max"
            value={priceRange.max}
            onChange={handlePriceChange}
          />
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3>{product.name}</h3>
              <p>Price: ₱{product.price}</p>
              <p>{product.sold}</p>
            </div>
          ))
        ) : (
          <p>No products found matching the filters.</p>
        )}
      </div>
    </div>
  );
};

export default Pharmacy;

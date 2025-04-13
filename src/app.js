import React, { useState } from "react";
import axios from "axios";
import "./app.css"; // Import the CSS file

function App() {
  const [productUrl, setProductUrl] = useState("");
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);
  const [targetPrice, setTargetPrice] = useState(null);
  const [email, setEmail] = useState("");

  const fetchPrice = async () => {
    try {
      setError(null);
      const response = await axios.post("http://localhost:5000/scrape", { url: productUrl });
      const fetchedPrice = response.data.price;

      setPrice(fetchedPrice);
      setTargetPrice(fetchedPrice); // Default target price = current price
    } catch (err) {
      setError(err.response?.data || "Failed to fetch price");
    }
  };

  const increasePrice = () => {
    if (targetPrice + 100 <= price) {
      setTargetPrice(targetPrice + 100);
    }
  };

  const decreasePrice = () => {
    if (targetPrice - 100 >= price * 0.5) {
      setTargetPrice(targetPrice - 100);
    }
  };

  const trackPrice = async () => {
    if (!email || !productUrl || !targetPrice) {
      setError("Please enter all details.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/track", {
        url: productUrl,
        targetPrice: targetPrice,
        email: email,
        currentPrice: price, // Store latest price
      });

      alert("Tracking started! You'll be notified when price drops.");
    } catch (err) {
      setError(err.response?.data || "Failed to track price");
    }
  };

  return (
    <div className="container">
      <div className="brand">
        <svg className="brand-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L20 21H4L5 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="brand-name">Easyshop</span>
      </div>

      <h1 className="title">Track Khaadi Product</h1>
      <p className="subtitle">Get notified when your favorite Khaadi products drop in price</p>

      <div className="form-container">
        <div className="form-group">
          <label className="form-label">Product URL</label>
          <input
            type="text"
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            placeholder="https://khaadi.com/product/"
            className="form-input"
          />
          <p className="helper-text">Paste the URL of the Khaadi product you want to track</p>
        </div>
        
        <button onClick={fetchPrice} className="button">
          Get Current Price
        </button>
      </div>

      {/* Display Price & Adjust Range */}
      {price !== null && (
        <div className="price-container">
          <h3 className="current-price">Current Price: PKR {price}</h3>

          <div className="price-controls">
            <button onClick={decreasePrice} className="price-button">-100</button>
            <input
              type="number"
              value={targetPrice}
              readOnly
              className="price-input"
            />
            <button onClick={increasePrice} className="price-button">+100</button>
          </div>

          <p className="price-range">Range: {Math.floor(price * 0.5)} to {price}</p>

          {/* Email Input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            className="email-input"
          />
          <br />
          {/* Track Price Button */}
          <button onClick={trackPrice} className="button button-primary track-button">
            Track Price
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default App;
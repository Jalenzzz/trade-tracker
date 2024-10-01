// Import required modules
const express = require("express");
const cors = require("cors");
const axios = require("axios");

// Initialize express application
const app = express();

// Define port, use environment variable or default to 3000
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Define the data source URL
const DATA_SOURCE_URL =
  "https://badimo.nyc3.digitaloceanspaces.com/trade/frequency/snapshot/month/latest.json";

// API route to fetch trade data
app.get("/api/trade-data", async (req, res) => {
  try {
    // Fetch data from the external API
    const response = await axios.get(DATA_SOURCE_URL, {
      timeout: 5000, // Set a 5-second timeout
    });

    // Send the fetched data as JSON response
    res.json(response.data);
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching data:", error.message);

    // Send an appropriate error response
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res
        .status(error.response.status)
        .json({ error: "External API error", details: error.response.data });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(504).json({ error: "No response from external API" });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Serve static files from the current directory
app.use(express.static("."));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Error handling for uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Perform any necessary cleanup here
  process.exit(1);
});

// Error handling for unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Perform any necessary cleanup here
});

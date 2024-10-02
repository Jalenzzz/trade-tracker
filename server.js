// Import required modules
const express = require("express");
const cors = require("cors");

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
    const response = await fetch(DATA_SOURCE_URL, {
      timeout: 5000, // Set a 5-second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Send the fetched data as JSON response
    res.json(data);
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching data:", error.message);

    // Send an appropriate error response
    if (error.name === "AbortError") {
      res.status(504).json({ error: "Request timeout" });
    } else if (error.message.includes("HTTP error!")) {
      res.status(502).json({ error: "External API error" });
    } else {
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
});

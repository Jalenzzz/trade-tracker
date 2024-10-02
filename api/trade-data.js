import axios from "axios";

const DATA_SOURCE_URL =
  "https://badimo.nyc3.digitaloceanspaces.com/trade/frequency/snapshot/month/latest.json";

export default async function handler(req, res) {
  try {
    const response = await axios.get(DATA_SOURCE_URL, {
      timeout: 5000, // Set a 5-second timeout
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);

    if (error.response) {
      res
        .status(error.response.status)
        .json({ error: "External API error", details: error.response.data });
    } else if (error.request) {
      res.status(504).json({ error: "No response from external API" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

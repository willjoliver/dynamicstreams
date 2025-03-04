// netlify/functions/schedule.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const response = await fetch("https://daddylive.mp/schedule/schedule-generated.json");
    if (!response.ok) {
      return { statusCode: response.status, body: "Error fetching schedule" };
    }
    const data = await response.json();
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch schedule data." })
    };
  }
};

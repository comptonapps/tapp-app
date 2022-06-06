const axios = require("axios");
const apiKey = process.env.GOOGLE_API_KEY;
const apiStub = process.env.GOOGLE_GEOCODE_STUB;
const { BadRequestError } = require("../expressError");

const getLatLng = async components => {
  const res = await axios.get(
    `${apiStub}${getURIComponents(components)}&key=${apiKey}`
  );
  if (!res.data.results[0]) {
    throw new BadRequestError("Invalid Address");
  }
  return res.data.results[0].geometry.location;
};

function getURIComponents(components) {
  return Object.values(components)
    .map(v => `${encodeURIComponent(v)}`)
    .join("%20");
}

module.exports = { getLatLng };

const app = require("./app");
const CONSTANTS = require("./constants");

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

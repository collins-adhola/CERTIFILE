require("dotenv").config();
const { createApp } = require("./app");

const PORT = process.env.PORT || 5050;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Certifile backend running on port ${PORT}`);
});

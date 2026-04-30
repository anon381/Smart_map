require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const app = require('./app');

const PORT = 5002;

app.listen(PORT, () => {
  console.log(`🚀 Server strictly running on port ${PORT}`);
});

setInterval(() => {}, 60000);
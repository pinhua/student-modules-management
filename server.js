const app = require('./app');
const { openDb } = require('./models/databaseConnection');

const port = process.env.PORT || 3000;

openDb().then(() => app.listen(port, () => console.log(`App listening on port ${port}`)));

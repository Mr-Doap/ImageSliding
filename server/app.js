const express = require('express');

const app = express();
const cors = require('cors');

app.use(cors({origin: true, credentials: true}));
app.use(express.json());
app.use(require('./routes/region.routes'));

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi/auth-service.yml');
const usersRouter = require('./routes/users.router');
const errorHandler = require('./_helpers/error-handler');

const PORT = process.env.PORT || 4000;

const app = express();

app.use(logger('common', { stream: fs.createWriteStream('./access.log', { flags: 'a' }) }));
app.use(logger('dev'));
app.use(cors());
app.use(express.json());

app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/users', usersRouter);

// Srart server
app.listen(PORT, () => {
  console.warn(`Server has been started on port http://localhost:${PORT}`);
  console.warn(`You can use Swagger UI http://localhost:${PORT}/api-docs/#`);
});

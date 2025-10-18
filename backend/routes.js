import { callTofFlask } from "./controllers.js";
import express from 'express';
const routes = express.Router();

routes.post('/predict',callTofFlask);

export default routes;


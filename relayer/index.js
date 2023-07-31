import express from "express";
import { init_railgun } from "./raigun/railgun.js";
import cors from 'cors';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
};

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));

global.app = app;

await init_railgun();

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

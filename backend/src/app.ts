import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

const app = express();

//Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

//routes
app.get('/', (req, res) => {
  return res.status(200).json({ message: "Welcome to Team Flow" });
})


export default app;
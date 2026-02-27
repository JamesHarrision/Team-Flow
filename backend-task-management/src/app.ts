import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import workspaceRoutes from './routes/workspace.route';

const app = express();

//Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

//routes
app.get('/', async (req, res) => {
  try {
    return res.status(200).json({
      message: "Welcome to Team Flow - Task management Service",
      database: "Connect to DB successfully"
    });
  } catch (e) {
    return res.status(500).json({
      message: 'Database connection failed',
      error: e
    })
  }
})

app.use("/api/v1/workspaces", workspaceRoutes);

export default app;
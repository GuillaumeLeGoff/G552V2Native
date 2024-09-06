import cors from "cors";
import express from "express";
import "reflect-metadata";
import { ErrorMiddleware } from "./middlewares/error.middleware";
import { extractUser } from './middlewares/extractUser.middleware';
import routes from "./routes/routes";

const app = express();

const port: number = process.env.API_PORT ? parseInt(process.env.API_PORT) : 4000;

app.use(cors());
app.use(extractUser);
app.use(ErrorMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    status,
    message: err.message,
  });
});

export default app;

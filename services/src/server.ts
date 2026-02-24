import express from "express";
import identityRoutes from "../identity/identity.routes";
import mobilityRoutes from "../mobility/mobility.routes";
import realtimeRoutes from "../realtime/realtime.routes";
import predictionRoutes from "../prediction/prediction.routes";
import { env } from "./lib/env";

const app = express();
const PORT = env.PORT;

app.use(express.json());

app.use("/api/identity", identityRoutes);
app.use("/api/mobility", mobilityRoutes);
app.use("/api/realtime", realtimeRoutes);
app.use("/api/prediction", predictionRoutes);

app.listen(PORT, () => {
  console.log(`NammaBus services running on http://localhost:${PORT}`);
});

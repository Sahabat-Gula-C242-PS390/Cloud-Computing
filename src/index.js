"use strict";

import Hapi from "@hapi/hapi";
import routes from "./routes/routes.js";
import { loadModel } from "./models/predict.js";
import { initializeModel } from "./handlers/auth.handler.js";

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route(routes);

  try {
    await initializeModel(); // Load model on startup
    server.route(routes);
    await loadModel();
    console.log("TensorFlow.js model loaded successfully!");
  } catch (err) {
    console.error("Failed to load TensorFlow.js model:", err);
    process.exit(1); // Exit if the model can't be loaded
  }
  
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

init().catch((err) => {
  console.error(err);
});

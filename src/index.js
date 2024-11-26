"use strict";

import Hapi from "@hapi/hapi";
import routes from "./routes/routes.js";

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

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

init().catch((err) => {
  console.error(err);
});

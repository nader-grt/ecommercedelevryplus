import { Application } from "express";

import requestLogger
  from "./middleware/requestLogger.js";

import security
  from "./middleware/security.js";

import rateLimiter
  from "./middleware/rateLimiter.js";

export function setupGateway(
  app: Application
): void {

  /*
  ========================================
  REQUEST LOGGER
  ========================================
  */

  app.use(
    requestLogger
  );

  /*
  ========================================
  SECURITY
  ========================================
  */

  app.use(
    security
  );

  /*
  ========================================
  GLOBAL RATE LIMITER
  ========================================
  */

  app.use(
    rateLimiter
  );

  console.log(
    "API Gateway initialized"
  );
}
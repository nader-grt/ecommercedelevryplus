import { Request, Response, NextFunction } from "express";

export default function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {

  /*
  ========================================
  REQUEST START TIME
  ========================================
  */

  const startTime = Date.now();

  /*
  ========================================
  REQUEST INFORMATION
  ========================================
  */

  console.log("\n========================================");

  console.log("NEW REQUEST");

  console.log("Method:", req.method);

  console.log("URL:", req.originalUrl);

  console.log("IP:", req.ip);

  console.log(
    "Time:",
    new Date().toISOString()
  );

  console.log("========================================");

  /*
  ========================================
  RESPONSE FINISHED
  ========================================
  */

  res.on("finish", () => {

    const duration =
      Date.now() - startTime;

    console.log(
      `[RESPONSE] ${req.method} ${req.originalUrl}`
    );

    console.log(
      `Status: ${res.statusCode}`
    );

    console.log(
      `Duration: ${duration}ms`
    );

    console.log(
      "========================================\n"
    );

  });

  /*
  ========================================
  CONTINUE REQUEST
  ========================================
  */

  next();
}
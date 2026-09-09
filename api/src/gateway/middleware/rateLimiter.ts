import {
    Request,
    Response,
    NextFunction
  } from "express";
  
  interface ClientRateLimit {
  
    count: number;
  
    windowStart: number;
  
  }
  
  const clients = new Map<
    string,
    ClientRateLimit
  >();
  
  const WINDOW_MS = 60 * 1000;
  
  const MAX_REQUESTS = 100;
  
  export default function rateLimiter(
    req: Request,
    res: Response,
    next: NextFunction
  ): any {
  
    /*
    ========================================
    IDENTIFY CLIENT
    ========================================
    */
  
    const clientIp =
      req.ip || "unknown";
  
    const now =
      Date.now();
  
    const client =
      clients.get(clientIp);
  
    /*
    ========================================
    FIRST REQUEST
    ========================================
    */
  
    if (!client) {
  
      clients.set(clientIp, {
  
        count: 1,
  
        windowStart: now
  
      });
  
      return next();
    }
  
    /*
    ========================================
    CHECK TIME WINDOW
    ========================================
    */
  
    const elapsedTime =
      now - client.windowStart;
  
    /*
    If 1 minute has passed,
    create a new window.
    */
  
    if (elapsedTime >= WINDOW_MS) {
  
      clients.set(clientIp, {
  
        count: 1,
  
        windowStart: now
  
      });
  
      return next();
    }
  
    /*
    ========================================
    CHECK REQUEST LIMIT
    ========================================
    */
  
    if (
      client.count >= MAX_REQUESTS
    ) {
  
      return res.status(429).json({
  
        success: false,
  
        message:
          "Too many requests. Please try again later."
  
      });
  
    }
  
    /*
    ========================================
    INCREMENT REQUEST COUNT
    ========================================
    */
  
    client.count += 1;
  
    clients.set(
      clientIp,
      client
    );
  
    /*
    ========================================
    CONTINUE REQUEST
    ========================================
    */
  
    next();
  }
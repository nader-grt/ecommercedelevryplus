import {
    Request,
    Response,
    NextFunction
  } from "express";
  
  export default function security(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
  
    /*
    ========================================
    PREVENT MIME TYPE SNIFFING
    ========================================
    */
  
    res.setHeader(
      "X-Content-Type-Options",
      "nosniff"
    );
  
    /*
    ========================================
    PREVENT CLICKJACKING
    ========================================
    */
  
    res.setHeader(
      "X-Frame-Options",
      "DENY"
    );
  
    /*
    ========================================
    REFERRER POLICY
    ========================================
    */
  
    res.setHeader(
      "Referrer-Policy",
      "strict-origin-when-cross-origin"
    );
  
    /*
    ========================================
    CONTINUE REQUEST
    ========================================
    */
  
    next();
  }
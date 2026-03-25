
  import cors, { CorsOptions } from "cors";


  const allowedOrigins = [
    "http://localhost:3000", // React dev server
  "http://localhost:5173", // Vite dev server
  "http://127.0.0.1:5173",
  ];




export const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (!origin) return callback(null, true); // Postman أو same-origin
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS: Origin not allowed"));
    }
  },

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
  ],

  credentials: true,

  optionsSuccessStatus: 200,
};
    
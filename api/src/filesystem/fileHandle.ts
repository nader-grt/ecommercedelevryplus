// utils/FileHandler.ts
import { Request } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";
      //  fetch path of protocol  file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const folderPath = path.join(__dirname, "productimages");

//source

//file:///home/nader/Pictures/  absolute path


export interface MulterFile {
  fieldname: string;     
  originalname: string;   
  encoding: string;
  mimetype: string;     
  size: number;         
  destination: string;   
  filename: string;      
  path: string;         
  buffer?: Buffer;       
}


export default class FileHandler {
  private destination: string;
  private upload: multer.Multer;



  constructor(destination: string = folderPath) {
    this.destination = destination;
    fs.mkdirSync(this.destination, { recursive: true });

    const storage = multer.diskStorage({
      destination: this.destination,
      filename: (_req: Request, file: any, cb: any) => {

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
      },
    });

    this.upload = multer({
      storage,
      limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
      }
    });
  }

  // Middleware for routes
  public uploadMiddlewareImage(name :string  =""): any {

    return this.upload.single(name); 
  }



  // Get full path of file
  public getFilePath(filename: string) {
    return path.join(this.destination, filename);
  }

  // Delete file
  public async removeFile(filename: string):Promise<void> {
    const filePath = this.getFilePath(filename);
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete file:", err);
    });
  }

  // Save a file object (from multer)
  public async save(file:string):Promise<any> {
    return {
      filename: file,
      path: this.getFilePath(file),
    };
  }


  public async update(oldFilename: string, file: string):Promise<any> {
    // Remove old file

    console.log("oldd file  ",oldFilename , file)
     await this.removeFile(oldFilename);
     // Save new file
     return this.save(file);

    //return null
  }




public static async  getAllImages() {
  try {
    const files = fs.readdirSync(folderPath);

    const images = files.filter(file =>
      /\.(jpg|jpeg|png|gif|avif)$/i.test(file)
    );

    return images;
  } catch (error) {
    console.error("Error reading images:", error);
    return [];
  }
}
}

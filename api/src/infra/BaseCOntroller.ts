import { error } from "console";
import { Request, Response } from "express";

export abstract class BaseController {
  // Child must implement
  protected abstract executeImpl(req: Request, res: Response): Promise<any>; //  call in conteroller

  // Entry point
  public async execute(req: Request, res: Response): Promise<void> {
    try {

  
      await this.executeImpl(req, res);
    } catch (err) {
      this.fail(res, 'An unexpected error occurred');
    }
  }




  
  protected ok(res: Response, data?: any) {
    return res.status(200).json(data);
  }

    
  protected resultValue(res: Response,message?:any, data?: any,status?:string) {
    return res.status(200).json({message, data,status});
  }

  protected created(res: Response, data?: any) {
    return res.status(201).json(data);
  }

  protected fail(res: Response, message: string) {
    return res.status(500).json({ error: message });
  }

  protected notFound(res: Response, message?: string) {
    return res.status(404).json({ error: message || 'Not found' });
  }
  protected badRequest(res:Response,message:any)
  {
    return res.status(400).json({error:message || 'Bad Request'}) ;
    //return res.status(400).json({ error: error.details[0].message });
  }

  protected conflict(res: Response, message?: string,count?:any) {
    return res.status(409).json({ error: message || 'Conflict' });
  }

  protected deleted(res: Response) {
    return res.sendStatus(204);
  }

  protected updated(res: Response, data?: any) {
    return res.status(200).json(data);
  }

  protected unauthorized(res:Response,message?:string)
  {
    return res.status(401).json({ message: message });

  }

  protected invalideCredentiel(res:Response,message?:string)
  {
      return res.status(401).json({ message: message });
  }


  protected paginate(res: Response, data: any, pagination: { limit: number; offset: number; count: number }) {
    res.setHeader('Content-Range', `items ${pagination.offset}-${pagination.offset + pagination.limit}/${pagination.count}`);
    return res.status(200).json(data);
  }
}

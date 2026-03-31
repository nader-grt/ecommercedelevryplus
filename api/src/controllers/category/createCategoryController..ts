import { BaseController } from "../../infra/BaseCOntroller";
import { Request, Response } from "express";


import CreateCategoryUseCase from "../../useCases/categoryUseCase/createCategoryUseCase";

export  default class createCategoryController  extends  BaseController
{

    private usecase!: CreateCategoryUseCase
    constructor( createCategoryUseCase: CreateCategoryUseCase) {
        super();
        this.usecase = createCategoryUseCase
      }

    protected async executeImpl(req:Request,res:Response): Promise<void> {
                const {name}  = req.body ;

console.log("object ",name)
             try {
                
                if(!name || name.length ===0) {
                    this.conflict(res,"Invalid name") ;
                    return ;
                }
                // if (!name) {
                //      this.conflict(res, "Category name is required");
                //   }
            
                  const result = await  this.usecase.execute(name);
            
               

                    this.ok(res,"category created successfully") ;
             } catch (error) {
                console.log(error) ;
                
             }
    }
}
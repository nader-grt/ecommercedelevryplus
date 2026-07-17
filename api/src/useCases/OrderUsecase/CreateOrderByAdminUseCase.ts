import OrderDomain from "../../models/domain/OrderDomain/OrderDomain";
import { userRepo } from "../../repo/auth/userRepo/userRepo";
import OrderRepo from "../../repo/OrderRepo/OrderRepo";
import ProductRepo from "../../repo/productRepo/productRepo";



interface CreateOrderDTO {
    custmerId: number;
    items: [];
    actor: {
      ownerId: number;
      ownerRole: string;
      ownerEmail?: string;
    };
  }

export default class CreateOrderByAdminUseCase 
{
      private _userRepo!:userRepo
      private _orderRepo!:OrderRepo
      private _productRepo!:ProductRepo
       constructor( userrepo  :userRepo,orderRepo:OrderRepo ,productRepo:ProductRepo)
       {
           this._orderRepo = orderRepo ;
           this._userRepo = userrepo ;
           this._productRepo = productRepo
       }

       async execute(dto:CreateOrderDTO):Promise<any>
       {


               try {


             //  console.log("dddddddd usecase Admin ",dto)

                    const user =  await this._userRepo.FindUserById(dto.custmerId)  

                    console.log(" user now  ",user )
                    if(!user)
                    {
                       return {success:false,message:"user not found "}
                    }

       
                    const productIds = dto.items.map(i => i["productId"]);

        // for (let index = 0; index < 3; index++) {
        //   await this._productRepo.GetProductById  
          
        // }    //  promiseall 


                      
            

              //  console.log("prrrrrro  ",productIds)

                  const productMap = await ProductRepo.getProductsMapByIds(productIds);

 

                  console.log("object is  ",productMap)

                // console.log(" productMap  ",productMap)

                  const  order  =  new OrderDomain(dto.custmerId,    user.companyId)  ;

                // console.log("oooooooo  ",order  )
              //  console.log("dto.items  ",dto.items  ,typeof dto.items)

                      for (const item of dto.items) {

                        console.log("object",item  ,"***********  end ")
                        const product = productMap.get(item["productId"]);
                        console.log("prrrrrrrrrrrrrrrr  *****" ,product)
                        if (!product) throw new Error(`Product ${item["productId"]} not found`);
                    //   addItem( productId: number, name: string, quantity: number, price: number )
                        order.addItem(product.id, product.name, item["quantity"], product?.price);
                      }

                                    
                        const totalAmount = order.getTotalAmount();
                     //   console.log(totalAmount);

  console.log("orderrrrrrrrrrrr  ",order)
                   await  this._orderRepo.CreateOrderByAdmin(order)
                     return {success:true,message:"okkkkkkkk"}
               } catch (error) {
                console.log(error)
               }
       }
}
import OrderDomain from "../../models/domain/OrderDomain/OrderDomain";
import IOrderRepo from "./IOrderRepo";
import sequelize from "../../dbConfig/config";
import { Order, OrderItem } from "../../models/main";
import OrderWithDeliverieRepo from "../OrderWithDeliverieRepo/OrderWithDeliverieRepo";
import OrderWithDeliverieDomain from "../../models/domain/OrderWithDeliverieDomain/OrderWithDeliverieDomain";
import { Transaction } from "sequelize";
import { STATUS } from "../../models/Order";





export default class OrderRepo extends IOrderRepo
{

  public async updateStatus(
    orderId: number,
    status: string,
    transaction?: Transaction
): Promise<any> {

    const statusMap: Record<string, string> = {
        PENDING: "pending",
        PAID: "paid",
        RESERVED: "reserved",
        SHIPPED: "shipped",
        DELIVERED: "delivered",
        CANCELLED: "cancelled",
    };

    const dbStatus = statusMap[status.toUpperCase()];

    if (!dbStatus) {
        throw new Error(`Invalid order status: ${status}`);
    }

    const order = await Order.findByPk(orderId, {
        transaction,
        lock: transaction?.LOCK.UPDATE
    });

    if (!order) {
        throw new Error(`Order ${orderId} not found`);
    }

    await order.update(
      {
          status: dbStatus as STATUS
      },
      {
          transaction
      }
  );

    return order;
}


  public async updateOrderItem(
    orderItemId: number,
    data: {
        warehouseId?: number;
        variantId?: number;
    },
    transaction?: Transaction
): Promise<void> {

    const [affectedRows] = await OrderItem.update(
        data,
        {
            where: {
                id: orderItemId
            },
            transaction
        }
    );

    if (affectedRows === 0) {
        throw new Error(
            `OrderItem ${orderItemId} not found`
        );
    }
}

   public async CreateOrderByAdmin(order:OrderDomain):Promise<any> 
   {

           const t = await sequelize.transaction() ;

                     console.log("order rrepooooooooooooo DB ",order)


 

                    try {
                      const orderMapper :any = {

                        customerId: order.GetCustmerId,
                    
                        companyId: order.GetCompanyId,
                    
                        orderDate: order.GetOrderDate,
                    
                        totalAmount: order.GettotalAmountOrder,
                    
                        status: order.GetStatusOrder,
                    
                        paymentStatus: order.GetPaymentStatus,
                    
                        paidAmount: order.GetPaidAmount
                    
                    };

                    console.log("dbbbbbbbbbbbb  ",orderMapper)
                      const resultOrder =   await Order.create(orderMapper,{transaction: t })
                        
                      for (let item of order.GetItems ) {
                       
                        console.log("item 11  ",item ,"\n")

                        const orderItemMapper :any = {
                            orderId:resultOrder.id,
                            productId:item.productId,
                            quantity:item.quantity,
                            price:Number(item.unitPrice),
                            productName:item.productName

                        }

                        console.log("orderItemMapper  ",orderItemMapper)
                              await    OrderItem.create(orderItemMapper,{transaction: t })

                      }


                        await t.commit();
                    } catch (error) {
                        console.log(error)
                        await t.rollback();
                    }
   }


   public async FindOrderWithItems(
    orderId:number,
    transaction?:any
):Promise<any>
{

    try {


        const order = await Order.findByPk(
            orderId,
            {

                include:[
                    {
                        model:OrderItem,
                        as:"items"
                    }
                ],

                transaction

            }
        );


        return order?.get({
            plain:true
        });



    } catch(error){


        console.log(error);

        return null;

    }

}

public async FindOrderById(
  id:number,
  transaction?:any
 ):Promise<any> 
 {  
 
  const t = await sequelize.transaction();
 
  try {
 
    const order = await Order.findByPk(
       id,
       { 
         raw:true,
         transaction:t 
       }
    );
 
    return order;  
 
  } catch(error) {
 
    console.log(error);
    return null; 
  }
 
 }

   public async CancelOrderByOrderIdWithUser(orderId:number,status:string):Promise<any> 
   {

    const t = await sequelize.transaction() ;
  
              try {
                


        
                 if (status === "pending") {
        

               //   console.log("sssssssssssssssssssssssssssssssss  ")
                          await OrderItem.destroy({ where: { orderId }, transaction: t });
        
                                    
                            await Order.destroy({ where: { id: orderId }, transaction: t });
                                
                     await t.commit();
                 }else
                 {
                  await t.rollback();
                  return false;
                 }
        
              
       
                return true;
              } catch (error) {
                await t.rollback();
                console.log(error);
                return false;
              }
   }


   public async DeleteOrderByIdAdmin(orderId:number):Promise<any> 
   {

    const t = await sequelize.transaction() ;
   // const order = await this.FindOrderById(orderId);
              try {
                


                const order = await this.FindOrderById(orderId);
                if (!order) {
                    await t.rollback();
                    return "Order not found";
                }
        
                if (order.status === "completed") {
                    await t.rollback();
                    return "Cannot delete completed order";
                }
        
              
                await OrderItem.destroy({ where: { orderId }, transaction: t });
        
            
                await Order.destroy({ where: { id: orderId }, transaction: t });
        
                await t.commit();
                return true;
              } catch (error) {
                await t.rollback();
                console.log(error);
                return false;
              }
   }

   public async UpdateOrderByAdminId(order:OrderDomain,orderId:number) :Promise<any> 
   {
                       const t = await sequelize.transaction() ;
            try {
              
            } catch (error) {
              
            }
   }
    
   public async PayOrderByOrderByUser(data: {
    orderId: number;
    paidAmount: number;
  }): Promise<any> {
  
    const t = await sequelize.transaction();
  
    try {
      const { orderId, paidAmount } = data;
  
      const orderDB: any = await Order.findByPk(orderId, {
        include: [
          {
            model: OrderItem,
            as: "items", 
          },
        ],
        transaction: t,
        lock: t.LOCK.UPDATE, // 
      });
  
      if (!orderDB) {
        await t.rollback();
        return { success: false, message: "Order not found" };
      }
  
    
      const orderDomain = new OrderDomain(orderDB.customerId);
  
      orderDomain["status"] = orderDB.status;
      orderDomain["totalAmountOrder"] = orderDB.totalAmount
    orderDomain["paymentStatus"] = orderDB.paymentStatus;
    orderDomain["paidAmount"] = Number(orderDB.paidAmount);
                        
   console.log("dddom 1111 ",orderDomain )


  orderDomain.payMoeny(paidAmount,orderDB.totalAmount);
  
      
 
    

      console.log("orderdomain  2 22222222222 ",orderDomain)
  
      
      await Order.update(
        {
          status: orderDomain.GetStatusOrder,
          paymentStatus: orderDomain.GetPaymentStatus,
          paidAmount: orderDomain.GetPaidAmount,
        },
        { where: { id: orderId }, transaction: t }
      );
  
      await t.commit();
      return { success: true };
  
    } catch (error: any) {
      await t.rollback();
     // console.log("orderdomain  2  ",orderDomain)
      return { success: false, message: error.message };
    }
  }

  protected async GetOrderById(orderId:number) :Promise<OrderDomain | any> 
  {
                  const t = await sequelize.transaction() ;
                  try {

                  

               

                    console.log("id  repo  ",orderId)
                    const order:any = await Order.findByPk(orderId, { raw: true ,transaction: t });
                    if (!order) return null;
                  

                       

                            await t.commit()
                            // return OrderDomain.reBuildOrderInit({
                            //   id: order.id,
                            //   customerId: order.customerId,
                            //   status: order.status.toUpperCase(),        
                            //   paymentStatus: order.paymentStatus.toUpperCase(),
                            //   paidAmount: Number(order.paidAmount),
                            //   orderDate: order.orderDate,
                            // });

                            return OrderDomain.reBuildOrderInit({

                              id: order.id,
                          
                              customerId: order.customerId,
                          
                              companyId: order.companyId,
                          
                              status: order.status,
                          
                              paymentStatus: order.paymentStatus,
                          
                              paidAmount: Number(order.paidAmount),
                          
                              orderDate: order.orderDate
                          
                          });
                } catch (error) {
                    console.log(error);
                    await t.rollback()
                    return null; 
                }
  }

  public async ShipOrderByOrderByAdmin(data:any):Promise<any> 
  {
                  const t = await sequelize.transaction();

                  console.log("dddddddddddddd data       ",data)
                  const  {customerId ,orderId }=data
                 
               
                    try {

                      const orderDomain = await this.GetOrderById(Number(orderId))
                      orderDomain.markAsShipped();
                  //    console.log("or22222222222  0",orderDomain)
                      await Order.update(
                        {
                          status: orderDomain.GetStatusOrder,
                    
                        },
                        { where: { id: orderId }, transaction: t }
                      );
                 

                      console.log("repoooooo  ship  ,orderDomain.id  ",orderDomain.id ,orderDomain.GetStatusOrder  , {customerId ,orderId },orderDomain)

                      const orderWithDeliverieDomain = new OrderWithDeliverieDomain(orderId)
            const orderWithDeliverie = new OrderWithDeliverieRepo()

            console.log("orderWithDeliverieDomain  ",orderWithDeliverieDomain)
                   const orderwithdel =          await orderWithDeliverie.CreateOrderWithDeliverInit(orderWithDeliverieDomain,t)

          
                   console.log("555555555  orderwithdel  ",orderwithdel)
                      await t.commit();
                      return { success: true };

                        
                    } catch (error:any) {
                      await t.rollback();
                       return { success: false, message: error.message };
                    }
      
  }
}

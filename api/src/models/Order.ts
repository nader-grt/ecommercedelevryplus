import { Sequelize,Model,DataTypes } from "sequelize";
import { PAYMENT_STATUS } from "./domain/OrderDomain/OrderDomain";


export const enum STATUS 
{
PENDING = "PENDING", 
RESERVED = "reserved",
PAID = "PAID", 
SHIPPED  ="SHIPPED"  ,
 DELIVERED  = "DELIVERED",
  CANCELLED="CANCELLED"

}

export default interface IOrder {
  id?:number ;
  orderDate:Date;
  customerId:number;
  totalAmount:number ;
  status:STATUS
   paymentStatus: PAYMENT_STATUS;
   paidAmount: number;
   companyId?: number;
}



export class Order extends Model<IOrder> implements IOrder {
   
        public id!: number ;
         public orderDate!: Date;
         public customerId!:number;
         public totalAmount!:number ;
         public status!:STATUS ;
         public paymentStatus!: PAYMENT_STATUS;
         public paidAmount!: number;
         public companyId!: number;


  }



  export function OrderModel(sequelize: Sequelize) {
    Order.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
         orderDate: { type: DataTypes.DATE, allowNull: false },
         customerId: { type: DataTypes.INTEGER, allowNull: false },
        totalAmount: { type: DataTypes.DOUBLE, allowNull: false },
     
        status: {
          type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
          allowNull: false,
          //defaultValue: Role.USER,
        },
        paidAmount:{type: DataTypes.DECIMAL ,allowNull: false },
        paymentStatus: {
          type: DataTypes.ENUM('unpaid', 'partial', 'paid'),
          allowNull: false,
        },
        companyId: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      },
      {
        sequelize,
        tableName: "Orders",
        timestamps: true,
      }
    );
  
    return Order;
  }
  
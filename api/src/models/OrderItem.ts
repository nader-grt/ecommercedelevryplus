
import { Sequelize,Model,DataTypes } from "sequelize";


export default interface IOrderItem {
id?:number ;
  orderId:number ;
  productId:number;
   variantId: number | null;
  quantity:number;
  price:number;
  productName:string ;
 // totalPrice:number;


}



/**
 * 
 * 

  orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',  
      },

      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', 
      },

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      unitPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
productName

 await queryInterface.addColumn('OrderItems', 'productName', {
      type: Sequelize.STRING,
      allowNull: false,
    });

   
    await queryInterface.addColumn('OrderItems', 'totalPrice', {
      type: Sequelize.DOUBLE,
      allowNull: false,
      comment: 'Total price for this line: quantity * unitPrice',
    });



 */
export class OrderItem extends Model<IOrderItem> implements IOrderItem {
   
  public id!:number;

  public  orderId!:number ;
  public  productId!:number;
  public variantId!: number | null;
  public  quantity!:number;
  public  price!:number;
  public  productName!:string ;
 // public  totalPrice!:number;
    
  }



  export function OrderItemModel(sequelize: Sequelize) {
    OrderItem.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        orderId: { type: DataTypes.INTEGER, allowNull: false },
        productId: { type: DataTypes.INTEGER, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        price: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        productName: { type: DataTypes.STRING, allowNull: false },
        variantId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "Variants",
            key: "id"
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL"
        },
     
      //  totalPrice: { type: DataTypes.DOUBLE, allowNull: false },
      },
      {
        sequelize,
        tableName: "OrderItems",
        timestamps: true,
      }
    );
  
    return OrderItem;
  }
  
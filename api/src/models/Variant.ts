import { DataTypes, Model, Sequelize } from "sequelize";



export default interface IIVariant
{
    id?:number;
    productId:number;
    sku:string;
    color:string;
    size:string;
    price:number;
    isDeleted?: boolean; // NEW

}
/**
    productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id'
        }
      },

      sku: {
        type: Sequelize.STRING,
        unique: true
      },

      color: {
        type: Sequelize.STRING
      },

      size: {
        type: Sequelize.STRING
      },

      price: {
        type: Sequelize.DECIMAL(10,2)
      },

 */

export class Variant extends Model<IIVariant> implements IIVariant
{
    public id!:number ;
       public      productId!:number;
   public sku!:string;
    public color!:string;
    public  size!:string;
    public price!:number;
    public isDeleted?: boolean;
}



export function VariantModel(sequelize:Sequelize)
{
  Variant.init({
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
  
    productId:{
      type: DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:"Products",
        key:"id"
      },
      onDelete:"CASCADE",
      onUpdate:"CASCADE"
    },
  
    sku: { 
      type: DataTypes.STRING, 
      allowNull: false,
      unique:true
    },
  
    color: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
  
    size: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
  
    price: { 
      type: DataTypes.DECIMAL(10,2), 
      allowNull: false 
    },
    //  
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  
  },{
    sequelize,
    tableName:"Variants",
    timestamps:true,
    defaultScope: {
      where: {
        isDeleted: false
      }
    }
  })

    return Variant ;
}
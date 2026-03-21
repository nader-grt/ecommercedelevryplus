import { DataTypes, Model, Sequelize } from "sequelize";

export default interface IAddress
{
id?:number ;

userId?:number ;
zipeCode:number;
street:string;
delegation?:string;
addressSuplementaire?:string;
city?: string;      // 
country?: string;   // 


}
/**
 * 
 * 
 
         
               
    city: string;              
    country: string;           
  


  id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      zipeCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
      },
      street: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      delegation: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      addressSuplementaire: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
      },
 */

export class Address extends Model<IAddress> implements IAddress
{
   public id!:number ;

   public userId!:number ;
   public  zipeCode!:number;
   public street!:string;
   public delegation!:string;
   public addressSuplementaire!:string;
   public city!: string;
   public country!: string;

}


export function AddressModel(sequelize:Sequelize)
{

  Address.init({
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

        userId:{type: DataTypes.INTEGER ,allowNull: false}  ,
        zipeCode:{type: DataTypes.INTEGER,allowNull: false} ,
        street:{type: DataTypes.STRING,allowNull: false} ,
        delegation:{type: DataTypes.STRING,allowNull: false} ,
        addressSuplementaire:{type: DataTypes.STRING,allowNull: false} ,
        city: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        country: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "Tunis",
        },
        

    },{sequelize,tableName:"userAddresses",timestamps:true})

    return Address ;
}
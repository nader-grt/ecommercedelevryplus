import { DataTypes, Model, Sequelize } from "sequelize";

export default interface IUserAddress
{
id?:number ;

userId:number ;
zipeCode:number;
street:string;
delegation:string;
addressSuplementaire:string;


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

export class UserAddress extends Model<IUserAddress> implements IUserAddress
{
   public id!:number ;

   public userId!:number ;
   public  zipeCode!:number;
   public street!:string;
   public delegation!:string;
   public addressSuplementaire!:string;

}


export function UserAddressModel(sequelize:Sequelize)
{

    UserAddress.init({
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

        userId:{type: DataTypes.INTEGER ,allowNull: false}  ,
        zipeCode:{type: DataTypes.INTEGER,allowNull: false} ,
        street:{type: DataTypes.STRING,allowNull: false} ,
        delegation:{type: DataTypes.STRING,allowNull: false} ,
        addressSuplementaire:{type: DataTypes.STRING,allowNull: false} ,
        

    },{sequelize,tableName:"userAddresses",timestamps:true})

    return UserAddress ;
}
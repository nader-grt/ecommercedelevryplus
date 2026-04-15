import { Sequelize, DataTypes, Model } from "sequelize";

export type ProductType = "SIMPLE" | "VARIABLE";
export  default interface IProduct
{
  id?:number ;
  name:string ;
  price:number;
  nameImage:string ;
  categoryId?: number;
  supplierId?:number;
  type: ProductType | any;
  isDeleted?: boolean; // NEW
}


export class Product extends Model<IProduct> 
implements IProduct{

    public id!: number; 
     public name!:string   ;
     public price!:number ;
     public nameImage!: string;
     public type!: ProductType; // 
     public isDeleted?: boolean;
    


     public get getNameProduct():string
     {
        return this.name ;
     }


     public set setNameProduct(value:string)
     {
         this.name  = value;
     }



     public get getPriceProduct():number
     {
        return this.price ;
     }


     public set setPriceProduct(value:number)
     {
         this.price  = value;
     }

     public get getNameImage():string
     {
        return this.nameImage ;
     }


     public set setNameImage(value:string)
     {
         this.nameImage  = value;
     }


}


export  function ProductModel(sequelize:Sequelize)
{
    Product.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
              },
              price: {
                type: DataTypes.DOUBLE,
                allowNull: false,
              },
              nameImage: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
              },
              categoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
              },
              supplierId: {
                type: DataTypes.INTEGER,
                allowNull: true,
              },
              type: {
                type: DataTypes.ENUM("SIMPLE", "VARIABLE"),
                allowNull: false,
                defaultValue: "SIMPLE",
              },
              //  NEW
              isDeleted: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
              },
           
    }, {
        sequelize,
        tableName: "Products",
        timestamps: false,
        defaultScope: {
          where: {
            isDeleted: false
          }
        }
      })



    return Product
}
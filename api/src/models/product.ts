import { Sequelize, DataTypes, Model } from "sequelize";
import { Variant } from "./Variant";


export type ProductType = "SIMPLE" | "VARIABLE";


export default interface IProduct {

    id?: number;

    name: string;

    price: number;

    nameImage: string;

    categoryId: number;

    supplierId?: number | null;

    type: ProductType;

    companyId: number;

    isDeleted?: boolean;
}



export class Product 
extends Model<IProduct, Omit<IProduct, "id">>
implements IProduct {


    declare public id: number;

    declare public name: string;

    declare public price: number;

    declare public nameImage: string;

    declare public categoryId: number;

    declare public supplierId: number | null;

    declare public type: ProductType;

    declare public companyId: number;

    declare public isDeleted: boolean;

    declare public variants?: Variant[];

    public get getNameProduct(): string {
        return this.name;
    }


    public set setNameProduct(value:string) {
        this.name = value;
    }



    public get getPriceProduct(): number {
        return this.price;
    }


    public set setPriceProduct(value:number) {
        this.price = value;
    }



    public get getNameImage(): string {
        return this.nameImage;
    }


    public set setNameImage(value:string) {
        this.nameImage = value;
    }

}



export function ProductModel(sequelize: Sequelize) {


    Product.init(
    {

        id:{
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },


        name:{
            type:DataTypes.STRING,
            unique:true,
            allowNull:false
        },


        price:{
            type:DataTypes.DOUBLE,
            allowNull:false
        },


        nameImage:{
            type:DataTypes.STRING,
            unique:true,
            allowNull:false
        },


        categoryId:{
            type:DataTypes.INTEGER,
            allowNull:false
        },


        supplierId:{
            type:DataTypes.INTEGER,
            allowNull:true
        },


        type:{
            type:DataTypes.ENUM(
                "SIMPLE",
                "VARIABLE"
            ),
            allowNull:false,
            defaultValue:"SIMPLE"
        },


        companyId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:"Companies",
                key:"id"
            }
        },


        isDeleted:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false
        }


    },
    {
        sequelize,
        tableName:"Products",
        timestamps:false,

        defaultScope:{
            where:{
                isDeleted:false
            }
        }
    });


    return Product;
}
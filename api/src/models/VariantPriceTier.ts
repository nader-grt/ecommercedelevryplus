import { DataTypes, Model, Sequelize } from "sequelize";

export default interface IVariantPriceTier {
    id?: number;
    variantId: number;
    minQty: number;
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
  }


export class VariantPriceTier extends Model<IVariantPriceTier> implements IVariantPriceTier {
  public id!: number;
  public variantId!: number;
  public minQty!: number;
  public price!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}


export function VariantPriceTierModel(sequelize: Sequelize) {
    VariantPriceTier.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
  
        variantId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Variants",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
  
        minQty: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
  
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
  
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
  
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: "VariantPriceTiers",
        timestamps: true,
      }
    );
  
    return VariantPriceTier;
  }
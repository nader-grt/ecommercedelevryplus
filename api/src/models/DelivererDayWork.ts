import { Sequelize, DataTypes, Model } from "sequelize";








export default interface IDelivererDayWork {
  id?: number;
  nbrHours: number;
  delivererId: number;   // ✅ fix
  dayWorkId: number;     // ✅ fix
}

export class DelivererDayWork
  extends Model<IDelivererDayWork>
  implements IDelivererDayWork
{
  public id!: number;
  public nbrHours!: number;
  public delivererId!: number;  // ✅
  public dayWorkId!: number;    // ✅
}

export function DelivererDayWorkModel(sequelize: Sequelize) {
  DelivererDayWork.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      nbrHours: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },

      // ✅ mapping here
      delivererId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "delivererid",
      },

      dayWorkId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "dayWorkid",
      },
    },
    {
      sequelize,
      tableName: "deliverer_dayWorks",
      timestamps: true,
    }
  );

  return DelivererDayWork;
}
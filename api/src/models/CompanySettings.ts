import {
    DataTypes,
    Model,
    Sequelize,
    Optional,
  } from "sequelize";
  
  export interface CompanySettingsAttributes {
    id: number;
    companyId: number;
    currency: string;
    language: string;
    timezone: string;
    taxRate: number | string;
    logoCompany?: string | null;
    addressCompany?: string | null;
    phoneCompany?: string | null;
    emailCompany?: string | null;
    isActive: boolean;
    createdBy?: number | null;
    updatedBy?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface CompanySettingsCreationAttributes
    extends Optional<
      CompanySettingsAttributes,
      | "id"
      | "logoCompany"
      | "addressCompany"
      | "phoneCompany"
      | "emailCompany"
      | "createdBy"
      | "updatedBy"
      | "createdAt"
      | "updatedAt"
    > {}
  
  export class CompanySettings
    extends Model<
      CompanySettingsAttributes,
      CompanySettingsCreationAttributes
    >
    implements CompanySettingsAttributes
  {
    declare id: number;
  
    declare companyId: number;
  
    declare currency: string;
  
    declare language: string;
  
    declare timezone: string;
  
    declare taxRate: number | string;
  
    declare logoCompany: string | null;
  
    declare addressCompany: string | null;
  
    declare phoneCompany: string | null;
  
    declare emailCompany: string | null;
  
    declare isActive: boolean;
  
    declare createdBy: number | null;
  
    declare updatedBy: number | null;
  
    declare readonly createdAt: Date;
  
    declare readonly updatedAt: Date;
  }
  
  export function CompanySettingsModel(
    sequelize: Sequelize
  ): typeof CompanySettings {
    CompanySettings.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
  
        companyId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
        },
  
        currency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          defaultValue: "TND",
        },
  
        language: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: "fr",
        },
  
        timezone: {
          type: DataTypes.STRING(100),
          allowNull: false,
          defaultValue: "Africa/Tunis",
        },
  
        taxRate: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          defaultValue: 0,
        },
  
        logoCompany: {
          type: DataTypes.STRING,
          allowNull: true,
        },
  
        addressCompany: {
          type: DataTypes.STRING,
          allowNull: true,
        },
  
        phoneCompany: {
          type: DataTypes.STRING,
          allowNull: true,
        },
  
        emailCompany: {
          type: DataTypes.STRING,
          allowNull: true,
        },
  
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
  
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
  
        updatedBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
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
        tableName: "CompanySettings",
        timestamps: true,
      }
    );
  
    return CompanySettings;
  }















// import { DataTypes, Model, Sequelize, Optional } from "sequelize";

// interface CompanySettingsAttributes {
//   id: number;
//   companyId: number;

//   currency: string;
//   language: string;
//   timezone: string;
//   taxRate: number;

//   logoCompany?: string | null;
//   addressCompany?: string | null;
//   phoneCompany?: string | null;
//   emailCompany?: string | null;

//   isActive: boolean;

//   createdBy?: number | null;
//   updatedBy?: number | null;

//   createdAt?: Date;
//   updatedAt?: Date;
// }

// interface CompanySettingsCreationAttributes
//   extends Optional<
//     CompanySettingsAttributes,
//     | "id"
//     | "logoCompany"
//     | "addressCompany"
//     | "phoneCompany"
//     | "emailCompany"
//     | "createdBy"
//     | "updatedBy"
//     | "createdAt"
//     | "updatedAt"
//   > {}

// export class CompanySettings
//   extends Model<
//     CompanySettingsAttributes,
//     CompanySettingsCreationAttributes
//   >
//   implements CompanySettingsAttributes
// {
//   declare id: number;
//   declare companyId: number;

//   declare currency: string;
//   declare language: string;
//   declare timezone: string;
//   declare taxRate: number;

//   declare logoCompany: string | null;
//   declare addressCompany: string | null;
//   declare phoneCompany: string | null;
//   declare emailCompany: string | null;

//   declare isActive: boolean;

//   declare createdBy: number | null;
//   declare updatedBy: number | null;

//   declare readonly createdAt: Date;
//   declare readonly updatedAt: Date;
// }

// export function CompanySettingsModel(sequelize: Sequelize) {
//   CompanySettings.init(
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//       },

//       companyId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         unique: true,
//       },

//       currency: {
//         type: DataTypes.STRING(3),
//         allowNull: false,
//         defaultValue: "TND",
//       },

//       language: {
//         type: DataTypes.STRING(10),
//         allowNull: false,
//         defaultValue: "fr",
//       },

//       timezone: {
//         type: DataTypes.STRING(100),
//         allowNull: false,
//         defaultValue: "Africa/Tunis",
//       },

//       taxRate: {
//         type: DataTypes.DECIMAL(5, 2),
//         allowNull: false,
//         defaultValue: 0,
//       },

//       logoCompany: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },

//       addressCompany: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },

//       phoneCompany: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },

//       emailCompany: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },

//       isActive: {
//         type: DataTypes.BOOLEAN,
//         allowNull: false,
//         defaultValue: true,
//       },

//       createdBy: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//       },

//       updatedBy: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//       },

//       createdAt: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: DataTypes.NOW,
//       },

//       updatedAt: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: DataTypes.NOW,
//       },
//     },
//     {
//       sequelize,
//       tableName: "CompanySettings",
//       timestamps: true,
//     }
//   );

//   return CompanySettings;
// }




import { col, fn, Op, where } from "sequelize";
import { Company, Warehouse } from "../../models/main";
import { IWareHouseRepo } from "./IWareHouseRepo";
import QueryBuilder from "../../util/QuiryBuilder";

export default class WareHouseRepo extends IWareHouseRepo {
  
    async create(data: any): Promise<any> {
        const transaction = await Warehouse.sequelize!.transaction();
      
        try {
          const warehouse = await Warehouse.create(data, { transaction });
      
          await transaction.commit();
      
          return warehouse;
        } catch (error) {
          await transaction.rollback();
          throw error;
        }
      }


      async findByNameAndCompany(
        name: string,
        companyId: number
      ): Promise<any> {
        const cleanName = name.trim().toLowerCase();
      
        return await Warehouse.findOne({
          where: {
            companyId,
            [Op.and]: [
              where(fn("LOWER", col("name")), cleanName)
            ]
          },
        });
      }

  async findById(id: number): Promise<any | null> {
    return Warehouse.findByPk(id, { include: ["company"] });
  }


  async findByCompanyId(companyId: number): Promise<any[] | any> {
    return Warehouse.findAll({
      where: { companyId },
      include: ["company"],
    });
  }




  public async findAll(
    cleanQuery: any,
    notFiltered: any
  ): Promise<any> {
    try {
      const qb = new QueryBuilder(cleanQuery, Warehouse)
        .filter()
        .sort()
        .paginate();
  
      const options = qb.build();
  
      const { rows, count } = await Warehouse.findAndCountAll({
        ...options,
  
        include: [
          {
            model: Company,
            as: "company", // 
            attributes: ["id", "name"],
          },
        ],
  
        distinct: true, // 
        nest: true,
        raw: true,
      });
  
      return {
        data: rows,
        total: count || 0,
      };
  
    } catch (error) {
      console.error("WarehouseRepo findAll error:", error);
      throw error;
    }
  }


  async findAllFiltredByName(cleanQuery: any, notcleandata: any): Promise<any> {
    try {
      console.log("repo cleanQuery ", cleanQuery);
  
      //    filter   cleanQuery
      const qb = new QueryBuilder(
        {
          ...cleanQuery,
          filter: notcleandata.filter || cleanQuery.filter || {},
        },
        Warehouse
      )
        .filter()
        .sort()
        .paginate();
  
      const options = qb.build();
  
      // query database
      const { rows, count } = await Warehouse.findAndCountAll({
        ...options,
  
        include: [
          {
            model: Company,
            as: "company",
            attributes: ["id", "name"],
          },
        ],
  
        distinct: true,
        nest: true,
        raw: true,
      });
  
      // return result
      return {
        data: rows,
        total: count || 0,
      };
    } catch (error: any) {
      console.error("findAllFiltredByName Repo Error:", error);
      throw new Error(error.message);
    }
  }
//   async update(id: number, data: any): Promise<any | null> {
//     const Warehouse2 = await Warehouse.findByPk(id);
//     if (!Warehouse2) return null;
//     await Warehouse.update(data);
//     return Warehouse2;
//   }

//   async delete(id: number): Promise<void> {
//     const Warehouse = await Warehouse.findByPk(id);
//     if (!Warehouse) throw new Error("Warehouse not found");
//     await Warehouse.destroy(); // or soft delete
//   }
}
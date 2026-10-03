import { Op, Transaction } from "sequelize";
import ICompanyRepo from "./ICompanyRepo";
import { Address, Company, CompanySettingsModelInstance, sequelize, User } from "../../models/main";
import { ICompany, ICompanyCreation } from "../../models/Company";
import { Role } from "../../models/user";

export default class CompanyRepo implements ICompanyRepo {

  // =========================
  // CREATE COMPANY ONLY
  // =========================
  async createCompany(
    data: ICompanyCreation,
    transaction?: Transaction
  ): Promise<ICompany> {
    const company = await Company.create(data, { transaction });
    return company.get({ plain: true });
  }

  // =========================
  // FIND ALL COMPANIES
  // =========================
  // async findAll(filterIds?: number[]): Promise<any[]> {
  //   const where: any = {};

  //   if (filterIds?.length) {
  //     where.id = { [Op.in]: filterIds };
  //   }

  //   const companies = await Company.findAll({
  //     where,
  //     attributes: [
  //       "id",
  //       "name",
  //       "type",
  //       "ownerId",
  //       "trade_name",
  //       "tax_number",
  //       "registration_number",
  //       "status",
  //       "createdAt"
  //     ],

  //     include: [
  //       {
  //         model: User,
  //         as: "owner",
  //         attributes: ["id", "firstName", "email"],
  //       },
  //     ],

  //     order: [["createdAt", "DESC"]],
  //   });

  //   return companies.map((c: any) => c.get({ plain: true }));
  // }
  async findAll2(filterIds?: number[]): Promise<any[]> {
    const where: any = {};
  
    if (filterIds?.length) {
      where.id = { [Op.in]: filterIds };
    }
  
    const companies = await Company.findAll({
      where,
  
      attributes: [
        "id",
        "name",
        "type",
        "ownerId",
        "trade_name",
        "tax_number",
        "registration_number",
        "status",
        "createdAt",
      ],
  
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "firstName", "email", "role"],
  
          //  THIS IS THE FIX
          where: {
            role: "OWNER",
          },
  
          required: true, // ensures only companies with OWNER appear
        },
      ],
  
      order: [["createdAt", "DESC"]],
    });
  
    return companies.map((c: any) => c.get({ plain: true }));
  }

  // async findAll2(filterIds?: number[]): Promise<any[]> {
  //   const where: any = {};
  
  //   if (filterIds?.length) {
  //     where.id = { [Op.in]: filterIds };
  //   }
  
  //   const companies = await Company.findAll({
  //     where,
  
  //     attributes: [
  //       "id",
  //       "name",
  //       "type",
  //       "ownerId",
  //       "trade_name",
  //       "tax_number",
  //       "registration_number",
  //       "status",
  //       "createdAt",
  //     ],
  
  //     include: [
  //       {
  //         model: User,
  //         as: "owner",
  //         attributes: ["id", "firstName", "email", "role"],
  
  //         where: {
  //           role: "OWNER",
  //         },
  
  //         required: true,
  //       },
  //     ],
  
  //     order: [["createdAt", "DESC"]],
  //   });
  
  //   const plain = companies.map((c: any) => c.get({ plain: true }));
  
  //   // ===============================
  //   // DISTINCT BY EMAIL (REAL FIX)
  //   // ===============================
  //   const uniqueByEmail = Array.from(
  //     new Map(
  //       plain
  //         .filter((c: any) => c?.owner?.email)
  //         .map((c: any) => [c.owner.email, c])
  //     ).values()
  //   );
  
  //   // ===============================
  //   //  IMPORTANT for React-Admin
  //   // ===============================
  //   return uniqueByEmail.map((item: any) => ({
  //     ...item,
  //     id: item.owner.id, // stable unique id for frontend
  //   }));
  // }

  async findAll(filterIds?: number[]): Promise<any[]> {
    const where: any = {};
  
    if (filterIds?.length) {
      where.id = { [Op.in]: filterIds };
    }
  
    const companies = await Company.findAll({
      where,
  
      attributes: [
        "id",
        "name",
        "type",
        "ownerId",
        "trade_name",
        "tax_number",
        "registration_number",
        "status",
        "createdAt",
      ],
  
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "firstName", "email", "role"],
          where: {
            role: "OWNER",
          },
          required: true,
        },
      ],
  
      order: [["createdAt", "DESC"]],
    });
  
    return companies.map((c: any) => {
      const item = c.get({ plain: true });
  
      return {
        ...item,
        id: item.id, // company id (React-Admin friendly)
      };
    });
  }

  // =========================
  // FIND OWNERS WITH COMPANY + ADDRESS
  // =========================
  async findOwnersWithCompanyAndAddress(): Promise<any[]> {
    return await User.findAll({
      where: { role: "OWNER" },

      attributes: ["id", "firstName", "email", "role"],

      include: [
        {
          model: Company,
          as: "company",
          required: true,
          attributes: [
            "id",
            "name",
            "type",
            "trade_name",
            "status"
          ],
        },

        {
          model: Address,
          as: "addresses",
          required: false,
          attributes: [
            "id",
            "street",
            "city",
            "country",
            "zipCode"
          ],
        },
      ],
    });
  }

  // =========================
  // PAGINATION
  // =========================
  async findAllPaginated(page = 1, limit = 10): Promise<any> {
    const offset = (page - 1) * limit;

    const { rows, count } = await Company.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "name",
        "type",
        "ownerId",
        "trade_name",
        "tax_number",
        "registration_number",
        "status"
      ],
    });

    return {
      data: rows.map(r => r.get({ plain: true })),
      total: count,
      page,
      limit,
    };
  }

  // =========================
  // FIND BY ID
  // =========================
  async findById(id: number): Promise<ICompany | null> {

    console.log("companyiddddd  ",id)
    const company = await Company.findByPk(id);

    console.log("compant find ",company)
    if (!company) return null;

    return company.get({ plain: true });
  }

  // =========================
  // FIND BY OWNER
  // =========================
  async findByOwnerId(ownerId: number): Promise<ICompany[]> {
    return await Company.findAll({
      where: { ownerId },
      attributes: [
        "id",
        "name",
        "type",
        "ownerId",
        "trade_name",
        "status"
      ],
      raw: true,
    });
  }

  // =========================
  // UPDATE COMPANY
  // =========================
  async update(
    id: number,
    data: Partial<ICompany>,
    transaction?: Transaction
  ): Promise<ICompany> {
    const company = await Company.findByPk(id, { transaction });

    if (!company) {
      throw new Error("Company not found");
    }

    const updated = await company.update(data, { transaction });

    return updated.get({ plain: true });
  }

  // =========================
  // DELETE COMPANY (HARD)
  // =========================
  async delete(
    id: number,
    transaction?: Transaction
  ): Promise<{ message: string }> {
    const company = await Company.findByPk(id, { transaction });

    if (!company) {
      throw new Error("Company not found");
    }

    await company.destroy({ transaction });

    return { message: "Company deleted successfully" };
  }

  // =========================
  // SOFT DELETE (STATUS BASED)
  // =========================
  async softDelete(
    id: number,
    transaction?: Transaction
  ) {
    const company = await Company.findByPk(id, { transaction });

    if (!company) {
      throw new Error("Company not found");
    }

    await company.update(
      { status: "DELETED" },
      { transaction }
    );

    return { message: "Company deactivated successfully" };
  }

  // =========================
  // TOGGLE ACTIVE STATUS
  // =========================
  async toggleActive(
    id: number,
    transaction?: Transaction
  ): Promise<ICompany> {
    const company = await Company.findByPk(id, { transaction });

    if (!company) {
      throw new Error("Company not found");
    }

    const currentStatus = company.getDataValue("status");

    const newStatus =
      currentStatus === "ACTIVE"
        ? "SUSPENDED"
        : "ACTIVE";

    const updated = await company.update(
      { status: newStatus },
      { transaction }
    );

    return updated.get({ plain: true });
  }

  // =========================
  // CHECK DUPLICATE
  // =========================
  async findByNameAndOwner(name: string, ownerId: number) {
    return await Company.findOne({
      where: { name, ownerId },
      raw: true,
    });
  }

  // =========================
  // FULL FLOW (USER + COMPANY + ADDRESS)
  // =========================
  // async createUserCompanyFullFlow(data: any): Promise<any> {
  //   const t = await sequelize.transaction();

  //   try {
  //     const { company, owner } = data;

  //     // ================= USER =================
  //     const user = await User.create(
  //       {
  //         firstName: owner.firstName,
  //         lastName: owner.lastName,
  //         email: owner.email,
  //         phone: owner.phone,
  //         password: owner.password,
  //         role: Role.OWNER,
  //         companyId: null,
  //       },
  //       { transaction: t }
  //     );

  //     // ================= ADDRESSES =================
  //     let addresses: any[] = [];

  //     if (owner.addresses?.length) {
  //       const created = await Address.bulkCreate(
  //         owner.addresses.map((a: any) => ({
  //           street: a.street,
  //           city: a.city,
  //           country: a.country || "Tunisia",
  //           zipeCode: a.zipCode,
  //           delegation: a.delegation || "",
  //           addressSuplementaire: a.addressSuplementaire || "",
  //           userId: user.id,
  //         })),
  //         { transaction: t }
  //       );

  //       addresses = created.map(a => a.get({ plain: true }));
  //     }

  //     // ================= COMPANY =================
  //     const createdCompany = await Company.create(
  //       {
  //         name: company.name,
  //         type: company.type || "SHOP",

  //         trade_name: company.trade_name || null,
  //         tax_number: company.tax_number || null,
  //         registration_number: company.registration_number || null,

  //         status: company.status || "ACTIVE",

  //         ownerId: user.id,
  //       },
  //       { transaction: t }
  //     );

  //     // ================= LINK =================
  //     await user.update(
  //       { companyId: createdCompany.id },
  //       { transaction: t }
  //     );

  //     await t.commit();

  //     return {
  //       user: user.get({ plain: true }),
  //       company: createdCompany.get({ plain: true }),
  //       addresses,
  //     };

  //   } catch (err: any) {
  //     await t.rollback();
  //     throw err;
  //   }
  // }

  // async createUserCompanyFullFlow(data: any): Promise<any> {
  //   const t = await sequelize.transaction();
  //   try {
  //     const { company, owner } = data;
  
  //     // 1. COMPANY first (ownerId = NULL, allowed by your DESC)
  //     const newCompany = await Company.create(
  //       { ...company, ownerId: null },
  //       { transaction: t }
  //     );
  
  //     // 2. OWNER with the real companyId
  //     const user = await User.create(
  //       {
  //         firstName: owner.firstName,
  //         lastName: owner.lastName,
  //         email: owner.email,
  //         phone: owner.phone,
  //         password: owner.password,
  //         role: Role.OWNER,
  //         companyId: newCompany.id,
  //       },
  //       { transaction: t }
  //     );
  
  //     // 3. ADDRESSES (same code as before, userId: user.id)
  
  //     // 4. LINK back + ACTIVE
  //     await newCompany.update(
  //       { ownerId: user.id, status: "ACTIVE" },
  //       { transaction: t }
  //     );
  
  //     await t.commit();
  //     return { company: newCompany.get({ plain: true }), owner: user.get({ plain: true }), Address };
  //   } catch (e) {
  //     await t.rollback();
  //     throw e;
  //   }
  // }

  async createUserCompanyFullFlow(data: any): Promise<any> {
    const t = await sequelize.transaction();
  
    try {
      const { company, owner } = data;
  
      // =====================================================
      // 1. CREATE COMPANY
      // ownerId = NULL initially
      // =====================================================
  
      const newCompany = await Company.create(
        {
          ...company,
          ownerId: null,
        },
        {
          transaction: t,
        }
      );
  
      // =====================================================
      // 2. CREATE OWNER
      // companyId comes from the newly created Company
      // role is controlled by backend
      // =====================================================
  
      const user = await User.create(
        {
          firstName: owner.firstName,
          lastName: owner.lastName,
          email: owner.email,
          phone: owner.phone,
          password: owner.password,
          role: Role.OWNER,
          companyId: newCompany.id,
        },
        {
          transaction: t,
        }
      );
  
      // =====================================================
      // 3. CREATE ADDRESSES
      // =====================================================
  
      const addresses = owner.addresses || [];
  
      for (const address of addresses) {
        await Address.create(
          {
            zipeCode: address.zipCode,
            street: address.street,
            city: address.city,
            country: address.country,
            delegation: address.delegation,
            addressSuplementaire: address.addressSuplementaire,
            userId: user.id,
          },
          {
            transaction: t,
          }
        );
      }
  
      // =====================================================
      // 4. CREATE COMPANY SETTINGS
      // One Company = One CompanySettings
      // =====================================================
  
      const companySettings = await CompanySettingsModelInstance.create(
        {
          companyId: newCompany.id,
  
          currency: "TND",
          language: "fr",
          timezone: "Africa/Tunis",
          taxRate: 0,
  
          isActive: true,
  
          createdBy: user.id,
          updatedBy: user.id,
        },
        {
          transaction: t,
        }
      );
  
      // =====================================================
      // 5. LINK COMPANY TO OWNER
      // =====================================================
  
      await newCompany.update(
        {
          ownerId: user.id,
          status: "ACTIVE",
        },
        {
          transaction: t,
        }
      );
  
      // =====================================================
      // 6. COMMIT TRANSACTION
      // =====================================================
  
      await t.commit();
  
      // =====================================================
      // 7. RETURN CREATED DATA
      // =====================================================
  
   //   const resultCompanySettings : any =  CompanySettings.get({ plain: true })
      return {
        company: newCompany.get({ plain: true }),
        owner: user.get({ plain: true }),
        settings: companySettings.get({ plain: true }),
      };
  
    } catch (e) {
      // =====================================================
      // ROLLBACK EVERYTHING IF ANY STEP FAILS
      // =====================================================
  
      await t.rollback();
  
      throw e;
    }
  }

}
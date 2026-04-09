import sequelize from "../../dbConfig/config";

import { Address, User } from "../../models/main";
import IUserAddressRepo from "./IUserAddressRepo";




export default class UserAddressRepo extends IUserAddressRepo
{



  public async createUserWithAddresses(

    userId: number | any,
    addresses: any[]
  ): Promise<any> {
  
    const t = await sequelize.transaction();
  
    try {

      const u = await User.findOne({
        where: {
          id: userId,
        },
        raw: true,
        transaction: t
      });
      
      if (!u) {
        return {success:false ,message:"user not foud"}
      }
      console.log("addresses before insert:", addresses);
      const createdAddresses = await Address.bulkCreate(
        addresses.map(addr => ({
          userId: u.id, // 
          zipeCode: addr.zipCode || 1000,
          street: addr.street,
          delegation: addr.delegation || "Default",
          addressSuplementaire: addr.addressSupplementaire || "unknown",
          country: addr.country || "Tunis",
          city: addr.city,
        })),
        { transaction: t }
      );
  
      await t.commit();
  

      return {success:true ,data:createdAddresses}
  
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }


 public async createAddress(address: any): Promise<  any> {
  // هنا تستخدم ORM أو direct DB
  const newAddress = await Address.create(address);
  return newAddress;
}


 public async findAddressByUserId(userId: number): Promise<any> {
  return Address.findAll({ where: { userId } });
}
//  public     async ListUsersWithAddressByAdmin():Promise<any>
//  {

                
//           try {
//             const users = await User.findAll({
//               attributes: ["id", "firstName", "lastName", "email", "phone"],
//               include: [
//                 {
//                   model: Address,
//                   as: "addresses",
//                   attributes: ["zipeCode", "street", "country", "city"],
//                   required: true, // INNER JOIN ensures only users with addresses
//                 },
//               ],
//             });

//             console.log("uuuuuuuuuuuuuuu list ",users)
//             const plainUsers = users.map(user => user.get({ plain: true }));

//             console.log("users with addresses (plain):", plainUsers);
            
//             return plainUsers
//           //  return JSON.parse(JSON.stringify(plainUsers, null, 2));
//             /**
//              const { count, rows } = await User.findAndCountAll({
//                       attributes: ["id", "firstName", "lastName"],
//                       distinct: true, // 

//                       include: [
//                         {
//                           model: Address,
//                           as: "addresses",
//                           attributes: ["zipeCode", "street", "city", "country"],
//                           required: true,
//                         },
//                       ],
//                     });
//              */
//           } catch (error) {
//              console.log(error)
//           }
//  }
/*
public async ListUsersWithAddressByAdmin(): Promise<any> {
  try {
    const users = await User.findAll({
      attributes: ["id", "firstName", "lastName", "email", "phone"],
      include: [
        {
          model: Address,
          as: "addresses",
          attributes: ["id", "zipeCode", "street", "country", "city"],
          required: true,
        },
      ],
    });

    const plainUsers = users.map(user => user.get({ plain: true }));

    const records = plainUsers.flatMap((user: any) =>
      user.addresses.map((addr: any) => ({
        id: addr.id, // ✅ unique per row
        userId: user.id,

        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,

        street: addr.street,
        city: addr.city,
        country: addr.country,
        zipCode: addr.zipeCode,
      }))
    );

    return records;
  } catch (error) {
    console.error(error);
    throw error;
  }
}*/

public async ListUsersWithAddressByAdmin(): Promise<any> {
  try {
    const users = await User.findAll({
      attributes: ["id", "firstName", "lastName", "email", "phone"],
      include: [
        {
          model: Address,
          as: "addresses",
          attributes: ["id", "zipeCode", "street", "country", "city"],
          required: true,
        },
      ],
    });

    const plainUsers = users.map(user => user.get({ plain: true }));

    return plainUsers;
  } catch (error) {
    console.error(error);
    throw error;
  }
}



 public async replaceUserAddresses(
  userId: number,
  addresses: any[]
): Promise<any> {

  const t = await sequelize.transaction();


  console.log("replaceeee  repo   ",userId,addresses ,"  end repoooooooooo  ")
  try {
    const user = await User.findOne({
      where: { id: userId },
      transaction: t,
    });

    console.log("userrrrrr  repooooooo ",user)
    if (!user) {
      throw new Error("User not found");
    }

    await Address.destroy({
      where: { userId },
      transaction: t,
    });

    const createdAddresses = await Address.bulkCreate(
      addresses.map(addr => ({
        userId,
        zipeCode: addr.zipCode || 1000,
        street: addr.street,
        delegation: addr.delegation || "Default",
        addressSuplementaire: addr.addressSuplementaire || "unknown",
        country: addr.country || "Tunisia",
        city: addr.city,
      })),
      { transaction: t }
    );

    await t.commit();

    return createdAddresses;

  } catch (error) {
    await t.rollback();
    throw error;
  }
}

public async updatedUserAddresses(
  userId: number,
  userInfo: any,
  addresses: any[]
): Promise<any> {
  const t = await sequelize.transaction();

  console.log("object updated ", userId, "aaa", userInfo, "bb", addresses);

  try {
    // ================= UPDATE USER =================
    await User.update(userInfo, {
      where: { id: userId },
      transaction: t,
    });

    // ================= DELETE OLD ADDRESSES =================
    await Address.destroy({
      where: { userId },
      transaction: t,
    });

    // // ================= CREATE NEW ADDRESSES =================
    const newAddresses = addresses.map((addr) => ({
      userId,
      street: addr.street,
      city: addr.city,
      country: addr.country,
      delegation: addr.delegation || "",
      addressSuplementaire: addr.addressSuplementaire || "",
      zipeCode: addr.zipCode || 1000,  
    }));

     await Address.bulkCreate(newAddresses, { transaction: t });

    // ================= GET UPDATED DATA =================
    const updatedUser = await User.findByPk(userId, {
      include: [
        {
          model: Address,
          as: "addresses",
        },
      ],
      transaction: t,
      // raw:true,
      // nest: true,
    });


    const cleanData = updatedUser?.get({ plain: true });


    await t.commit();

    return {
      message: "user address updated successfully",
      data: cleanData,
    };
  } catch (error) {
    await t.rollback();
    throw error;
  }
}



 public async GetUsersWithAddressByAdmin(userId?: number): Promise<any> {
  try {
    const whereClause = userId ? { id: userId } : undefined;

    const users = await User.findAll({
      where: whereClause,
      attributes: ["id", "firstName", "lastName", "email", "phone", "role"],
      include: [
        {
          model: Address,
          as: "addresses",
          attributes: [
            "id",
            "street",
            "city",
            "country",

            // 🔥 الحل هنا
            ["zipeCode", "zipCode"],

            "delegation",
            "addressSuplementaire",
            "createdAt",
            "updatedAt",
          ],
          required: false,
        },
      ],
      order: [
        ["id", "ASC"],
        [{ model: Address, as: "addresses" }, "id", "ASC"],
      ],
    });

    // تحويل ل plain object
    const plainUsers = users.map(user => user.get({ plain: true }));

    return plainUsers;

  } catch (error) {
    console.error("Error fetching users with addresses:", error);
    throw error;
  }
}

}

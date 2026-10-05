import { userRepo } from "../../repo/auth/userRepo/userRepo";

import { Role } from "../../models/user";

import { ActorUserAdmin } from "../../dbConfig/configApp";

import { Permission } from "../../Policy/Permission";

import PermissionPolicy from "../../Policy/PermissionPolicy";

interface IGetUser {
  userId: number;
  actor?: ActorUserAdmin;
}

export default class GetUserByAdminUseCase {
  private _usecaseUseRepo!: userRepo;

  constructor(useusecaseuser: userRepo) {
    this._usecaseUseRepo = useusecaseuser;
  }

  async execute(dto: IGetUser): Promise<any> {
    try {
      console.log("usecase factory step 3 ", dto);

      // 1. Check permission
      if (
        !dto.actor?.actorRole ||
        !PermissionPolicy.hasPermission(
          dto.actor.actorRole,
          Permission.USERS_VIEW
        )
      ) {
        return {
          success: false,
          message: "Forbidden: users.view permission required",
        };
      }

      // 2. Check company association
      if (!dto.actor.companyId) {
        return {
          success: false,
          message: "User is not associated with a company",
        };
      }

      // 3. Find user inside the actor's company
      const user = await this._usecaseUseRepo.FindUserById(
        dto.userId,
        dto.actor.companyId
      );

      console.log("step 4 ", user);

      // 4. User does not exist in this company
      if (!user) {
        return {
          success: false,
          message: "user not found",
        };
      }

      // 5. Success
      return {
        success: true,
        user: user,
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        message: "Server error",
      };
    }
  }
}

// import express, { Request, Response } from "express";
// import { userRepo } from "../../repo/auth/userRepo/userRepo";
// import { Role } from "../../models/user";
// import { ActorUserAdmin } from "../../dbConfig/configApp";
// import { Permission } from "../../Policy/Permission";
// import PermissionPolicy from "../../Policy/PermissionPolicy";

// interface IGetUser {
//   userId: number;
//   actor?: ActorUserAdmin;
// }

// export default class GetUserByAdminUseCase {
//   private _usecaseUseRepo!: userRepo;

//   constructor(useusecaseuser: userRepo) {
//     this._usecaseUseRepo = useusecaseuser;
//   }

//   async execute(dto: IGetUser): Promise<any> {
//     try {
//       console.log("usecase factory  step 3 ", dto);

//       if (
//         !dto.actor?.actorRole ||
//         !PermissionPolicy.hasPermission(
//           dto.actor.actorRole,
//           Permission.USERS_VIEW
//         )
//       ) {
//         return {
//           success: false,
//           message: "Forbidden: users.view permission required",
//         };
//       }

//       const user = await this._usecaseUseRepo.FindUserById(dto.userId);

//       console.log("step 4  ", user);

//       if (!user) {
//         return {
//           success: false,
//           message: "user not found ",
//         };
//       }

//       return {
//         success: true,
//         user: user,
//       };
//     } catch (error) {
//       console.log(error);

//       return {
//         success: false,
//         message: "Server error",
//       };
//     }
//   }
// }

// import express, { Request, Response } from "express";
// import { userRepo } from "../../repo/auth/userRepo/userRepo";
// import { Role } from "../../models/user";
// import { ActorUserAdmin } from "../../dbConfig/configApp";

// interface IGetUser {
//   userId: number;
//   actor?: ActorUserAdmin;
// }

// export default class GetUserByAdminUseCase {
//   private _usecaseUseRepo!: userRepo;
//   constructor(useusecaseuser: userRepo) {
//     this._usecaseUseRepo = useusecaseuser;
//   }

//   async execute(dto: IGetUser): Promise<any> {
//     try {

//                   console.log("usecase factory  step 3 ",dto)
//       if (dto.actor?.actorRole?.toLowerCase() !== Role.ADMIN.toLowerCase()) {
//         return {
//           success: false,
//           message: "Only admin can get user",
//         };
//       }
//       const user = await this._usecaseUseRepo.FindUserById(dto.userId);

//       console.log("step 4  ",user)
//       if (!user) {
//         return { success: false, message: "user not found " };
//       }

//       return { success: true, user: user };
//     } catch (error) {
//       console.log(error);
//       return { success: false, message: "Server error" };
//     }
//   }
// }

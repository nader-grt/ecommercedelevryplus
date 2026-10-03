import { Request, Response } from "express";
import Joi from "joi";
import { BaseController } from "../../infra/BaseCOntroller";
import generateAccessToken from "../../middleware/generateAccessToken";
import { generateRefreshToken } from "../../middleware/generateRefreshToken";
import RegisterUseCase from "../../useCases/Auth/RegisterUseCase";


export default class RegisterController extends BaseController {
  private readonly _registerUseCase = new RegisterUseCase();

  protected async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const schema = Joi.object({
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        phone: Joi.string().min(6).max(20).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
      });

      const { error, value } = schema.validate(req.body);
      if (error) return this.badRequest(res, error.details[0].message);

      const result = await this._registerUseCase.execute(value);
      if (result.status === "EMAIL_EXISTS") {
        return this.conflict(res, "User already exists with this email");
      }

      const { user } = result;
      const accessToken = await generateAccessToken(user.email, user.role, user.id,user.companyId);
      const refreshToken = await generateRefreshToken(user.email, user.role, user.id,user.companyId);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 7,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return this.ok(res, {
        message: "User registered successfully",
        user,
        tokens: { accessToken, refreshToken },
      });
    } catch (err: any) {
      console.error(err);
      return this.fail(res, "Something went wrong");
    }
  }
}















// import { Request, Response } from "express";
// import { BaseController } from "../../infra/BaseCOntroller";
// import Joi from "joi";

// import userDomain from "../../models/domain/auth/user/userDomain";
// import generateAccessToken from "../../middleware/generateAccessToken";
// import { generateRefreshToken } from "../../middleware/generateRefreshToken";
// import { userRepo } from "../../repo/auth/userRepo/userRepo";

// export default class RegisterController extends BaseController {
//   private _userDomain: userDomain;
//   private _userRepo: userRepo;

//   constructor() {
//     super();
//     this._userDomain = new userDomain();
//     this._userRepo = new userRepo();
//   }

//   protected async executeImpl(req: Request, res: Response): Promise<any> {
//     try {
//       const schema = Joi.object({
//         firstName: Joi.string().min(2).max(50).required(),
//         lastName: Joi.string().min(2).max(50).required(),
//         phone: Joi.string().min(6).max(20).required(),
//         email: Joi.string().email().required(),
//         password: Joi.string().min(6).required(),
//         // city: Joi.string().optional(),
//         // address: Joi.string().optional(),
//         role: Joi.string()
//           .valid("user", "admin", "supplier", "deliverer", "secrtrie")
//           .optional(),
//       });

//       const { error, value } = schema.validate(req.body);
//       if (error) return this.badRequest(res, error.details[0].message);
//       //let role = value.role ? value.role : Role.USER;

//       const { firstName, lastName, phone, email, password, role } = value;

//       const exists = await this._userRepo.IsExistUser(email);
//       if (exists)
//         return this.conflict(res, "User already exists with this email");

//       const hashedPassword = await userDomain.hashPassword(password);

//       this._userDomain.setFirstName = firstName;
//       this._userDomain.setLastName = lastName;
//       this._userDomain.setPhone = phone;
//       this._userDomain.setEmail = email;
//       this._userDomain.setPassword = hashedPassword;
//       // this._userDomain.setCity = city;
//       // this._userDomain.setAddress = address;
//       this._userDomain.setRole = role;

//       //  Save user

//       console.log("beforrrrrrrrrrrrr  ", this._userDomain);
//       const savedUser = await this._userRepo.registerUser({
//         firstName: this._userDomain.getFirstName,
//         lastName: this._userDomain.getLastName,
//         phone: this._userDomain.getPhone,
//         email: this._userDomain.getEmail,
//         password: hashedPassword,
//         role: this._userDomain.getRole,
//       });

//       const accessToken = await generateAccessToken(
//         savedUser.email,
//         savedUser.role,
//         savedUser.id
//       );
//       const refreshToken = await generateRefreshToken(
//         savedUser.email,
//         savedUser.role,
//         savedUser.id
//       );

//       res.cookie("accessToken", accessToken, {
//         httpOnly: true,
//         secure: false, //
//         sameSite: "lax",
//         maxAge: 1000 * 60 * 60 * 7, //
//       });

//       // Refresh Token cookie
//       res.cookie("refreshToken", refreshToken, {
//         httpOnly: true,
//         secure: false,
//         sameSite: "lax",
//         maxAge: 1000 * 60 * 60 * 24 * 7, //
//       });

//       return this.ok(res, {
//         message: "User registered successfully",
//         user: {
//           id: savedUser.id,
//           firstName: savedUser.firstName,
//           lastName: savedUser.lastName,
//           email: savedUser.email,
//           role: savedUser.role,
//         },
//         tokens: {
//           accessToken,
//           refreshToken,
//         },
//       });
//     } catch (err: any) {
//       console.error(err);
//       // return this.internalServerError(res, "Something went wrong");
//     }
//   }
// }

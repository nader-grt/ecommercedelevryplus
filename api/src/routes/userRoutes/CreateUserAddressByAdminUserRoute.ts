import { Request, Response, Router } from "express";
import UserAddressRepo from "../../repo/userAddressRepo/UserAddressRepo";
import { userRepo } from "../../repo/auth/userRepo/userRepo";
import { verifyToken } from "../../middleware/verifyToken";
import CreateUserAddressByAdminUserUseCase from "../../useCases/userUseCase/CreateUserAddressByAdminUserUseCase";
import CreateUserAddressByAdminUserController from "../../controllers/users/CreateUserAddressByAdminUserController";

const router = Router();

const addressRepo = new UserAddressRepo();
const createUserAddressRepo = new userRepo();
const createAddressByAdminUserUseCase =
  new CreateUserAddressByAdminUserUseCase(
    addressRepo,
    createUserAddressRepo
  );
//CreateUserAddressByAdminUserUseCase
const createUserAddressByAdminUserRoute =
  new CreateUserAddressByAdminUserController(
    createAddressByAdminUserUseCase
  );

router.post(
  "/usersAddress",
  verifyToken,
  (req: Request, res: Response) => {
    createUserAddressByAdminUserRoute.execute(req,res);
  }
);

export default router;

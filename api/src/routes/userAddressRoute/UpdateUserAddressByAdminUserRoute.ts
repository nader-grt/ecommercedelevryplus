import { Request, Response, Router } from "express";
import UserAddressRepo from "../../repo/userAddressRepo/UserAddressRepo";
import { userRepo } from "../../repo/auth/userRepo/userRepo";
import UpdateUserAddressByAdminUserUseCase from "../../useCases/UserAddressUseCase/UpdateAddressByAdminUserUseCase";
import UpdateUserAddressByAdminUserController from "../../controllers/UserAddress/UpdateAddressByAdminUserController";
import { verifyToken } from "../../middleware/verifyToken";

const router = Router();

const userAddressRepo = new UserAddressRepo();
const updateuserByAdmincaseUserRepo = new userRepo();

const updateUserAddressByAdminUserUseCase =
  new UpdateUserAddressByAdminUserUseCase(
    userAddressRepo,
    updateuserByAdmincaseUserRepo
  );

const updateUserAddressByAdminUserRoute =
  new UpdateUserAddressByAdminUserController(
    updateUserAddressByAdminUserUseCase
  );

router.put("/addresses/:id", verifyToken, (req: Request, res: Response) => {
  updateUserAddressByAdminUserRoute.execute;
});

export default router;

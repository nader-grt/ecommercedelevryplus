import { Request, Response, Router } from "express";
import UserAddressRepo from "../../repo/userAddressRepo/UserAddressRepo";
import { userRepo } from "../../repo/auth/userRepo/userRepo";
import DeleteUserAddressByAdminUseCase from "../../useCases/UserAddressUseCase/DeleteAddressByAdminUseCase";
import DeleteUserAddressByAdminController from "../../controllers/UserAddress/DeleteAddressByAdminController";
import { verifyToken } from "../../middleware/verifyToken";

const router = Router();

const userAddressRepo = new UserAddressRepo();
const deleteuserByAdmincaseUserRepo = new userRepo();
const deleteUserAddressByAdminUseCase = new DeleteUserAddressByAdminUseCase(
  userAddressRepo,
  deleteuserByAdmincaseUserRepo
);
const deleteUserAddressByAdminRoute = new DeleteUserAddressByAdminController(
  deleteUserAddressByAdminUseCase
);

router.delete("/addresses/:id", verifyToken, (req: Request, res: Response) => {
  deleteUserAddressByAdminRoute.execute;
});

export default router;

import { Request, Response, Router } from "express";
import UserAddressRepo from "../../repo/userAddressRepo/UserAddressRepo";
import { userRepo } from "../../repo/auth/userRepo/userRepo";
import { verifyToken } from "../../middleware/verifyToken";
import UpdateUserAddressByAdminUserUseCase from "../../useCases/userUseCase/UpdateUserAddressByAdminUserUseCase";
import UpdateUserAddressByAdminUserController from "../../controllers/users/UpdateUserAddressByAdminUserController";

const router = Router();

const addressRepo = new UserAddressRepo();
const updateUserAddressRepo = new userRepo();

const useCase = new UpdateUserAddressByAdminUserUseCase(
  addressRepo,
  updateUserAddressRepo
);

const updateUserAddressByAdminUserRoute =
  new UpdateUserAddressByAdminUserController(useCase);


  

router.put(
  //addresses
  "/usersAddress/:id",
  verifyToken,
  (req: Request, res: Response) => {
    updateUserAddressByAdminUserRoute.execute(req, res);
  }
);

export default router;

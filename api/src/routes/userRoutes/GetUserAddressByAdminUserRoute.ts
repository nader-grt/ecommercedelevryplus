import { Request, Response, Router } from "express";
import UserAddressRepo from "../../repo/userAddressRepo/UserAddressRepo";
import { userRepo } from "../../repo/auth/userRepo/userRepo";
import { verifyToken } from "../../middleware/verifyToken";
import GetUserAddressByAdminUserUseCase from "../../useCases/userUseCase/GetUserAddressByAdminUserUseCase";
import GetUserAddressByAdminUserController from "../../controllers/users/GetUserAddressByAdminUserController";



const router = Router();

const addressRepo = new UserAddressRepo();
const getUserRepo = new userRepo();







  const  useCase  = new  GetUserAddressByAdminUserUseCase(addressRepo,getUserRepo);
  const getUserAddressByAdminUserRoute = new GetUserAddressByAdminUserController(useCase)
router.get(
    //addresses
  "/usersAddress/:id",
  verifyToken,
  (req: Request, res: Response) => {
    getUserAddressByAdminUserRoute.execute(req,res);
  }
);



export default router
import { Request, Response, Router } from "express";
import UserAddressRepo from "../../repo/userAddressRepo/UserAddressRepo";
import { userRepo } from "../../repo/auth/userRepo/userRepo";
import CreateUserAddressByAdminUserUseCase from "../../useCases/UserAddressUseCase/CreateUserAddressByAdminUserUseCase";
import CreateUserAddressByAdminUserController from "../../controllers/UserAddress/CreateUserAddressByAdminUserController";
import { verifyToken } from "../../middleware/verifyToken";



const router = Router() ;


const  userAddressRepo  = new UserAddressRepo();
const  createuserByAdmincaseUserRepo =  new  userRepo();
const createUserAddressByAdminUserUseCase = new CreateUserAddressByAdminUserUseCase(userAddressRepo,createuserByAdmincaseUserRepo)

 const createUserAddressByAdminUserRoute = new CreateUserAddressByAdminUserController(createUserAddressByAdminUserUseCase)

router.post("/users/:userId/addresses",verifyToken,(req:Request,res:Response) => {
    createUserAddressByAdminUserRoute.execute

})

export default router
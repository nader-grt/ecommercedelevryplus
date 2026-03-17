import { Request, Response, Router } from "express";
import GetAllUserCOntroller from "../../controllers/users/getAllUserController";
import { verifyToken } from "../../middleware/verifyToken";
import { userRepo } from "../../repo/auth/userRepo/userRepo";
import GetAllUserUseCase from "../../useCases/userUseCase/GetAllUserUseCase";

const userepo = new userRepo();
const getAllUserUsecase = new GetAllUserUseCase(userepo);
const getListUsersRoute = new GetAllUserCOntroller(getAllUserUsecase);

const router = Router();

router.get("/users/", verifyToken, (req: Request, res: Response) => {
  getListUsersRoute.execute(req, res);
});

export default router;

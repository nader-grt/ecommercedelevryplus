import DeleteUserController from "../controllers/users/DeleteUserController";
import GetAllUserCOntroller from "../controllers/users/getAllUserController";
import GetProfileUserController from "../controllers/users/GetProfileUserController";
import GetUserByAdminController from "../controllers/users/GetUserByAdminController";
import updateProfileUserController from "../controllers/users/updateProfileUserController";
import updateUserByAdminController from "../controllers/users/updateUserByAdminController";
import { userRepo } from "../repo/auth/userRepo/userRepo";
import DeleteUserUseCase from "../useCases/userUseCase/DeleteUserUseCase";
import GetAllUserUseCase from "../useCases/userUseCase/GetAllUserUseCase";
import GetProfileUserUseCase from "../useCases/userUseCase/GetProfileUserUseCase";
import GetUserByAdminUseCase from "../useCases/userUseCase/GetUserByAdminUseCase";
import updateUserByAdminUseCase from "../useCases/userUseCase/updateUserByAdminUseCase";
import UpdateUserProfileUseCase from "../useCases/userUseCase/UpdateUserProfileUseCase";


export class UserControllerFactory {

  private static  repo= new userRepo() ;
  static GetProfileController() {
   // const repo = new userRepo();
    const useCase = new GetProfileUserUseCase(this.repo);
    return new GetProfileUserController(useCase);
  }

  static GetUserByAdminController() {
//    const repo = new userRepo();

    const useCase = new GetUserByAdminUseCase(this.repo);
    return new GetUserByAdminController(useCase);
  }

  static GetAllUserController() {
   // const repo = new userRepo();

    const useCase = new GetAllUserUseCase(this.repo);
    return new GetAllUserCOntroller(useCase);
  }
  static UpdateUserByAdminrController() {
  //  const repo = new userRepo();

    const useCase = new updateUserByAdminUseCase(this.repo);
    return new updateUserByAdminController(useCase);
  }

  static UpdateProfileUserrController() {
   

    const useCase = new UpdateUserProfileUseCase(this.repo);
    return new  updateProfileUserController(useCase);
  }

  static DeleteUserByAdminController() {
  //  const repo = new userRepo();

    const useCase = new DeleteUserUseCase(this.repo);
    return new  DeleteUserController(useCase);
  }
}

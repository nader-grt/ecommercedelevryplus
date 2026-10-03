import { Request, Response, Router } from "express";
import { requirePlatformUser } from "../../middleware/requirePlatformUser";
import { RequestAuth, verifyToken } from "../../middleware/verifyToken";



const router = Router();


router.get(
    "/platform/test",
    verifyToken,
    requirePlatformUser,
    (req: RequestAuth, res: Response) => {
      res.status(200).json({
        message: "Platform access granted",
        user: {
          id: req.user?.id,
          role: req.user?.role,
          companyId: req.user?.companyId,
        },
      });
    }
  );



export default router;
import { Router } from "express";
import {
  addProducts,
  allusers,
  completedOrder,
  dailyOrder,
  getCategoryDist,
  getOrderDist,
  getOrders,
  getProducts,
  getsalesDist,
  loginUser,
  pendingOrder,
  registerUser,
  salesOverview,
  salesOverviewMonth,
  testapi,
  totalOrder,
  totalSale,
  totalStock,
  userOrder,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/test").post(testapi);
router.route("/allusers").post(allusers);
router.route("/login").post(loginUser);
router.route("/order").post(verifyJWT, userOrder);
router.route("/addProduct").post(addProducts);
router.route("/allProduct").post(getProducts);
router.route("/allorders").post(getOrders);
router.route("/orderDist").post(getOrderDist);
router.route("/categoryDist").post(getCategoryDist);
router.route("/salesDist").post(getsalesDist);
router.route("/totalsale").post(totalSale);
router.route("/totalstock").post(totalStock);
router.route("/salesoverview").post(salesOverview);
router.route("/salesoverviewMonth").post(salesOverviewMonth);
router.route("/totalorder").post(totalOrder);
router.route("/pendingorder").post(pendingOrder);
router.route("/completedorder").post(completedOrder);
router.route("/dailyorder").post(dailyOrder);


export default router;

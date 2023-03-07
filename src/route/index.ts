import { Router } from "express";
import { UserController, OrderController, MailController } from "../controller";
import authMiddleware from "../middleware/auth.middleware";
const router = Router();

const User = new UserController();
const Order = new OrderController();
const Mail = new MailController();

router.post("/api/user/registration", User.registration);
router.post("/api/user/login", User.login);
router.post("/api/user/logout", User.logout);
router.get("/api/user/refresh", User.refresh);
router.post("/api/user/activate", User.activate);
router.get("/api/user/activate/:link", User.confirm);
router.post("/api/user/update", User.update);
router.post("/api/user/recovery", User.recovery);

router.post("/api/mail/feedback", Mail.feedback);
router.post("/api/mail/order", Mail.order);
router.post("/api/mail/candidate", Mail.candidate);

router.get("/api/orders", Order.getOrders);
router.post("/api/orders/calc", Order.calcOrder);
router.post("/api/orders/create", Order.createOrder);
router.post("/api/orders/cancel", Order.cancelOrder);

export default router;

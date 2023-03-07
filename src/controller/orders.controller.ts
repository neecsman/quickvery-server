import express from "express";
import { OrderService } from "../service";

export class OrderController {
  async getOrders(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { refreshToken } = req.cookies;
      const orderService = new OrderService();
      const data = await orderService.getOrders(refreshToken);

      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async createOrder(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const order = req.body;
      const { refreshToken } = req.cookies;
      const orderService = new OrderService();
      const data = await orderService.createOrder(order, refreshToken);
      return res.json(data.data);
    } catch (error) {
      console.log(error);
      error;
      next(error);
    }
  }

  async calcOrder(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const order = req.body;
      const orderService = new OrderService();
      const data = await orderService.calcOrder(order);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const orderId = req.body;
      const orderService = new OrderService();
      const data = await orderService.cancelOrder(orderId);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }
}

export default OrderController;

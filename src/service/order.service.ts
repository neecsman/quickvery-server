import { Orders } from "../entity";
import baseQuery from "../API/axios";
import { ErrorService, TokenService } from "../service";
import { AppDataSource } from "../data-source";

class OrderService {
  async getOrders(refreshToken: string) {
    if (!refreshToken) {
      throw ErrorService.UnauthorizedError();
    }

    const tokenService = new TokenService();

    const userData = tokenService.validateRefreshToken(refreshToken);

    if (!userData) {
      throw ErrorService.UnauthorizedError();
    }

    const result = await AppDataSource.getRepository(Orders)
      .createQueryBuilder("orders")
      .where("orders.userId = :id", { id: userData.id })
      .getMany();

    const orders = result.map((item) => item.order_id);

    if (!orders.length) {
      return [];
    } else {
      const data = await baseQuery.get(`/orders`, {
        params: {
          order_id: orders,
        },
      });
      return data.data.orders;
    }
    return [];
  }

  async createOrder(order: any, refreshToken: string) {
    const orderInfo = {
      vehicle_type_id: order.how_delivery,
      matter: order.object,
      insurance_amount: order.object_price,
      total_weight_kg: order.total_weight,
      points: [
        {
          address: order.adress_from,
          contact_person: { name: order.name_from, phone: order.phone_from },
          taking_amount:
            order.payments_adress == "1" ? order.taking_amount : "",
          note: order.note_from || "",
          required_start_datetime: order.start_time || "",
        },
        {
          address: order.adress_where,
          contact_person: { name: order.name_where, phone: order.phone_where },
          taking_amount:
            order.payments_adress == "2" ? order.taking_amount : "",
          note: order.note_where || "",
          required_start_datetime: order.end_time || "",
        },
      ],
    };

    const validate = (e: any) => /^((\+7|7|8)+([9-9])+([0-9]){9})$/i.test(e);

    if (!validate(order.phone_from)) {
      throw ErrorService.BadRequest(
        "Некорректный номер телефона отправителя... 🥲"
      );
    }

    if (!validate(order.phone_where)) {
      throw ErrorService.BadRequest(
        "Некорректный номер телефона получателя... 🥲"
      );
    }

    if (!refreshToken) {
      throw ErrorService.UnauthorizedError();
    }

    const tokenService = new TokenService();
    const userData = tokenService.validateRefreshToken(refreshToken);

    if (!userData) {
      throw ErrorService.UnauthorizedError();
    }

    const data = await baseQuery.post("/create-order", orderInfo);

    const orders = new Orders();
    orders.order_id = data.data.order.order_id;
    orders.userId = userData.id;

    await AppDataSource.manager.save(orders);

    return data;
  }

  async calcOrder(order: any) {
    const orderInfo = {
      vehicle_type_id: order.how_delivery,
      matter: order.object,
      insurance_amount: order.object_price,
      total_weight_kg: order.total_weight,
      points: [
        {
          address: order.adress_from,
          contact_person: { phone: order.phone_from },
          required_start_datetime: order.start_time || null,
        },
        {
          address: order.adress_where,
          contact_person: { phone: order.phone_where },
          required_start_datetime: order.end_time || null,
        },
      ],
    };

    const data = await baseQuery.post("/calculate-order", orderInfo);
    return data.data;
  }

  async cancelOrder(orderId: object) {
    const data = await baseQuery.post("/cancel-order", orderId);
    return data.data;
  }
}

export default OrderService;

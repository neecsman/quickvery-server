import axios from "axios";

const headers = {
  "Content-Type": "application/json",
  "X-DV-Auth-Token": "D66A3063BF3ABAA970C2EC0F5C12037C8CF2392A", //test
  // "X-DV-Auth-Token": "208D083D75F0134B28F5578F1CDC85DB30E925E5", //prod
};

const baseQuery = axios.create({
  baseURL: "https://robotapitest.dostavista.ru/api/business/1.2",
  headers,
});

export default baseQuery;

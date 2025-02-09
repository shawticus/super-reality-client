import Axios from "axios";
import handleSupportCategoriesGet from "../../../../api/handleSupportCategoriesGet";
import { ApiError } from "../../../../api/types";
import {
  IDataGet,
  ICategoriesGet,
} from "../../../../api/types/support-ticket/supportTicket";
import { API_URL } from "../../../../constants";

export default function getCategories(limit?: number): Promise<IDataGet[]> {
  return new Promise((resolve, reject) => {
    Axios.get<ICategoriesGet | ApiError>(`${API_URL}category/`, {
      params: limit && { limit: limit },
    })
      .then(handleSupportCategoriesGet)
      .then(resolve)
      .catch(reject);
  });
}

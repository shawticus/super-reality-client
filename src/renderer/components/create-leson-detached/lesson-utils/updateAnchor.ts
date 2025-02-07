import Axios from "axios";
import _ from "lodash";
import handleAnchorUpdate from "../../../api/handleAnchorUpdate";
import { ApiError } from "../../../api/types";
import { IAnchor } from "../../../api/types/anchor/anchor";
import AnchorUpdate from "../../../api/types/anchor/update";
import { API_URL } from "../../../constants";

export default function updateAnchor(data: Partial<IAnchor>, id: string) {
  const newData = {
    ...data,
    anchor_id: id,
  };

  return Axios.put<AnchorUpdate | ApiError>(
    `${API_URL}anchor`,
    _.omit(newData, ["_id", "__v", "createdBy", "createdAt", "updatedAt"])
  )
    .then(handleAnchorUpdate)
    .catch((e) => {
      console.error(e);
      return undefined;
    });
}

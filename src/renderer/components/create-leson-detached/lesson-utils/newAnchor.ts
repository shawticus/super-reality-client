import Axios from "axios";
import handleAnchorCreate from "../../../api/handleAnchorCreate";
import { ApiError } from "../../../api/types";
import { IAnchor } from "../../../api/types/anchor/anchor";
import AnchorCreate from "../../../api/types/anchor/create";
import { API_URL } from "../../../constants";
import reduxAction from "../../../redux/reduxAction";
import store from "../../../redux/stores/renderer";
import updateStep from "./updateStep";

export default function newAnchor(
  payload: Partial<IAnchor>,
  step?: string
): Promise<IAnchor | undefined> {
  return Axios.post<AnchorCreate | ApiError>(`${API_URL}anchor/create`, payload)
    .then(handleAnchorCreate)
    .then((data) => {
      reduxAction(store.dispatch, {
        type: "CREATE_LESSON_V2_SETANCHOR",
        arg: { anchor: data, step },
      });
      if (step) {
        updateStep(
          { startWhen: [{ type: "Image Found", value: data._id }] },
          step
        );
      }
      return data;
    })
    .catch((e) => {
      console.error(e);
      return undefined;
    });
}

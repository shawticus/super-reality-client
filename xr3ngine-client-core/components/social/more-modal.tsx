import React from "react";
import { Modal } from "./Modal";
import { ModalStateHook} from "./ModalHook";
import Router from "next/router";
export function MoreModalItems() {
    const { modalData } = ModalStateHook();
    const data = modalData;
    return (<Modal>
      <button className="modal-box-item h-12 bg-white w-full text-14-bold text-red" onClick={() => console.log("test")}>
        Report Inappropriate
      </button>
      <button className="modal-box-item h-12 bg-white w-full text-14-bold text-red">
        Unfollow
      </button>
      <button className="modal-box-item h-12 bg-white w-full text-14-light" onClick={() => Router.push("/post/[pid]", `/post/${(data as any).pid}`)}>
        Go to Post
      </button>
      <button className="modal-box-item h-12 bg-white w-full text-14-light">
        Share
      </button>
      <button className="modal-box-item h-12 bg-white w-full text-14-light">
        Copy Link
      </button>
      <button className="modal-box-item h-12 bg-white w-full text-14-light">
        Embed
      </button>
      <button className="modal-box-item h-12 bg-white w-full text-14-light">
        Cancel
      </button>
    </Modal>);
}

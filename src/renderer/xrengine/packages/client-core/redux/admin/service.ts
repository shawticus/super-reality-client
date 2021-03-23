import { Dispatch } from "redux";
import axios from "axios";
import {
  VideoCreationForm,
  VideoUpdateForm,
  videoCreated,
  videoUpdated,
  videoDeleted,
  locationTypesRetrieved,
  instancesRetrievedAction,
  instanceRemovedAction,
} from "./actions";
import {
  locationCreated,
  locationPatched,
  locationRemoved,
  locationsRetrieved,
} from "../location/actions";
import { loadedUsers } from "../user/actions";
import client from "../feathers";
import {
  PublicVideo,
  videosFetchedError,
  videosFetchedSuccess,
} from "../video/actions";
import { apiUrl } from "../service.common";
import { dispatchAlertError, dispatchAlertSuccess } from "../alert/service";
import { collectionsFetched } from "../scenes/actions";
import store from "../../../../../redux/stores/renderer";

export function createVideo(data: VideoCreationForm) {
  return async (dispatch: Dispatch, getState: any) => {
    const token = getState().get("auth").get("authUser").accessToken;
    try {
      const res = await axios.post(`${apiUrl}/video`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = res.data;
      dispatchAlertSuccess(dispatch, "Video uploaded");
      dispatch(videoCreated(result));
    } catch (err) {
      console.log(err);
      dispatchAlertError(
        dispatch,
        `Video upload error: ${err.response.data.message}`
      );
    }
  };
}

export function updateVideo(data: VideoUpdateForm) {
  return (dispatch: Dispatch): any => {
    client
      .service("static-resource")
      .patch(data.id, data)
      .then((updatedVideo) => {
        dispatchAlertSuccess(dispatch, "Video updated");
        dispatch(videoUpdated(updatedVideo));
      });
  };
}

export function deleteVideo(id: string) {
  return (dispatch: Dispatch): any => {
    client
      .service("static-resource")
      .remove(id)
      .then((removedVideo) => {
        dispatchAlertSuccess(dispatch, "Video deleted");
        dispatch(videoDeleted(removedVideo));
      });
  };
}

export function fetchAdminVideos() {
  return (dispatch: Dispatch): any => {
    client
      .service("static-resource")
      .find({
        query: {
          $limit: 100,
          mimeType: "application/dash+xml",
        },
      })
      .then((res: any) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const video of res.data) {
          video.metadata = JSON.parse(video.metadata);
        }
        const videos = res.data as PublicVideo[];
        return dispatch(videosFetchedSuccess(videos));
      })
      .catch(() => dispatch(videosFetchedError("Failed to fetch videos")));
  };
}

export function fetchAdminLocations() {
  return async (dispatch: Dispatch, getState: any): Promise<any> => {
    const locations = await client.service("location").find({
      query: {
        $sort: {
          name: 1,
        },
        $skip: getState().get("admin").get("locations").get("skip"),
        $limit: getState().get("admin").get("locations").get("limit"),
        adminnedLocations: true,
      },
    });
    dispatch(locationsRetrieved(locations));
  };
}

export function fetchUsersAsAdmin(offset: string) {
  return async (dispatch: Dispatch, getState: any): Promise<any> => {
    const user = getState().get("auth").get("user");
    const skip = getState().get("admin").get("users").get("skip");
    const limit = getState().get("admin").get("users").get("limit");
    if (user.userRole === "admin") {
      const users = await client.service("user").find({
        query: {
          $sort: {
            name: 1,
          },
          $skip:
            // eslint-disable-next-line no-nested-ternary
            offset === "decrement"
              ? skip - limit
              : offset === "increment"
              ? skip + limit
              : skip,
          $limit: limit,
          action: "admin",
        },
      });
      dispatch(loadedUsers(users));
    }
  };
}

export function fetchAdminInstances() {
  return async (dispatch: Dispatch, getState: any): Promise<any> => {
    const user = getState().get("auth").get("user");
    if (user.userRole === "admin") {
      const instances = await client.service("instance").find({
        $sort: {
          createdAt: -1,
        },
        $skip: getState().get("admin").get("users").get("skip"),
        $limit: getState().get("admin").get("users").get("limit"),
        action: "admin",
      });
      dispatch(instancesRetrievedAction(instances));
    }
  };
}

export function createLocation(location: any) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      const result = await client.service("location").create(location);
      dispatch(locationCreated(result));
    } catch (err) {
      dispatchAlertError(dispatch, err.message);
    }
  };
}

export function patchLocation(id: string, location: any) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      const result = await client.service("location").patch(id, location);
      dispatch(locationPatched(result));
    } catch (err) {
      console.log(err);
      dispatchAlertError(dispatch, err.message);
    }
  };
}

export function removeLocation(id: string) {
  return async (dispatch: Dispatch): Promise<any> => {
    const result = await client.service("location").remove(id);
    dispatch(locationRemoved(result));
  };
}

export function fetchAdminScenes() {
  return async (dispatch: Dispatch): Promise<any> => {
    const scenes = await client.service("collection").find({
      query: {
        $limit: 100,
        $sort: {
          name: -1,
        },
      },
    });
    dispatch(collectionsFetched(scenes));
  };
}

export function fetchLocationTypes() {
  return async (dispatch: Dispatch): Promise<any> => {
    const locationTypes = await client.service("location-type").find();
    dispatch(locationTypesRetrieved(locationTypes));
  };
}

client.service("instance").on("removed", (params) => {
  store.dispatch(instanceRemovedAction(params.instance));
});

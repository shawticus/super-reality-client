import { Dispatch } from 'redux';
import { dispatchAlertError } from "../alert/service";
import { client } from '../feathers';
import {
  fetchingCurrentLocation,
  locationsRetrieved,
  locationRetrieved,
  locationBanCreated,
  locationNotFound
} from './actions';

export function getLocations(skip?: number, limit?: number) {
  return async (dispatch: Dispatch, getState: any): Promise<any> => {
    try {
      const locationResults = await client.service('location').find({
        query: {
          $limit: limit != null ? limit : getState().get('locations').get('limit'),
          $skip: skip != null ? skip : getState().get('locations').get('skip'),
          joinableLocations: true
        }
      });
      dispatch(locationsRetrieved(locationResults));
    } catch(err) {
      console.log(err);
      dispatchAlertError(dispatch, err.message);
    }
  };
}

export function getLocation(locationId: string) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      dispatch(fetchingCurrentLocation());
      const location = await client.service('location').get(locationId);
      dispatch(locationRetrieved(location));
    } catch(err) {
      console.log(err);
      dispatchAlertError(dispatch, err.message);
    }
  };
}

export function getLocationByName(locationName: string) {
  return async (dispatch: Dispatch): Promise<any> => {
      const locationResult = await client.service('location').find({
        query: {
          slugifiedName: locationName,
          joinableLocations: true
        }
      }).catch(error => {
        console.log("Couldn't get location by name", error);
      });
      if (locationResult && locationResult.total > 0) {
        dispatch(locationRetrieved(locationResult.data[0]));
      }else{
        dispatch(locationNotFound());
      }
  };
}

export function banUserFromLocation(userId: string, locationId: string) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      await client.service('location-ban').create({
        userId: userId,
        locationId: locationId
      });
      dispatch(locationBanCreated());
    } catch(err) {
      console.log(err);
      dispatchAlertError(dispatch, err.message);
    }
  };
}
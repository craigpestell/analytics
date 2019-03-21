// status constants
export const REQUEST = "request";
export const SUCCESS = "success";
export const FAILURE = "failure";

export const createAsyncAction = (type, promiseCreator) => {
  return () => (dispatch, getState) => {
    dispatch({ type, readyState: REQUEST });

    const promise = promiseCreator();
    return promise.then(
      data => {
        dispatch({ type, readyState: SUCCESS, data });
      },
      error => {
        dispatch({ type, readyState: FAILURE, error });
      }
    );
  };
};
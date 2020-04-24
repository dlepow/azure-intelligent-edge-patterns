import Axios from 'axios';
import {
  ProjectThunk,
  GetProjectSuccessAction,
  GET_PROJECT_SUCCESS,
  Project,
  GetProjectFailedAction,
  GET_PROJECT_FAILED,
  PostProjectSuccessAction,
  POST_PROJECT_SUCCESS,
  POST_PROJECT_FALIED,
  PostProjectFaliedAction,
} from './projectTypes';

const getProjectSuccess = (project: Project): GetProjectSuccessAction => ({
  type: GET_PROJECT_SUCCESS,
  payload: { project },
});

const getProjectFailed = (): GetProjectFailedAction => ({ type: GET_PROJECT_FAILED });

const postProjectSuccess = (): PostProjectSuccessAction => ({ type: POST_PROJECT_SUCCESS });

const postProjectFail = (): PostProjectFaliedAction => ({ type: POST_PROJECT_FALIED });

export const thunkGetProject = (): ProjectThunk => (dispatch): Promise<void> => {
  return Axios.get('/api/projects/')
    .then(({ data }) => {
      const project: Project = {
        id: data[0]?.id || null,
        camera: data[0]?.camera || null,
        location: data[0]?.location || null,
        parts: data[0]?.parts || [],
        modelUrl: data[0]?.training_uri || '',
      };
      dispatch(getProjectSuccess(project));
      return void 0;
    })
    .catch((err) => {
      console.error(err);
      dispatch(getProjectFailed());
    });
};

export const thunkPostProject = (
  projectId,
  selectedLocations,
  selectedParts,
  selectedCamera,
): ProjectThunk => (dispatch): Promise<void> => {
  const isProjectEmpty = projectId === null;
  const url = isProjectEmpty ? `/api/projects/` : `/api/projects/${projectId}/`;

  return Axios(url, {
    data: {
      location: `http://localhost:8000/api/locations/${selectedLocations.id}/`,
      parts: selectedParts.map((e) => `http://localhost:8000/api/parts/${e.id}/`),
      camera: `http://localhost:8000/api/cameras/${selectedCamera.id}/`,
      download_uri: '',
    },
    method: isProjectEmpty ? 'POST' : 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(() => {
      return dispatch(postProjectSuccess());
    })
    .catch((err) => {
      dispatch(postProjectFail());
      console.error(err);
    }) as Promise<void>;
};

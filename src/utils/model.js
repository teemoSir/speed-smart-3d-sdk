import { post, get } from "./request2";

function modelQuery(params) {
  return post(`/model/query`, params);
}

function modelEdit(params) {
  return post(`/model/edit`, params);
}

export { modelQuery, modelEdit };

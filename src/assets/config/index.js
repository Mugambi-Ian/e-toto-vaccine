import * as firebase from "firebase";
import { firebaseConfig } from "./config";
firebase.initializeApp(firebaseConfig);
export const _firebase = firebase;
export const _auth = firebase.auth();
export const _storage = firebase.storage();
export const _database = firebase.database();

export const getAge = (birthDate) => {
  const bd = birthDate.split("-");
  var _b = new Date();
  _b.setFullYear(bd[0], bd[1] - 1, bd[2]);
  var _t = new Date();
  var _Time = _t.getTime() - _b.getTime();
  const r = Math.round(_Time / (1000 * 3600 * 24));
  return r < 0 ? 0 : r;
};

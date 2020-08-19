import { useEffect, useState, useReducer, useRef } from "react";
import axios from "axios";
import convertToDate from "./convertToDate";
import * as moment from "moment";
import { message } from "antd";

// React hook to use a query
// const [{results, error, loading}, refresh, clear] = useJsqel('private_hello', { sendItNow:true, filter : filter })
// refresh can be used like this :
// refresh()                    -> send the query with the same parameters
// refresh( {filter:'F%'} )     -> send the query with updated parameters
// refresh({ sendItNow:true, filter : filter }) --> send the query if sendItNow was initially false
// clear : set results to null

const api_url = process.env.NODE_ENV === "production" ? "http://localhost/api/" : "http://localhost:5000/";

const setToken = (token) => {
  window.localStorage.setItem("jsqel_token", token);
};

const removeToken = () => {
  if (window.localStorage.getItem("jsqel_token")) window.localStorage.removeItem("jsqel_token");
};

// Build the most usefull message
const meaningFullErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.detail) return error.response.data.detail;
  if (error.response && error.response.data && typeof error.response.data === "string") return error.response.data;
  return error.message;
};

const jsqelReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: null, results: action.payload, key: action.key };
    case "FETCH_SUCCESS_FROM_CACHE":
      console.log("-- Using cache results -- key:", state.key);
      return { ...state, loading: false, error: null };
    case "FETCH_CACHE":
      return { ...state, key: action.payload };
    case "FETCH_FAILURE":
      return { ...state, loading: false, error: meaningFullErrorMessage(action.payload), key: "" };
    case "CLEAR":
      return { ...state, loading: false, error: null, results: null };
    default:
      return state;
  }
};

const create_UUID = () => {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

const makeKey = (query, props) => {
  // Se substitue à la méthode toJSON() opar défaut qui renvoie une date au format "2020-05-10T13:58:59.847Z"
  moment.fn.toJSON = function () {
    return this.format("YYYY-MM-DD");
  };
  return JSON.stringify({ query, props });
};

const useJsqel = (query, props = {}, initialResults = []) => {
  const [key, setKey] = useState(makeKey(query, props));
  const [cacheKey, setCacheKey] = useState("initial");

  var callback = useRef(props && props.callback);

  // Update key when props or query changed
  useEffect(() => {
    if (makeKey(query, props) !== key) {
      setKey(makeKey(query, props));
    }
  }, [query, props]);

  // Update key when refresh
  const refresh = (newParams = {}) => {
    const { props } = JSON.parse(key);
    const newProps = Object.assign({}, props, newParams, { sendItNow: true });
    if (makeKey(query, newProps) !== key) {
      setKey(makeKey(query, newProps));
    } else {
      setCacheKey(create_UUID());
    }
    if (newParams.callback) {
      callback.current = newParams.callback;
    }
  };

  const [state, dispatch] = useReducer(jsqelReducer, {
    loading: false,
    error: null,
    results: initialResults,
    key: "",
  });

  const keyInCache = state.key === key;

  const clear = () => dispatch({ type: "CLEAR" });

  // Update api parameters if key has changed
  useEffect(() => {
    const { query, props } = JSON.parse(key);
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      // Something in cache ?
      if (props && props.cached && keyInCache) {
        dispatch({ type: "FETCH_SUCCESS_FROM_CACHE" });
      } else {
        try {
          // Add token if any
          const token = window.localStorage.getItem("jsqel_token");

          const result = await axios.post(
            api_url + query,
            props,
            token ? { headers: { Authorization: `Bearer ${token}` } } : {}
          );

          // Convert dates to momentJS object
          const convertedToDateResults = Array.isArray(result.data)
            ? result.data.map((r) => convertToDate(r))
            : convertToDate(result.data);

          dispatch({ type: "FETCH_SUCCESS", payload: convertedToDateResults, key });
          props && props.cached && dispatch({ type: "FETCH_CACHE", payload: key });

          callback.current && callback.current({ error: null, results: convertedToDateResults });
        } catch (error) {
          dispatch({ type: "FETCH_FAILURE", payload: error });
          callback.current && callback.current({ error: meaningFullErrorMessage(error), results: null });
          if (error.response && error.response.status === 401) {
            if (!query.includes("login")) {
              message.error("Unauthorized");
            }
          }
        }
      }
    };

    if (props && props.sendItNow) fetchData();
  }, [key, cacheKey]);

  return [state, refresh, clear];
};

export { useJsqel, setToken, removeToken };

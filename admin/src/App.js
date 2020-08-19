import React from "react";
import { fetchUtils, Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from "react-admin";
import jsqelProvider from "./provider/jsqelProvider";
import authProvider from "./provider/authProvider";

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  const token = localStorage.getItem("jsqel_token");
  options.headers.set("Authorization", `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};

const api_url = process.env.NODE_ENV === "production" ? "http://localhost/api/" : "http://localhost:5000/";
console.log("Using API url :", api_url);

function App() {
  return (
    <div className="App">
      <Admin
        authProvider={authProvider(api_url + "auth/login")}
        dataProvider={jsqelProvider(api_url + "admin", httpClient)}
      >
        <Resource name="opportunities" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
        <Resource name="leads" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
      </Admin>
    </div>
  );
}

export default App;

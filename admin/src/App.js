import React from 'react';
import { fetchUtils, Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, List, Datagrid, TextField, ReferenceField, Create, SimpleForm, TextInput} from 'react-admin';
import jsqelProvider from './provider/jsqelProvider'
import authProvider from './provider/authProvider';

const httpClient = (url, options = {}) => {
  if (!options.headers) {
      options.headers = new Headers({ Accept: 'application/json' });
  }
  const token = localStorage.getItem('jsqel_token');
  options.headers.set('Authorization', `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
}

const UserList = props => (
  <List {...props}>
      <Datagrid rowClick="edit">
          <TextField source="id" />
          <TextField source="username" />
          <ReferenceField source="role_id" reference="roles"><TextField source="name" /></ReferenceField>
      </Datagrid>
  </List>
)

const HelloList = props => (
  <List {...props}>
      <Datagrid rowClick="edit">
          <TextField source="id" />
          <TextField source="message" />
      </Datagrid>
  </List>
)

const HelloCreate = props => (
  <Create {...props}>
      <SimpleForm>
          <TextInput source="message" />
      </SimpleForm>
  </Create>
)

const api_url = process.env.NODE_ENV === 'production' ? 'http://localhost/api/' : 'http://localhost:5000/'
console.log("Using API url :", api_url)

function App() {
  return (
    <div className="App">
      <Admin authProvider={authProvider(api_url+'auth/login')} dataProvider={jsqelProvider(api_url+'admin', httpClient)}>
        <Resource name="hello" list={HelloList} edit={EditGuesser} show={ShowGuesser} create={HelloCreate} />
        <Resource name="users" list={UserList} edit={EditGuesser} show={ShowGuesser} />
        <Resource name="roles" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
    </Admin>
    </div>
  );
}

export default App;

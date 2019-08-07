import React from 'react';
import { fetchUtils, Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, List, Datagrid, TextField, ReferenceField, Create, SimpleForm, TextInput, ReferenceInput, SelectInput } from 'react-admin';
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
          <ReferenceField source="user_id" reference="users"><TextField source="username" /></ReferenceField>
      </Datagrid>
  </List>
)

const HelloCreate = props => (
  <Create {...props}>
      <SimpleForm>
          <TextInput source="message" />
          <ReferenceInput label="User" source="user_id" reference="users">
              <SelectInput optionText="username" />
          </ReferenceInput>
      </SimpleForm>
  </Create>
)

function App() {
  return (
    <div className="App">
      <Admin authProvider={authProvider('http://localhost:5000/login')} dataProvider={jsqelProvider('http://localhost:5000', httpClient)}>
        <Resource name="hello" list={HelloList} edit={EditGuesser} show={ShowGuesser} create={HelloCreate} />
        <Resource name="users" list={UserList} edit={EditGuesser} show={ShowGuesser} />
        <Resource name="roles" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
    </Admin>
    </div>
  );
}

export default App;

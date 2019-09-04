# Jsqel boilerplate

## Installation

Clone the repo :
```
git clone https://github.com/Herve07h22/jsqel_boilerplate.git my_project
```

You have a ready-to-use fullstack application, including :
- In the `backend` directory : an API server made with jsqel
- In the `frontend` directory : a simple React Application, designed with [Ant Design](https://ant.design)
- In the `admin` directory : another React Application designed with [react-admin](https://marmelab.com/react-admin/), which lets you do CRUD operations on the data.

## Run the application

### Just to see what it looks like

For testing purpose, the boilerplate can connect to a local SQLite3 database instead of the recommended Postgresql engine.

After cloning the repo, let's import required node modules, start the backend and the 2 front-ends :
```
cd my_project
cd backend && yarn && node index.js
cd frontend && yarn && yarn start
cd admin && yarn && yarn start
```
You should get something like this :

**Front-end demo app**

![Front-end screenshot](doc/frontend-screenshot.png?raw=true "Front-end")

**Admin demo app**

![Admin screenshot](doc/admin-screenshot.png?raw=true "Admin")


### Install with Docker
The easiest way is to run it with Docker.
```
docker-compose up -- build
```

This will create 3 Docker images : 
- db : running a postgresql instance, 
- jsqel_nodejs : Node / express / Jsqel 
- and jsqel_nginx : to serve the 2 react apps.

After the build stage, the application is available in your browser at http://localhost:80 and http://localhost:80/admin.

I first suggest to register a new Admin user and some Member users to play with the sample UI.

### Devlopment mode

In a terminal, start the backend
```
docker run --rm  --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 postgres
cd backend
node index.js
```

In another terminal, start the React App :
```
cd frontend
yarn
yarn start
```

In a 3d terminal, start the Admin App :
```
cd admin
yarn
yarn start
```

# React hooks to speed up your dev

If you like at the `WrappedUserLoginForm.js` file, you find theses 2 JS lines :

```
const {dispatch, state} = useStore()
const [{results, error, loading}, refresh, clear] = useJsqel('auth/login', { sendItNow:false, username : '', password:''})
```

`useStore()` is a way to replace a Redux store by a simpler code available in `store.js`.

`useJsqel(endpoint, options)` is a custom hook that connects a React component to the back-end :
- `endpoint` : a valid namespace/endpoint registered in the backend
- `options` :
    - `sendItNow` : boolean that indicates if the API must be called immediately
    - `callback` : a function to call just after the return of the query
    - anything else : parameters sent to the query

`useJsqel` returns an array containing :
- A result object `{results, error, loading}`. `results` is an array, `error` is an object with a `message` attribute, and `loading`is a boolean set to `true` while the query is running.
- `refresh({})` is a function that lets you send the query again, with optionnal new paremeters
- `clear()` is a function that clears the results

See `api/jsqel.js` to see how it is implemented.


     
    




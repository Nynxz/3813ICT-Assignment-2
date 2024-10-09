# Requirements

> ## Information
> - **Name**: Henry Lee
> - **Student Number**: s5238766
> - **Class**: 3813ICT - Web Application Development
> - **Due Date**: 10/10/2024 @ 8:00am

> ## README Requirements
> - [**Git**](#git): Describe the organization of your Git repository and how you used it during the
    > development of your solution (branching, update frequency, server/frontend etc.)
> - [**Data Structures**](#data-structures): Description of data structures used in both the client and server sides to represent the
    > various entities, e.g.: users, groups, channels, etc.
> - [**Angular**](#angular-architecture): Angular architecture: components, services, models, routes.
> - [**Express**](#express): Node server architecture: modules, functions, files, global variables.
> - [**Routes**](#routes): A list of server side routes, parameters, return values, and there purpose
> - [**Interaction**](#interaction): Describe the details of the interaction between client and server by indicating how the
    > data on server side will be changed and how the display of each angular component
    > page will be updated.

## Overview

> ### Key Dependencies
> #### [Frontend](https://github.com/Nynxz/3813ict-assignment-1/tree/main/frontend)
> - Using [Angular Version 18](https://angular.dev/overview)
> - Using [TailwindCSS](https://tailwindcss.com/docs/guides/angular)
> - Using [jwt-decode](https://www.npmjs.com/package/jwt-decode)
> - Using [PeerJS](https://www.npmjs.com/package/peerjs)
> - Using [socket-io](https://www.npmjs.com/package/socket.io)
> -
> #### [Backend](https://github.com/Nynxz/3813ict-assignment-1/tree/main/backend)
> - Using [Express](https://expressjs.com/)
> - Using [MongoDB](https://www.mongodb.com/)
> - Using [Mongoose](https://mongoosejs.com/)
> - Using [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
> - Using [multer](https://www.npmjs.com/package/multer)

## Git

I had initially created my assignment 1 in a separate repository. Due to the change in requirements, 
I decided to recreate my assignment 1, 
pulling 'what worked' and leaving what didnt. While trying to clean up my code overall. 

Both the Angular Frontend and the Express Backend are contained within a single repository

- https://github.com/Nynxz/3813ict-assignment-2

I will be using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)  and also try my best to conform to [Angulars Commit Message Guidelines (Types)](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#type).

- **Types**
  - `feat` Commits, that adds or remove a new feature
  - `fix` Commits, that fixes a bug
  - `refactor` Commits, that rewrite/restructure your code, however does not change any API behaviour
  - `perf` Commits are special refactor commits, that improve performance
  - `style` Commits, that do not affect the meaning (white-space, formatting, missing semi-colons, etc)
  - `test` Commits, that add missing tests or correcting existing tests
  - `docs` Commits, that affect documentation only
  - `build` Commits, that affect build components like build tool, ci pipeline, dependencies, project version, ...
  - `ops` Commits, that affect operational components like infrastructure, deployment, backup, recovery, ...
  - `chore` Miscellaneous commits e.g. modifying .gitignore
- seperated via `(backend)` vs `(frontend)` tags
- eg: `feat(frontend): add user page and route` or `docs(backend):add comments to /login route`

## Data Structures

#### **Role**

- `Enum (USER, ADMIN, SUPER)`

#### **User**

Represents a user of the application.

- Currently `password` is stored in plaintext
- `roles` are stored as integers (0, 1, 2 > USER, ADMIN, SUPER)

```
- _id: uuid | Unique
- username: string | Unique
- email: string
- password: string
- imageURL: string
- roles: Role[]*
- groups: Group[]*
```

#### **Group**

Represents a group of the application.

- `users` are those who have access to communicate in the group's channels
- `admins` are those who have access to create new channels, modify existing channels and add/remove users from the group

```
- _id: uuid | Unique
- name: string
- imageURL: string
- channels: Channel[]*
- admins: User[]*
```

#### **Channel**

Represents a channel belonging to a group. Created by an ADMIN or SUPER user

```
- _id: uuid | Unique
- name: string
- group: Group*
- users: User[]*
```

#### **Message**

Represents a message sent in a channel, from a user.

```
- _id: uuid | Unique
- content: string
- channel: Channel*
- images: string[]
- sender: User*
```

## Angular Architecture

### Routes

- **Home** `/`
  - Welcome Page - Non Functional
- **Login** `/login`
  - Displays the Login and Register Form
  - Successful login routes to /user
- **Profile** `/profile`
  - Displays 'dashboards' based on roles
  - User Dashboard
    - Update profile picture
  - Super Dashboard
    - Promote Users
    - Remove Users
  - Request to join new groups
  - Accept/Deny requests to join a group
  - Create Groups
  - Update Groups
  - Delete Groups
- **Group** `/group`
  - Displays a selectable 'channel sidebar'
  - When a channel is selected it displays the Chat
  - Sidebar has a button for displaying group settings
  - Allows admins to create, update & delete channels
  - Chat to other users
  - Call other users

- All routes will contain the sidebar, this is used for navigating through the site. Routes are managed through the [`<router-outlet>`](https://angular.dev/api/router/RouterOutlet?tab=api) component and displayed in the main portion of the screen

### Services

- **Preferences Service**
  - Used for storing persistent state (cookies)
  - Currently used for retrieving jwt and whether sidebar is folded
- **User Service**
  - Used for logging in/registering
  - Manages JWT, auto logging in
  - Communicates with the backend to verify credentials and save JWT
- **Group Service**
  - Used for creating/updating groups & channels

- **Chat Service**
  - Used for managing the chat
  - manages the socket-io and peerjs connection
  - Sending/deleting messages


### Components

- Sidebar
  - Allow the user to view all Groups they have joined
  - Allow the user to see if they are logged in
  - Allow the user to navigate between user settings (Super/Admin Panel) and chats

### Guards

- IsLoggedIn
  - Blocks routing unless the user is logged in
  - Redirects to `/`
  - Used On `/chat`
- isloggedinGuardRedirectTo
  - Same as IsLoggedIn but allows customisable redirects
  - Used on `/user` to redirect to `/login`

## Express

I have created a simple 'framework' for managing my backend routes which uses express.

### Concept

#### Core `Gateway` class

- Setups Express and global middleware
- Connects mongoose to MongoDB instance
- Automatically loads `routes` directory

#### `registerHTTP` wrapper

- assigns callbacks to router methods (get, post)
- handles middleware chain
- runs 'endware' at the end of the request
  - Currently logs the request and whether it was successful
  - eg `[DEBUG]: 200 POST /channel/messages     @ Wed Sep 04 2024 4:58:14 am`

Route files are placed in the directory `routes`.
These files export a default anonymous function which calls the `registerHTTP` wrapper functions.
The `registerHTTP` function wraps the different express methods (get, post, etc).
It also takes in an array of optional middleware which can be assigned to each route

#### Example

```js
export default (router: Router, gateway: Gateway) => {
  registerHTTP(
    "get",
    "/hello",
    router,
    async (req: Request, res: Response) => {
      res.send(`Hello ${req.body.name}`);
    },
    [requireBodyKey("name")]
  );
};
```

```
> curl localhost:3010/hello
{"error":"Cannot find name"}

> curl --header "Content-Type: application/json" --request GET --data '{"name": "Henry"}' localhost:3010/hello 
Hello Henry
```

### Examples of Middleware

- **requireAuthHeader**
  - requires the request header contains an `Authorization Bearer Token`
  - `Authorization: Bearer <JWT TOKEN>`
  - Attaches decoded jwt to `res.locals.user`
- **requireBodyKey**
  - requires the request body contains a specified key
- **requireObjectHasKeys**
  - requires the request body contains an object with a specified name
  - and that the object, has all the specified keys
- **requireValidRole**
  - requires the request contains JSON key 'jwt' which has been encoded with a secret, and contains the required Role (ADMIN, SUPER, USER)
    Currently these middlewares can be used together to validate request bodies and authorize users

#### **Example**

```ts
[
  requireValidRole(Roles.USER),
  requireObjectHasKeys("message", ["content", "channel"]),
]
  ```

A request which contains above, must receive a payload like below.

```json
"headers": {
"Authorization": "Bearer <JWT which contains the role USER>",
},
"body": {
"message": {
"content": "",
"channel": ""
}
}
```

## Routes

```
[gateway]: ----channels.ts----
[gateway]: ++ (GET) /api/v1/channel/messages
[gateway]: ++ (GET) /api/v1/channel/users
[gateway]: ++ (POST) /api/v1/channel/adduser
[gateway]: ++ (POST) /api/v1/channel/removeuser
[gateway]: ++ (POST) /api/v1/channel/create
[gateway]: ++ (POST) /api/v1/channel/delete
[gateway]: ++ (POST) /api/v1/channel/update
[gateway]: ----content.ts----
[gateway]: ++ (GET) /api/v1/content/images
[gateway]: ----group.ts----
[gateway]: ++ (GET) /api/v1/groups
[gateway]: ++ (GET) /api/v1/groups/all
[gateway]: ++ (GET) /api/v1/groups/channels
[gateway]: ++ (GET) /api/v1/groups/info
[gateway]: ++ (GET) /api/v1/groups/users
[gateway]: ++ (POST) /api/v1/groups/create
[gateway]: ++ (POST) /api/v1/groups/request
[gateway]: ++ (POST) /api/v1/groups/request/respond
[gateway]: ++ (POST) /api/v1/groups/request/cancel
[gateway]: ++ (POST) /api/v1/groups/delete
[gateway]: ++ (POST) /api/v1/groups/update
[gateway]: ++ (POST) /api/v1/groups/adduser
[gateway]: ++ (POST) /api/v1/groups/removeuser
[gateway]: ++ (POST) /api/v1/groups/promoteuser
[gateway]: ----messages.ts----
[gateway]: ++ (POST) /api/v1/message/send
[gateway]: ----superuser.ts----
[gateway]: ++ (POST) /api/v1/super/updateuser
[gateway]: ++ (POST) /api/v1/super/deleteuser
[gateway]: ----test.ts----
[gateway]: ++ (GET) /api/v1/
[gateway]: ++ (POST) /api/v1/ping
[gateway]: ++ (GET) /api/v1/hello
[gateway]: ----user.ts----
[gateway]: ++ (GET) /api/v1/users/all
[gateway]: ++ (POST) /api/v1/user/register
[gateway]: ++ (POST) /api/v1/user/login
[gateway]: ++ (POST) /api/v1/user/refresh
[gateway]: ++ (POST) /api/v1/user/update
[gateway]: ++ (POST) /api/v1/user/updateprofilepicture

 ```

### **Implemented**

#### Users

- `(GET) /users/all`
  - `requireValidRole(Roles.SUPER)`
  - Gets all users of the app
  - Returns array of all users
- `(POST) /user/register`
  - `requireObjectHasKeys("user", ["username", "email", "password"])`
  - User Registration
  - Returns JWT
 - `(POST) /user/login`
   - Logs in the user, returning a JWT 
 - `(POST) /user/refresh`
   - Refreshs the users JWT
 - `(POST) /user/update`
   - Updates the user information
 - `(POST) /user/updateprofilepicture`
   - Uploads and sets new profile picture for the user, deleting old one the disk


#### Groups

- `(GET) /groups`
  - `requireValidRole(Roles.USER)`
  - Gets Groups for specific user
  - If SUPER role, gets all groups of app
  - If not, gets all groups user is ADMIN / USER of
  - Returns array of Groups
- `(GET) /groups/all`
  - returns all the groups
- `(GET) /groups/channels`
  - returns all the channels of a group
- `(GET) /groups/info`
  - returns information about a group
- `(GET) /groups/users`
  - Gets all the users of a specific group
  - TODO: add validation (user of group, admin or super)
- `(POST) /groups/create`
  - `requireValidRole(Roles.ADMIN)`
  - Creates a new group if user is an ADMIN
- `(POST) /groups/request`
  - creates a request to join a group  
- `(POST) /groups/request/respond`
  - responds to a request to join a group 
- `(POST) /groups/request/cancel`
  - cancels a request to join a group 
- `(POST) /groups/delete`
  - deletes a group
- `(POST) /groups/update`
  - `requireValidRole(Roles.SUPER)`
  - TODO: allow admins to update
  - TODO: validate request body
  - Updates a group
- `(POST) /groups/adduser`
  - adds a user to the group
- `(POST) /groups/removeuser`
  - remove a user from a group
- `(POST) /groups/promoteuser`
  - promote a user in a group
#### Messages

- `(POST) /message/send`
  - `requireValidRole(Roles.USER)`,
  - `requireObjectHasKeys("message", ["content", "channel"])`
  - Sends a message to a channel

#### Channels

- `(GET) /channel/messages`
  - Gets all messages of a specific channel
- `(GET) /channel/users`
  - Gets all users of a specific channel
- `(POST) /channel/adduser`
  - Adds a user to a channel
- `(POST) /channel/removeuser`
  - Removes a user from a channel
- `(POST) /channel/create`
  - `requireValidRole(Roles.ADMIN)`
  - Creates a new channel
- `(POST) /channel/delete`
  - `requireValidRole(Roles.ADMIN)`
  - Deletes an existing channel
- `(POST) /channel/update`
  - `requireValidRole(Roles.ADMIN)`
  - Updates an existing channel

#### Content
- `(GET) /content/images/{imageID}`
  - Returns an image uploaded by a user

## Interaction

#### JSON Web Token

JWT's are used for authorization of backend routes. 
When the user logs in, the backend returns a JWT which is stored in the clients browser. 
This is then sent back to the server when the client makes requests which require authorization. 
The JWT is signed with a secret, this signature is then authenticated to verify the content of the JWT was originally created by the server. 
As JWT's are just base64 encoded objects, with a signature, they can be easily decoded 'without the password'. 
Due to this, it is not used to store sensitive information like passwords, but used as more of a 'ticket' to access backend routes. 
Currently it is used to store the users roles, which is then used by the requiredValidRoles() middleware.

#### PeerJS

PeerJS happens through the frontend almost entirely. A list of available 'peers' is given to the user, the user selects on a peer to 'call'
the 'receiving' peer is then notified and given the option to 'accept the call', if the call is accepted, both peers send eachother their "MediaStream".
And are able to video chat. 

#### Socket-IO

Socket-IO is used for 'chatting' - this includes text and images. This works as when the 'frontend' is loaded, the client connects to a backend socket.
Whenever the user, or another user 'sends a message' to the backend, the backend then notifies all connected sockets that a new message has been sent by emiting
a new message, this message contains the 'file names', 'content' and 'user information' of the sent message. When the receivers are notified of this new message. 
They add the message to an angular signal to update all components that require it.


#### Images
Images uploading is being handled through 'multer' for multipart forms. Upon the submission of a message, the backend uploads all the images to a directory.
These images are given unique names and attached to the 'message' through an array of strings. The frontend is responsible for turning the '12312312313' filename.
into a URL such as `http://localhost:3002/uploads/12312312313` which will serve the image.

####  Database
I am using MongoDB and Mongoose. I have created 'Models' for my different document types (User, Message, Group, Channel, etc). This gives me a 'type safe' way of handling my mongodb database.


#### Client <> Server

- Frontend contains various services to organise different client to server functions
- Services contain state, typically as a [Signal](https://angular.dev/guide/signals)
- Signals allow for components to 'subscribe' to state changes and react
- This allows for a single source of truth components can use
- Services inject and use the [HttpClient](https://angular.dev/api/common/http/HttpClient) class to send requests to the backend.
- Components then inject these services where needed either to fetch the current state or allow updates to state through things like button presses or route changes.

#### Backend <> Database

- MongoDB is used to store the applications data
- The backend uses MongooseJS to interact with MongoDB

```js
// With Mongoose
let ChannelSchema = new Schema({...});
export const ChannelModel = mongoose.model("Channel", ChannelSchema);

export async function createChannel(channel: object) {
  return await new ChannelModel(channel).save();
}

// Without Mongoose
export async function createChannel(mongoClient: MongoClient, channel: object) {
  return await mongoClient.db("3813ICT")
    .collection("channels")
    .insertOne(channel);
}

```

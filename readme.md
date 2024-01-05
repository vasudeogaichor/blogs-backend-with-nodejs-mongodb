# Login and Registration Service

This Node.js project provides authentication and social media post functionalities. Users can register, log in, create posts, and interact with posts through comments and likes. The project uses a Docker-compose file to set up the database and can be started using the command `npm run start`.

## Getting Started
1. Clone the repository to your local machine:
    ```bash
    git clone https://github.com/vasudeogaichor/login-registration-service-nodejs
    cd login-registration-service-nodejs
    ```
2. Install the required dependencies:
    ```bash
    npm install
    ```
3. Start the database using docker-compose:
    ```bash
    docker-compose up -d
    ```
4. Create a .env file in the root directory with following keys:
    ```bash
    GMAIL_APP_PASSWORD={your_gmail_app_key}
    PORT=3002
    ```
    Kindly refer to [this](https://blog.logrocket.com/sending-emails-node-js-nodemailer/#:~:text=Nodemailer%20is%20an%20excellent%20tool,the%20users%20of%20your%20application.) link for getting your gmail app key.
5. Start the Node.js server:
    ```bash
    npm run start
    ```

## Endpoints
### Auth

#### Register
<li>Endpoint: `POST /auth/register`
<li>Request payload:

```bash
{
    "email": "testuser1@gmail.com",
    "username": "testuser1",
    "password": "testUser1*"
}
```

#### Login
<li>Endpoint: `POST /auth/login`
<li>Request payload:

```bash
{
    "username": "testuser1",
    "password": "testUser1*"
}
```

#### Forgot Password
<li>Endpoint: `POST /auth/forgot-password`
<li>Request payload:

```bash
{
    "email": "testuser1@gmail.com"
}
```

#### Reset Password
<li>Endpoint: `POST /auth/reset-password`
<li>Request payload:

```bash
{
    "email": "testuser1@gmail.com",
    "resetToken": "fdc1fbd866319b02979928dc1b5aef84962d5c1a",
    "newPassword": "newPass123@"
}
```

### Auth
#### Create a Post
<li>Endpoint: `POST /posts/`
<li> Request Headers:

 - `Authorization: Bearer <token>`
<li>Request Payload:

```bash
{
    "userId": "657ab44c14b9f2e0bd71a20e",
    "content": "Lorem Ipsum is simply dummy text..."
}
```
#### Get a Post
<li>Endpoint:` GET /posts/:post_id`
<li> Request Headers:

 - `Authorization: Bearer <token>`

#### Update a Post
<li>Endpoint: `PUT /posts/:post_id`
<li> Request Headers:

 - `Authorization: Bearer <token>`
<li>Request Payload:

```bash
{
    "content": "updated content................."
}
```
#### Delete a Post
<li>Endpoint: `DELETE /posts/:post_id`
<li> Request Headers:

 - `Authorization: Bearer <token>`

#### Add/Remove a Comment to a Post
<li>Endpoint: `POST /posts/:post_id/comments`
<li> Request Headers:

 - `Authorization: Bearer <token>`
<li>Request Payload:

```bash
{
    "action": "remove",
    "commentId": "657acd80f264647f26fd9fb9"
}
```

#### Add/Remove a Like to a Post
<li>Endpoint: `POST /posts/:post_id/likes`
<li> Request Headers:

 - `Authorization: Bearer <token>`
<li>Request Payload:

```bash
{
    "action": "add",
    "userId": "657ab44c14b9f2e0bd71a20e"
}
```

#### Get Posts with Filters
<li>Endpoint: GET /posts
<li> Request Headers:

 - `Authorization: Bearer <token>`
<li>Query Parameters:

- limit: int (default: 10)
- page: int (default: 1)
- query: str
- sortBy: str
- userId: str

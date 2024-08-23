_my goasl is not just create a fully functional API, but also to write it in a way that is easy to understand and maintain and to be more reusable and loss-coupled. so if you have any suggestions to improve my code quality please don't hesitate to issue or PR me_

# Authentication

1. [x] Sign up
2. [x] Login
3. [x] Guard Middleware
4. [x] Guest Middleware
5. [x] Protected Routes
6. [ ] Logout
7. [ ] Forgot Password
8. [ ] Reset Password

| Method | Endpoint          | Description         | DONE |
| ------ | ----------------- | ------------------- | ---- |
| POST   | /auth/sign-up     | Register a new user | YES  |
| POST   | /auth/sign-in     | Login a user        | YES  |
| POST   | /auth/google-auth | Login with Google   | YES  |
| GET    | /auth/profile     | Get user profile    | YES  |
| POST   | /blogs            | Create a new blog   | YES  |
| GET    | /blogs/latest     | Get latest blogs    | YES  |
| GET    | /blogs/trending   | Get trending blogs  | YES  |

# AWS S3 Setup

1. We created a new account and login to the AWS Management Console.
2. We choosed the S3 service.
3. We created a new bucket.
   1. We choosed a unique name for the bucket.
   2. We choosed the region.
   3. We diabled check of "Block all public access".
   4. We enabled check of message "Turning off block all public access might result in this bucket and the objects within becoming public
   5. We clicked on "Create bucket".
4. We created a policy for the bucket.
5. We alloed only two actions for the bucket.
   1. s3:PutObject
   2. s3:GetObject
6. We created a Policy JSON Document.
7. after that we created a CORS configuration for the bucket. (What is Domain can access the bucket)
8. created a new policy for the user.
9. We created a new user. (to get the access key and secret key)
10. attached the policy to the user.

## Feature/ Blog

1. [x] Create a new blog
2. [x] Upload a blog image
3. [x] Get all blogs
4. [x] Get a single blog
5. [x] Update a blog
6. [x] Delete a blog
7. [x] Implement Query Features (Filter, Search, Sort, Pagination, Limit, Fields)

## Today - CRUD Repository [13/8]

1. Basic CRUD Repository [DONE]
2. Add Query Features in read operation [DONE]

## Generic Validations [13/8]

1. Add route Validation middlewares for check 'id' is valid/exist or not [DONE]

## Update Blog [14/8]

1. Updating title will update the slug
2. add validation for update blog

## Like/Dislike Blog [20/8] - DONE

1. Like a blog
2. Dislike a blog

| Method | Endpoint           | Description    | DONE |
| ------ | ------------------ | -------------- | ---- |
| POST   | /blogs/like/:id    | Like a blog    | YES  |
| POST   | /blogs/dislike/:id | Dislike a blog | YES  |

## Comment Blog [20/8] - Working

1. Comment a blog
2. Get all comments of a blog
3. Update a comment
4. Delete a comment
5. Like/Dislike a comment
6. Reply to a comment
7. Get replies of a comment

| Method | Endpoint                              | Description       | DONE |
| ------ | ------------------------------------- | ----------------- | ---- |
| POST   | /comments/:blogId                     | Comment a blog    | YES  |
| GET    | /comments/:blogId                     | Get all comments  | YES  |
| PUT    | /comments/:blogId/comment/:id         | Update a comment  | NO   |
| DELETE | /comments/:blogId/comment/:id         | Delete a comment  | NO   |
| POST   | /comments/:blogId/comment/:id/like    | Like a comment    | NO   |
| POST   | /comments/:blogId/comment/:id/dislike | Dislike a comment | NO   |

##### TODO

1. Get Comments and Create has a huge bad code, need to be refactored
2. Get nested replies of a comment has intensive populate code, need to be refactored
3. Get comments should be returned as a paginated response as well as replies

##### WORKING

1. Response of Create Comment and Reply shouldn't be the whole list comments i think.

##### DONE

1. Get Comments with Pagination

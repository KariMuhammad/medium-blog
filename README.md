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
3. [] Get all blogs
4. [] Get a single blog
5. [] Update a blog
6. [] Delete a blog
7. [] Implement Query Features (Filter, Search, Sort, Pagination, Limit, Fields)

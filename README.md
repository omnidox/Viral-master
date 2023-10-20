# Viral

![Viral Logo Image](/client/public/logo192.png)

The **viral** social media platform.

# Viral Master Repository Overview

## Introduction
The Viral Master repository is a comprehensive codebase for a social media platform. This platform allows users to create posts, comment on them, bookmark them, and interact in various other ways. The backend is built using Node.js and Express, while the frontend is developed using React.

## Core Functionality
1. **User Authentication**: The repository provides routes and models for user registration, login, and profile management.
2. **Posts & Comments**: Users can create posts, comment on them, and vote on both posts and comments.
3. **Bookmarks**: Users can bookmark posts for later viewing.
4. **Notifications**: The platform supports notifications for various user activities.
5. **Admin Management**: There's a dedicated section for managing users.

## Relevant Files & Descriptions

- **Server Side**:
  - [index.js](https://github.com/omnidox/Viral-master/blob/master/server/index.js) - Main server entry point.
  - [auth.js](https://github.com/omnidox/Viral-master/blob/master/server/route/auth.js) - Routes for authentication.
  - [bookmarks.js](https://github.com/omnidox/Viral-master/blob/master/server/route/bookmarks.js) - Routes for bookmarks.
  - [comments.js](https://github.com/omnidox/Viral-master/blob/master/server/route/comments.js) - Routes for comments.
  - [post.js](https://github.com/omnidox/Viral-master/blob/master/server/route/post.js) - Routes for posts.
  - [users.js](https://github.com/omnidox/Viral-master/blob/master/server/route/users.js) - Routes for user management.
  - ... (and more server-side models and routes)

- **Client Side**:
  - [App.js](https://github.com/omnidox/Viral-master/blob/master/client/src/App.js) - Main React component.
  - [NavBar.jsx](https://github.com/omnidox/Viral-master/blob/master/client/src/component/ui/NavBar/NavBar.jsx) - Navigation bar component.
  - [Post.jsx](https://github.com/omnidox/Viral-master/blob/master/client/src/component/ui/Post/Post.jsx) - Component for displaying a post.
  - [Comment.jsx](https://github.com/omnidox/Viral-master/blob/master/client/src/component/ui/Comment/Comment.jsx) - Component for displaying a comment.
  - [LoginForm.jsx](https://github.com/omnidox/Viral-master/blob/master/client/src/component/form/LoginForm/LoginForm.jsx) - Login form component.
  - [SignupForm.jsx](https://github.com/omnidox/Viral-master/blob/master/client/src/component/form/SignupForm/SignupForm.jsx) - Signup form component.
  - ... (and more React components and views)
 
  - 
## Usage
### Dependency Installation:
In the [server](/server) and [client](/client) directory, run the following command: 
`npm install`
### Database Preparation:
> MySQL database recommended

- Required database name: `viral_db`
- Required all-access account: 
  - username: `viral_admin` 
  - password: `viral_password`

 ## Conclusion
The Viral Master repository is a feature-rich social media platform that offers a wide range of functionalities for user interaction and content sharing. 

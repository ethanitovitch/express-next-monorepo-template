This file outlines the structure of the repo and the patterns to follow.
This template is built with a monorepo structure. It has a simple frontend & backend but a shared repo for types & utilities.
Always split full stack requests into 3-4 tasks
1. (optional) create the schemas & migrate
2. create the request/response types in the shared/types folder
3. create the route in the backend folder
4. create the components in the frontend folder
Backend: use the route -> controller -> service -> repository/client/utils pattern. Never put database calls in the controller or service, always in repositories. Services should be short and broken down into multiple functions. controllers should not contain logic and should simply destructure requests and call services. Make sure you are typing the controller functions using the handler types
Frontend: Always break things down into components and use shadcn and the theme provided. Use server components as much as possible for performance. 
Never add dependencies to the package.json directly, always install dependencies using the package manager to make sure you have the most up to date version
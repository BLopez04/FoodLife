# FoodLife
An innovative new app that tracks dining plans and monthly budgets for money-conscious adults and college students.

Hosted @ https://ambitious-grass-040551c1e.4.azurestaticapps.net/ using "deploy" branch
View demo [here](https://drive.google.com/file/d/1tFxn92rgK3udP31iTwJZI5mNWu93-_eY/view?usp=sharing)
To get the Repo up and running on your own device:

1. Git clone the repository
2. In the root of the monorepo, run "npm install"
3. Create your .env in the packages/express-backend directory. Houses 2 environment variables
```
MONGO_CONNECTION_STRING=<Connection String>
TOKEN_SECRET=<Token secret of choice>
```
4. Change the API_PREFIX values in packages/react-frontend/src for Login, Signup, Table, and Overview to your own backend if the port differs (or to link up with deployment backend)
5. npm run dev in both packages/express-backend directory and packages/react-frontend

## Access Control Sequence Diagram
![access control sequence diagram](access-control.png)

## Class Diagram
![class diagram](class-diagram.png)

## Link To Docs
See docs [here](/docs)

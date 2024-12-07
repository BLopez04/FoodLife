# Architecture
Our app employs a MVC architecture to manage data flow and service within the app.

## Model
In our app, the model is our Mongo database. It stores information on all created users and their app critical data persistently which allows for easy access to, and storage of, necessary information. It is the source of information
that the controller will interact with to access, or make changes to, the app's necessary data.

## View
Our app uses the package react-frontend as its view. Here, we use the react framework to generate and serve an interactive UI to the user. This package controls the frontend logic, style, and any necessary requests to the controller
in the case that any information from the model needs to be operated on, whether fetched, updated, created, or deleted.

## Controller
Our app uses the package express-backend as its controller. It uses the express framework for node.js to handle requests from the view, and make requests to the Model in order to resolve those requests. It is an API that consists of
multiple endpoints for the view/frontend to call on in order to communicate with the model, and responds with the necessary information accordingly. It is responsible for all changes to, and direct interactions with the model when
a user is engaging with the view.

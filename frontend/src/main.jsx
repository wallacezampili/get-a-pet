import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import React from 'react';


//Pages
import Login from "./components/pages/Auth/Login";
import Register from "./components/pages/Auth/Register";
import Home from "./components/pages/Home";
import Profile from './components/pages/User/Profile.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import MyPets from './components/pages/Pet/MyPets.jsx';
import AddPet from './components/pages/Pet/AddPet.jsx';
import EditPet from './components/pages/Pet/EditPet.jsx';
import PetDetails from './components/pages/Pet/PetDetails.jsx';
import MyAdoptions from './components/pages/Pet/MyAdoptions.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
     {
      path: '/',
      element: <Home/>
     },
     {
      path: 'login',
      element: <Login/>
     },
     {
      path: 'register',
      element: <Register/>
     },
     {
      path: '/user/profile',
      element: <Profile/>
     },
     {
      path: '/pet/mypets',
      element: <MyPets/>
     },
     {
      path:'/pet/add',
      element: <AddPet/>
     },
     {
      path: '/pet/:id',
      element: <PetDetails/>
     },
     {
      path: '/pet/edit/:id',
      element: <EditPet/>
     },
     {
      path: '/pet/myadoptions',
      element: <MyAdoptions/>
     }
    ]
  },
  
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)

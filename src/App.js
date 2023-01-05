import React,{useEffect,createContext,useReducer,useContext} from 'react';
import Navbar from './components/Navbar';
import './App.css'
import {Route, Routes, useNavigate} from 'react-router-dom';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Login from './components/screens/Login';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import { reducer,initialState } from './reducers/userReducer'; 
import UserProfile from './components/screens/UserProfile';
import FollowingsPost from './components/screens/FollowingsPost';

export const UserContext = createContext();


const Routing = ()=>{
  const navigate =useNavigate();
  const {state,dispatch} = useContext(UserContext);
  useEffect(()=>{
    const user= JSON.parse(localStorage.getItem('user'));
    if(user){
     dispatch({type:"USER",payload:user})
   }else{
     navigate('/login');
   }
  },[])
  return (
    <Routes>
      <Route exact path='/' element={<Home/>} />
      <Route exact path='/profile' element={<Profile/>} />
      <Route exact path='/login' element={<Login/>} />
      <Route exact path='/Signup' element={<Signup/>} />
      <Route exact path='/createpost' element={<CreatePost/>} />
      <Route exact path='/profile/:userid' element={<UserProfile/>} />
      <Route exact path='/myfollowingspost' element={<FollowingsPost/>} />
    </Routes>
  )
}



function App() {
  
  const [state,dispatch] = useReducer(reducer,initialState);

  
  return (
    <>
    <UserContext.Provider value={{state,dispatch}}>
    <Navbar/>
    <Routing/>
    </UserContext.Provider>
    </>
  )
}

export default App;

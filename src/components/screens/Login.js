import React,{useState,useContext} from 'react'
import {Link,useNavigate} from "react-router-dom"
import M from 'materialize-css'
import {UserContext} from '../../App'
export default function Login() {
    const {state,dispatch} = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const postData = ()=>{
        fetch("https://viralit-api.onrender.com/signin",{
            method:"post",
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                email,
                password,
            })

        }).then(res=>res.json())
        .then(data=>{
           
            if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }else{
                localStorage.setItem("jwt",data.token);
                localStorage.setItem("user",JSON.stringify(data.user));
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"logged in",classes:"#66bb6a green lighten-1"});
                navigate('/');
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }

    return (
        <div className='mycard'>
            <form onSubmit={(e)=>{e.preventDefault();postData()}} className="card auth-card">
                <h2>Viralit</h2>
                <input type="text" placeholder='email'
                    value={email} 
                    onChange= {(e)=>{setEmail(e.target.value)}}
                />
                <input type="Password" placeholder='Password' 
                    value={password} 
                    onChange= {(e)=>{setPassword(e.target.value)}}
                />
                <button className="btn waves-effect waves-light" type="submit" name="action">
                    login
                    <i className="material-icons right">send</i>
                </button>
                <h5>
                    <Link to="/signup" style={{color:"black"}}>Don't have an account ? signUP first</Link>
                </h5>
                <small>Created by:-UDIT</small>


            </form>
        </div>
    )
}

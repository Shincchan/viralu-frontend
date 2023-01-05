import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css"
export default function Navbar() {
    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])

    const [search, setSearch] = useState("")
    const [userDetails, setUserDetails] = useState([])
    const searchModal = useRef(null);
    const { state, dispatch } = useContext(UserContext);
    const navigate = useNavigate();
    const renderList = () => {
        if (state) {
            return [
                <li key={88}>
                    <i data-target="modal1" className="material-icons right modal-trigger" style={{ cursor: "pointer" }} >search</i>
                </li>,
                <li key={1}>
                    <Link to="/profile"><i className="material-icons right">account_circle</i></Link>
                </li>,
                <li key={2}>
                    <Link to="/createpost">
                        <i className="material-icons" style={{ color: "white" }}>
                            add
                        </i>
                    </Link>
                </li>,
                <li key={100}>
                    <Link to="/myfollowingspost">
                        Followings
                    </Link>
                </li>,
                <button key={8} className="btn waves-effect waves-light" type="submit" name="action" style={{
                    backgroundColor: "transparent",
                    border: "none"
                }}
                    onClick={() => {
                        localStorage.clear();
                        dispatch({ type: "CLEAR" })
                        navigate('/login')
                    }}
                >
                    Logout


                </button>
            ];
        } else {
            return [
                <li key={3}>
                    <Link to="/login">Login</Link>
                </li>,
                <li key={4}>
                    <Link to="/signup">Signup</Link>
                </li>,
            ];
        }
    };

    const fetchUsers=(query)=>{
        setSearch(query);
        fetch('https://viralit-api.onrender.com/searchusers',{
            method:"post",
            headers:{
                'Content-Type':'application/json',
                "Authorization" : "Bearer "+ localStorage.getItem('jwt')
                },
            body:JSON.stringify({
                query
            })
        }).then(res=>res.json())
        .then(results=>{
            setUserDetails(results.user)
        })
    }

    return (
        <>
            <div className="navbar-fixed">
                <nav>

                    <div
                        className="nav-wrapper"
                        style={{ backgroundColor: "rgb(1 133 109)" }}
                    >
                        <Link to={state ? "/" : "/login"} className="brand-logo left">
                            Viralit
                        </Link>
                        <ul id="nav-mobile" className="right">
                            {renderList()}
                        </ul>
                    </div>

                </nav>
            </div>
            <div id="modal1" className="modal" ref={searchModal}>
                <div className="modal-content">
                    <input type="text" placeholder='search users (username)'
                        value={search}
                        onChange={(e) => { fetchUsers(e.target.value) }}
                    />
                    <ul className="collection">
                       {userDetails.map(item=>{
                           return <Link onClick={()=>{
                               M.Modal.getInstance(searchModal.current).close();
                               setSearch("")
                           }} to={item._id === state._id?"/profile" :"/profile/"+item._id} style={{color:"black"}}><li className="collection-item">{item.name}</li></Link>
                       })}
                       
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>{setSearch("")}}>close</button>
                </div>
            </div>
        </>
    );
}

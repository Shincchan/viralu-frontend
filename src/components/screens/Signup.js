import React, { useState ,useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import M from 'materialize-css'
export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(undefined)

    const navigate = useNavigate();

    useEffect(()=>{
        if(url){
            uploadFields();
        }
    },[url])

    const uploadPic =()=>{
        const data = new FormData();
    data.append('file',image)
    data.append("upload_preset", "viralit")
    data.append("cloud_name", "udirai")

    fetch("https://api.cloudinary.com/v1_1/udirai/image/upload", {
      method: "post",
      body: data,
    }).then(res => res.json())
      .then(data => {
        if(!data){
          M.toast({ html: "only image can be added", classes: "#c62828 red darken-3" })
        }
        setUrl(data.url);
       
      })
      .catch(err => {
        console.log(err);
        M.toast({ html: "only image can be added", classes: "#c62828 red darken-3" })

      })
    }

    const postData = () => {
        if(image){
            uploadPic();
        }else{
            uploadFields();
        }
        
    }


    const uploadFields = ()=>{
        fetch("https://viralit-api.onrender.com/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                pic:url
            })

        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                } else {
                    M.toast({ html: "User Created", classes: "#66bb6a green lighten-1" });
                    navigate('/login');
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    

   
    return (
        <form className='mycard' onSubmit={(e) => { e.preventDefault(); postData() }}>
            <div className="card auth-card">
                <h2>Viralit</h2>
                <input type="text" placeholder='email' value={email}
                    onChange={(e) => { setEmail(e.target.value) }}

                />
                <input type="text" placeholder='Username'
                    value={name}
                    onChange={(e) => { setName(e.target.value) }}
                    minLength={4}

                />

                <input type="Password" placeholder='Password'
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                    minLength={4}

                />
                <div className="file-field input-field">
                    <div className="btn">
                        <span>profile Pic</span>
                        <input type="file"

                            onChange={(e) => { setImage(e.target.files[0]) }}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>

                <button className="btn waves-effect waves-light" type="submit" name="action">
                    SignUp
                    <i className="material-icons right">send</i>
                </button>
                <h5>
                    <Link to="/login" style={{ color: "black" }}>Already have an account ? then login.</Link>
                </h5>

            </div>
        </form>
    )
}

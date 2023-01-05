import React, { useState, useEffect } from 'react'
import M from 'materialize-css'
import { useNavigate } from 'react-router-dom';
export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setloading] = useState(false)

  useEffect(() => {
    if (url) {
      fetch('https://viralit-api.onrender.com/createpost', {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem('jwt')
        },
        body: JSON.stringify({
          title,
          body,
          pic: url
        })

      }).then(res => res.json())
        .then(data => {
          
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" })
          } else {
            M.toast({ html: "posted", classes: "#66bb6a green lighten-1" });
            setloading(false);
            navigate('/');
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
  }, [url])

  const navigate = useNavigate();
  
  const postDetails = () => {
    setloading(true)
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
  return (
    <>
   
    {!loading ? <div className='card input-filed'
    style={{
      marginTop: "20px",
      margin: "30px auto",
      maxWidth: "500px",
      padding: "20px",
      textAlign: "center"
    }}
>  
    <input type="text" placeholder='title'
      value={title}
      onChange={(e) => { setTitle(e.target.value) }}
    />
    <input type="text" placeholder='body'
      value={body}
      onChange={(e) => { setBody(e.target.value) }}
    />
    <div className="file-field input-field">
      <div className="btn">
        <span>Upload img</span>
        <input type="file"

          onChange={(e) => { setImage(e.target.files[0]) }}
        />
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text" />
      </div>
    </div>
    <button className="btn waves-effect waves-light" type="submit" name="action"
      onClick={() => { postDetails() }}
    >
      Add Post
      <i className="material-icons right">send</i>
    </button>
    
  </div>  : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height:"100vh" }}>

<div className="preloader-wrapper small active">
    <div className="spinner-layer spinner-green-only">
        <div className="circle-clipper left">
            <div className="circle"></div>
        </div><div className="gap-patch">
            <div className="circle"></div>
        </div><div className="circle-clipper right">
            <div className="circle"></div>
        </div>
    </div>
</div>
</div> }

</> 
    
  )
}

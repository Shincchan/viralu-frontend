import React, { useState, useEffect,useContext  } from "react";
import {format} from 'timeago.js';
import { UserContext } from "../../App";
import M from 'materialize-css'
import {Link} from 'react-router-dom'

export default function Home() {
  const [loading, setloading] = useState(true)
  const [data, setData] = useState([]);
  const {state,dispatch} = useContext(UserContext); 
  useEffect(() => {
    setloading(true);
    fetch('https://viralit-api.onrender.com/allpost', {
      method:"get",
      headers: {
        "Authorization": "Bearer "+localStorage.getItem('jwt')
      }
    }).then(res => res.json())
      .then(result => {
        
        setData(result.posts);
        setloading(false);
        
      })



  }, []);

  const likePost = (id)=>{
      fetch('https://viralit-api.onrender.com/like',{
        method :"put",
        headers:{
          'Content-Type':'application/json',
          "Authorization" : "Bearer "+ localStorage.getItem('jwt')
        },
        body:JSON.stringify({
          postId:id
        }) 
      }).then(res=>res.json())
      .then(result=>{
        //making new array with updated data
        const newData = data.map(item=>{
          if(item._id===result._id){
            //updated data
            return result
          }else{
            //old data
            return item
          }
        })
        setData(newData)
      }).catch(err=>{
        console.log(err)
      })
  }
  const unlikePost = (id)=>{
    fetch('https://viralit-api.onrender.com/unlike',{
      method :"put",
      headers:{
        'Content-Type':'application/json',
        "Authorization" : "Bearer "+ localStorage.getItem('jwt')
      },
      body:JSON.stringify({
        postId:id
      }) 
    }).then(res=>res.json())
    .then(result=>{
      const newData = data.map(item=>{
        if(item._id===result._id){
          //updated data
          return result
        }else{
          //old data
          return item
        }
      })
      setData(newData)
    })
    .catch(err=>{
      console.log(err)
    })
}
  const makeComment = (text,postId)=>{
      fetch('https://viralit-api.onrender.com/comment',{
        method:"put",
        headers:{
          'Content-Type':'application/json',
          "Authorization" : "Bearer "+ localStorage.getItem('jwt')
          },
        body:JSON.stringify({
          postId :postId,
          text:text,
        })
      }).then(res=>res.json())
      .then(result=>{
        console.log(result);
        const newData = data.map(item=>{
          if(item._id===result._id){
            //updated data
            return result
          }else{
            //old data
            return item
          }
        })
        setData(newData)
      }).catch(err=>{
        console.log(err);
      })
  }

const deletePost =(postId)=>{
  fetch(`https://viralit-api.onrender.com/deletepost/${postId}`,{
    method:"delete",
    headers:{
      'Content-Type':'application/json',
      "Authorization" : "Bearer "+ localStorage.getItem('jwt')
      },
    
  }).then(res=>res.json())
  .then(result=>{
    console.log(result);
    const newData = data.filter(item=>{
      return item._id !== result._id
    })
    setData(newData);
    M.toast({ html: "post deleted", classes: "#66bb6a green lighten-1" });

  })
}

const deleteComment=  (postId,commentId)=>{
  fetch(`https://viralit-api.onrender.com/deletecomment/${postId}/${commentId}`,{
    method:"delete",
    headers:{
      'Content-Type':'application/json',
      "Authorization" : "Bearer "+ localStorage.getItem('jwt')
      },
    
  }).then(res=>res.json())
  .then(result=>{
    console.log(result);
    const newData = data.map(item=>{
      if(item._id===result._id){
        //updated data
        return result
      }else{
        //old data
        return item
      }
    })
    setData(newData)
    
  })
}



  return (
    <div className="home">

      {!loading ?
      
      data.map(item => {
        return (
          <div className="card home-card"  key={item._id}>
            <div style={{display:"flex", alignItems:"center"}}>
              <div style={{height:"50px",width:"50px",borderRadius:"50%"}}><img style={{height:"100%" ,width:"100%",borderRadius:"50%"}} src={item.postedBy.pic} alt="" /></div>
              
            <h5 style={{flex:"7", padding:"10px"}}><Link style={{color:"black"}} to={item.postedBy._id!==state._id?"/profile/"+item.postedBy._id : "/profile"}>{item.postedBy.name}</Link></h5>
            <span><small>{format(item.createdAt)}</small></span>
            {item.postedBy._id===state._id && <i className="material-icons" style={{cursor:"pointer"}}  onClick={()=>{deletePost(item._id)}} >delete</i>}
            
            </div>
            <div className="card-image">
              <img
                src={item.photo}
                alt=""
              />
            </div>
            <div className="card-content">
              <div style={{display:"flex", alignItems:"center"}}>
              {item.likes.includes(state._id)
              ?<i className="material-icons" style={{ color: "red" , cursor:"pointer"}} onClick={()=>{unlikePost(item._id)}} >favorite</i>
              :
              <i className="material-icons" style={{ color: "Black", cursor:"pointer"}} onClick={()=>{likePost(item._id)}} >favorite</i>
              }
              
              <span>{item.likes.length} likes</span>
              </div>


              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {
                item.comments &&  item.comments.map(record=>{
                  return (
                    <>
                    <h6 style={{display:"inline-block"}} key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}:-</span>{record.text}</h6>
                    {(item.postedBy===state._id || record.postedBy._id===state._id) && <i className="material-icons" style={{cursor:"pointer"}}  onClick={()=>{deleteComment(item._id,record._id)}} >delete</i> }
                    <br/>
                    </>
                  )
                })
              }
              <form onSubmit={(e)=>{e.preventDefault(); makeComment(e.target[0].value,item._id);}}>
                <input type="text" placeholder="add a comment" />  
              </form>
              
            </div>
          </div>
        )
      })
      
      
      : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height:"100vh" }} key={1}>

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
</div>}

      

    </div>
  );
}

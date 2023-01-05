import React, { useEffect, useState ,useContext } from 'react'
//hook for userProfile
import { useParams } from 'react-router-dom';
import { UserContext } from '../../App';
export default function UserProfile() {
    const [showFollow, setShowFollow] = useState(false)
    const {state,dispatch} = useContext(UserContext); 
    const [userProfile, setUserProfile] = useState(null);
    const { userid } = useParams();
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },

        }).then(res => res.json())
            .then(result => {
                setUserProfile(result)
            })
    }, [])

    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                
                dispatch({type:"UPDATE",payload:{followings:data.followings,followers:data.followers}})
                localStorage.setItem("user",JSON.stringify(data))
                
                //geting Previous state
                setUserProfile((prevState)=>{
                    return {
                        ...prevState,//adding in old data
                        user:{
                            ...prevState.user,
                            followers: [...prevState.user.followers,data._id]
                        }
                    }
                })
            })
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {
                
                dispatch({type:"UPDATE",payload:{followings:data.followings,followers:data.followers}})
                localStorage.setItem("user",JSON.stringify(data))
                
                //geting Previous state
                setUserProfile((prevState)=>{
                    const newFollower = prevState.user.followers.filter(item=>item !== data._id)
                    return {
                        ...prevState,//adding in old data
                        user:{
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
            })
    }



    return (

        <>
            {userProfile ?
                <div style={{ maxWidth: "800px", margin: "auto" }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around",
                        margin: "1.8rem 0rem",
                        borderBottom: "1px solid grey"
                    }}>
                        <div style={{ marginRight: "10px" }} >
                            <img src={userProfile.user.pic} alt="" style={{ width: "16rem", height: "16rem", borderRadius: "50%" }} />
                        </div>
                        <div>
                            
                            <h4>{userProfile.user.name}</h4>
                            <h5>{userProfile.user.email}</h5>


                            <div style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                                width: "108%",

                            }}>
                                <h6>{userProfile.posts.length} Posts</h6>
                                <h6>{userProfile.user.followers.length} Followers</h6>
                                <h6>{userProfile.user.followings.length} Following</h6>
                            </div>
                            {
                                state.followings.includes(userid) ?<button className="btn waves-effect waves-light" type="submit" name="action" onClick={()=>{unfollowUser()}}>
                                unfollow
                             </button> :<button className="btn waves-effect waves-light" type="submit" name="action" onClick={()=>{followUser()}}>
                               follow
                            </button>
                            }

                            
                            
                        </div>
                    </div>
                    <div className='gallery'>
                        {userProfile.posts &&
                            userProfile.posts.map(item => {
                                return (
                                    <img className='item' src={item.photo} alt={item.title} key={item._id} />
                                )
                            })
                        }
                    </div>
                </div>
                :
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>

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
                </div>


            }
        </>



    )
}

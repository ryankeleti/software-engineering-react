import React from "react";
import * as service from "../../services/likes-service";
import {useEffect, useState} from "react";

const TuitStats = ({tuit, likeTuit, dislikeTuit}) => {
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    useEffect(() => {
      const likedTuit = () =>
          service.findAllTuitsLikedByUser("me")
                 .then((tuits) => tuits.some(t => t._id === tuit._id))

      const dislikedTuit = () =>
          service.findAllTuitsDislikedByUser("me")
                 .then((tuits) => tuits.some(t => t._id === tuit._id))

      likedTuit().then((v) => setLiked(v));
      dislikedTuit().then((v) => setDisliked(v));
    }, [tuit, likeTuit, dislikeTuit]);

    const toggleLike = () => {
      likeTuit(tuit);
      setLiked(v => !v);
    };

    const toggleDislike = () => {
      dislikeTuit(tuit);
      setDisliked(v => !v);
    };

    return (
      <div className="row mt-2">
        <div className="col">
          <i className="far fa-message me-1"></i>
          {tuit.stats &&
          <span className="ttr-stats-replies">{tuit.stats.replies}</span>
          }
        </div>
        <div className="col">
          <i className="far fa-retweet me-1"></i>
          {tuit.stats &&
          <span className="ttr-stats-retuits">{tuit.stats.retuits}</span>
          }
        </div>
        <div className="col">
          <span className="ttr-like-tuit-click" onClick={toggleLike}>
             { liked ?
                  <i className="fas fa-thumbs-up me-1"></i>
                : <i className="far fa-thumbs-up me-1"></i> }
            <span className="ttr-stats-likes">{tuit.stats && tuit.stats.likes}</span>
          </span>
        </div>
        <div className="col">
          <span onClick={toggleDislike}>
             { disliked ?
                  <i className="fas fa-thumbs-down me-1"></i>
                : <i className="far fa-thumbs-down me-1"></i> }
            <span>{tuit.stats && tuit.stats.dislikes}</span>
          </span>
        </div>
        <div className="col">
          <i className="far fa-inbox-out"></i>
        </div>
      </div>
    );
}
export default TuitStats;

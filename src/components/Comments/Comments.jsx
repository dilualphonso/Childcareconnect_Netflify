import { useEffect, useState } from "react";
import baby from "../../assets/images/baby.jpg";
import "./Comments.scss";
import { FaStar } from "react-icons/fa";
import { BASE_URL } from "../../constant-variable";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import ReviewList from "../../pages/ReviewList/ReviewList";

function Comments({ comments, setComments }) {
  function changeTime(timestamp) {
    let milliseconds = timestamp;
    let videoDate = new Date(milliseconds);
    const currentDayOfMonth = videoDate.getDate();
    const currentMonth = videoDate.getMonth();
    const currentYear = videoDate.getFullYear();
    const newVideoDate =
      currentMonth + 1 + "/" + currentDayOfMonth + "/" + currentYear;
    return newVideoDate;
  }

  const [rating, setRating] = useState(0);
  const [rateColor, setRateColor] = useState(null);
  const { id } = useParams();

  const [review, setReviews] = useState("");

  const [fullName, setfullName] = useState("");
  const handleRate = (currentRate) => {
    setRating(currentRate);
    // Handle rate color change if needed
    console.log(currentRate);
  };

  function handleChageName(event) {
    setfullName(event.target.value);
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/daycares/${id}/reviews`);

        setComments(response.data);
      } catch (error) {
        console.error("Error fetching daycare:", error);
      }
    };
    fetchComments();
  }, [id, setComments]);

  function handleChageComment(event) {
    setReviews(event.target.value);
  }

  const formValid = () => {
    return review !== "" && fullName !== "";
  };

  //Posting comments
  const submitComment = async (event) => {
    event.preventDefault();

    if (!formValid()) {
      Swal.fire("Fields cannot be empty");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/daycares/${id}/reviews`, {
        comment: review,
        rating: rating,
        reviewer_name: fullName,
      });

      Swal.fire({
        title: "Success!",
        text: "Thank you for submitting.",
        icon: "success",
      }).then(function () {
        window.location.href = `https://endearing-salamander-3ce910.netlify.app/daycares/${id}`;
      });
    } catch (error) {
      console.error("Error submitting video:", error);
    }
  };

  return (
    <section className="comments">
      <h3 className="comments__title">Share Your Experience</h3>

      <form
        name="reviewform"
        className="comments__form"
        onSubmit={submitComment}
      >
        <div className="comments__fields">
          <div className="comments__image-container">
            <img className="comments__avatar" src={baby} alt="Baby" />
          </div>
          <div className="comments__right-container">
            <div className="comments__textwrap">
              <label className="comments__name-textBox" htmlFor="fullname">
                Full Name
              </label>
              <input
                className="comments__name-area"
                name="fullName"
                id="fullname"
                placeholder="Add your full name"
                type="text"
                onChange={handleChageName}
                value={fullName}
              ></input>
            </div>

            <div className="comments__starwrap">
              <label className="comments__rating" htmlFor="rate">
                Your Ratings
              </label>
              <div className="comments__star">
                {[...Array(5)].map((star, index) => {
                  const currentRate = index + 1;
                  return (
                    <label className="comments__star-label" key={index}>
                      <input
                        className="comments__radio"
                        type="radio"
                        name="starRate"
                        value={currentRate}
                        onClick={() => handleRate(currentRate)}
                      />
                      <FaStar
                        className={
                          currentRate <= rateColor
                            ? "comments__yellowStar"
                            : "comments__greyStar"
                        }
                        onClick={() => handleRate(currentRate)}
                        onMouseEnter={() => setRateColor(currentRate)}
                        onMouseLeave={() => setRateColor(rating)}
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="comments__textwrap">
              <label className="comments__subjecttxt" htmlFor="message">
                comment
              </label>
              <textarea
                className="comments__textarea"
                name="reviewText"
                id="message"
                onChange={handleChageComment}
                value={review}
                placeholder="Add a new comment"
              ></textarea>
            </div>
            <div className="comments__btn-container">
              <button className="comments__button" type="submit">
                Comment
              </button>
            </div>
          </div>
        </div>
      </form>

      <div>
        {comments.map((comment) => (
          <figure className="review" key={comment.id}>
            <hr className="review__line" />

            <div className="review__wrapper" key={comment.id}>
              <div className="review__placeholder"></div>
              <div className="review__right-container">
                <div>
                  <div className="review__text-container">
                    <h3 className="review__name">{comment.reviewer_name}</h3>
                    <time className="review__date">
                      {changeTime(comment.created_at)}
                    </time>
                  </div>
                  <p className="review__rate">
                    {[...Array(5)].map((star, index) => {
                      return (
                        <FaStar
                          key={index}
                          size={20}
                          className={
                            index < comment.rating
                              ? "comments__yellowStar"
                              : "comments__greyStar"
                          }
                        />
                      );
                    })}
                  </p>
                </div>
                <div className="review__comment-container">
                  <p className="review__sentence">{comment.comment}</p>
                </div>
              </div>
            </div>
          </figure>
        ))}

        <hr className="comments__line-bottom" />
      </div>

      <ReviewList comments={comments} />
    </section>
  );
}

export default Comments;

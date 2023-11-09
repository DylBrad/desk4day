import React from 'react';
import { Rating } from 'react-simple-star-rating';
import { IconContext } from 'react-icons';
import { MdOutlineClose } from 'react-icons/md';
import { MdImageSearch } from 'react-icons/md';

import { useForm } from 'react-hook-form';

const LogView = ({
  setShowLogView,
  logEntryImage,
  logEntryTitle,
  logEntryDescription,
  currentUserId,
}) => {
  const { register, handleSubmit } = useForm();

  const [reviewImage, setReviewImage] = React.useState('');

  const [rating, setRating] = React.useState(0);
  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);
    // other logic
  };
  React.useEffect(() => {
    console.log(rating);
    console.log('USER', currentUserId);
  }, [rating]);

  const handleClose = () => {
    setShowLogView(false);
    document.getElementById('mapComponent').style.display = 'block';
  };

  const onSubmit = async (data) => {
    data.reviewAuthorId = currentUserId;
    data.reviewRating = rating;
    if (reviewImage) {
      data.reviewImage = reviewImage;
    }
    console.log(data);
  };
  return (
    // Image(s)
    // Image carousel
    // Meta: Name, icon, location, created by/at
    // Reviews
    // Add review form (review, rating, image optional)
    <div className="log-view">
      <button className="close-button">
        <IconContext.Provider value={{ className: 'react-icons', size: 44 }}>
          <MdOutlineClose
            onClick={handleClose}
            value={{ className: 'react-icons' }}
          />
        </IconContext.Provider>
      </button>

      <div className="log-view-content-container">
        <div className="log-view-content">
          <div className="logV-image-box">
            <div className="logV-image-container">
              <div
                className="logV-image"
                style={{ backgroundImage: 'url(' + logEntryImage + ')' }}
              ></div>
            </div>
            <div className="carousel"></div>
          </div>

          <div className="logV-content-container">
            <div className="logV-meta">
              <div className="logV-title">
                <h2>{logEntryTitle}</h2>
                <p>{logEntryDescription}</p>
              </div>
            </div>

            <div className="log-review-form-container">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Rating
                  onClick={handleRating}
                  /* Available Props */
                />
                <textarea
                  {...register('review-text')}
                  placeholder="Leave a review.."
                ></textarea>
                <div>
                  <label>Image</label>
                  <div className="form-input type-file">
                    <IconContext.Provider
                      value={{ className: 'react-icons', size: 20 }}
                    >
                      <MdImageSearch value={{ className: 'react-icons' }} />
                      <span>Choose File</span>
                    </IconContext.Provider>
                  </div>
                  <input
                    type="file"
                    onChange={(e) => {
                      setReviewImage(e.target.files[0]);
                    }}
                    id="img-select"
                  ></input>{' '}
                  <span>{reviewImage && reviewImage.name}</span>
                </div>
                <button>Post</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogView;

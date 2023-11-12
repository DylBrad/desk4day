import React from 'react';
import { Rating } from 'react-simple-star-rating';
import { IconContext } from 'react-icons';
import { MdOutlineClose } from 'react-icons/md';
import { MdImageSearch } from 'react-icons/md';

import { useForm } from 'react-hook-form';

import {
  createLogEntryReview,
  getLogEntryReviews,
  getLogEntryImages,
} from '@/app/API';

const LogView = ({
  setShowLogView,
  logEntryId,
  logEntryImage,
  logEntryTitle,
  logEntryDescription,
  currentUserId,
}) => {
  const { register, handleSubmit } = useForm();

  const [reviewImage, setReviewImage] = React.useState('');

  const [allReviews, setAllReviews] = React.useState(null);

  const [rating, setRating] = React.useState(0);
  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);
    // other logic
  };

  const handleClose = () => {
    setShowLogView(false);
    document.getElementById('mapComponent').style.display = 'block';
  };

  const uploadImage = async () => {
    const data = new FormData();
    data.append('file', reviewImage);
    data.append('upload_preset', 'post_images');
    data.append('cloud_name', 'dibcf1yjc');
    data.append('folder', 'map-log-reviews');

    const posting = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL, {
      method: 'post',
      body: data,
    });
    try {
      const response = await posting.json();
      return response.url;
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    data.reviewAuthor = currentUserId;
    data.reviewRating = rating;

    if (reviewImage) {
      const imgUrl = await uploadImage();
      data.reviewImage = imgUrl;
    }
    console.log('ID: ', logEntryId);
    console.log('DATA: ', data);
    await createLogEntryReview(logEntryId, data);
  };

  React.useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviews = await getLogEntryReviews(logEntryId);
        setAllReviews(reviews);
        const images = await getLogEntryImages(logEntryId);
        console.log(images);
      } catch (error) {
        console.log('Error fetching reviews.');
      }
    };
    fetchReviews();
  }, []);
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
            <div>
              <div className="logV-meta">
                <div className="logV-title">
                  <h2>{logEntryTitle}</h2>
                  <p>{logEntryDescription}</p>
                </div>
              </div>

              <div className="reviews-container">
                {allReviews &&
                  allReviews.map((review) => {
                    return (
                      <div className="review">
                        <div
                          className="review-profile-pic"
                          style={{
                            backgroundImage: 'url(' + review.authorImage + ')',
                          }}
                        ></div>
                        <div className="review-content">
                          <p>{review.content}</p>
                          <div
                            className="review-image"
                            style={{
                              backgroundImage: 'url(' + review.image + ')',
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="log-review-form-container">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Rating
                  onClick={handleRating}
                  /* Available Props */
                />
                <textarea
                  {...register('reviewContent')}
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

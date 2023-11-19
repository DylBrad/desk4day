import React from 'react';
import { IconContext } from 'react-icons';
import { AiFillStar } from 'react-icons/ai';

import { getLogEntryReviews } from '@/app/API';

const LogReviewsView = ({ logEntryId }) => {
  const [allReviews, setAllReviews] = React.useState(null);

  React.useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviews = await getLogEntryReviews(logEntryId);
        setAllReviews(reviews);
      } catch (error) {
        console.log('Error fetching reviews.');
      }
    };
    fetchReviews();
  }, []);

  return (
    <>
      <h3>Reviews</h3>
      <div className="reviews-container">
        {allReviews &&
          allReviews.map((review) => {
            console.log('review:', review);
            return (
              <div className="review">
                <div
                  className="review-profile-pic"
                  style={{
                    backgroundImage: 'url(' + review.authorImage + ')',
                  }}
                ></div>
                <div className="review-content">
                  <div className="review-rating">
                    <IconContext.Provider
                      value={{ className: 'react-icons', size: 24 }}
                    >
                      <AiFillStar value={{ className: 'react-icons' }} />
                    </IconContext.Provider>
                    {review.rating}
                  </div>
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
    </>
  );
};

export default LogReviewsView;

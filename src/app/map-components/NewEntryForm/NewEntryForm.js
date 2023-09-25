import * as React from 'react';
import { useForm } from 'react-hook-form';
import { createLogEntry } from '@/app/API';
import { useCookies } from 'react-cookie';
import { IconContext } from 'react-icons';
import { MdImageSearch } from 'react-icons/md';

import jwt_decode from 'jwt-decode';

const NewEntryForm = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [cookies] = useCookies(['user']);
  const token = cookies.token;

  const [image, setImage] = React.useState('');

  const uploadImage = async () => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'post_images');
    data.append('cloud_name', 'dibcf1yjc');
    data.append('folder', 'map_log_pictures');

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

  let decodedToken = undefined;
  if (token !== undefined) {
    decodedToken = jwt_decode(token);
  }

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const imgUrl = await uploadImage();

      data.latitude = props.location.latitude;
      data.longitude = props.location.longitude;
      data.authorId = decodedToken.userId;
      data.image = imgUrl;

      const created = await createLogEntry(data);
      props.onClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
    setLoading(false);
  };

  const handleClick = () => {
    props.setIsSignUp(false);
    props.setShowAuthModal(true);
    props.setNewEntryLocation(null);
  };

  return (
    <>
      {token ? (
        <div className="map-form-wrapper">
          <form onSubmit={handleSubmit(onSubmit)} className="entry-form">
            <h2 className="form-header">Create Post</h2>

            <div className="wrap-input">
              <label htmlFor="title">Title</label>
              <input
                {...register('title')}
                className="form-input form-input-txt"
                required
                placeholder="Name of the location"
              />
            </div>

            <div className="wrap-input">
              <label htmlFor="establishment">Location Type</label>
              <select
                {...register('establishment')}
                className="form-input form-input-txt"
              >
                <option value="cafe">Cafe</option>
                <option value="restaurant">Restaurant</option>
                {/* <option value="library">Library</option>
                <option value="museum">Museum</option>
                <option value="coworking">Coworking</option>
                <option value="outdoor">Outdoor Space</option>
                <option value="university">University</option> */}
                <option value="other">Other</option>
              </select>
            </div>

            <div className="wrap-input">
              <label htmlFor="description">Description</label>
              <textarea
                {...register('description')}
                className="form-input form-input-txtarea"
                rows={3}
                required
                placeholder="Friendly cafe with wifi, plugs and delicious coffee"
              />{' '}
            </div>

            <div className="wrap-input wrap-file-input">
              <label htmlFor="img-select" className="form-file-input-wrapper">
                Upload Picture
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
                    setImage(e.target.files[0]);
                  }}
                  id="img-select"
                ></input>{' '}
              </label>
              <span>{image && image.name}</span>
            </div>

            <button disabled={loading} className="primary-button form-button">
              {loading ? 'Posting...' : 'Create Post'}
            </button>
            {error ? <h3 className="error">{error}</h3> : null}
          </form>
        </div>
      ) : (
        <div>
          <h3>Please log in to create a post.</h3>
          <button onClick={handleClick}>Log In</button>
        </div>
      )}
    </>
  );
};

export default NewEntryForm;

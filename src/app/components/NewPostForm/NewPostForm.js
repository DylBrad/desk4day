'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { createUserPost } from '../../API';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';
import { IconContext } from 'react-icons';
import { MdImageSearch } from 'react-icons/md';

const NewPostForm = (props) => {
  const [imageUrl, setImageUrl] = React.useState(null);
  const { register, handleSubmit } = useForm();
  const [cookies] = useCookies(['user']);

  const [loading, setLoading] = React.useState(null);

  const token = cookies.token;
  let decodedToken = undefined;
  if (token !== undefined) {
    decodedToken = jwt_decode(token);
  }

  const uploadImage = async () => {
    const data = new FormData();
    data.append('file', imageUrl);
    data.append('upload_preset', 'post_images');
    data.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_NAME);
    data.append('folder', 'profile_and_newsfeed_post_pictures');
    const posting = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL, {
      method: 'post',
      body: data,
    });
    try {
      const response = await posting.json();
      console.log('URL: ', response.url);
      return response.url;
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const cloudinaryImgUrl = await uploadImage();

    data.author = decodedToken.userId;
    data.image = cloudinaryImgUrl;
    await createUserPost(data);

    window.location.reload(false);
  };

  const handleClick = () => {
    props.setShowNewPostForm(false);
  };

  return (
    <div className="form-container">
      <form
        className="entry-form edit-profile-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="close-icon" onClick={handleClick}>
          ✖
        </div>

        <div className="wrap-input">
          <label htmlFor="img-select" className="form-file-input-wrapper">
            Select Image
            <div className="form-input type-file">
              <IconContext.Provider
                value={{ className: 'react-icons', size: 20 }}
              >
                <MdImageSearch value={{ className: 'react-icons' }} />
                <span>Upload from device</span>
              </IconContext.Provider>
            </div>
            <input
              type="file"
              onChange={(e) => {
                setImageUrl(e.target.files[0]);
              }}
              id="img-select"
            ></input>{' '}
          </label>
        </div>

        <div className="wrap-input">
          <label htmlFor="description">description</label>
          <textarea
            {...register('description')}
            rows="3"
            className="form-input form-input-txtarea"
            placeholder="Write something about yourself"
          ></textarea>
        </div>

        {!loading && (
          <button className="primary-button form-button">Create Post</button>
        )}

        {loading && (
          <button className="primary-button form-button" disabled={true}>
            Uploading..
          </button>
        )}
      </form>
    </div>
  );
};

export default NewPostForm;

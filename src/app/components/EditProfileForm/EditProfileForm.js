import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';
import { IconContext } from 'react-icons';
import { MdImageSearch } from 'react-icons/md';

import { updateUserProfile } from '../../API';

const EditProfileForm = (props) => {
  const { register, handleSubmit } = useForm();
  // set profile pic state
  const [imageUrl, setImageUrl] = React.useState(null);
  const [cookies] = useCookies(['user']);

  const token = cookies.token;

  let decodedToken = undefined;
  let id = undefined;
  if (token !== undefined) {
    decodedToken = jwt_decode(token);
    id = decodedToken.userId;
  }

  const uploadImage = async () => {
    const data = new FormData();
    data.append('file', imageUrl);
    data.append('upload_preset', 'post_images');
    data.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_NAME);
    data.append('folder', 'profile_pictures');
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
    // set the url to send to database
    if (imageUrl !== null) {
      const cloudinaryImgUrl = await uploadImage();
      data.profile_pic = cloudinaryImgUrl;
    }
    if (data.bio.length === 0) {
      delete data.bio;
    }
    console.log(data);
    await updateUserProfile(id, data);
  };
  const handleClick = () => {
    props.setShowEditProfileForm(false);
  };

  return (
    <div className="fullscreen-form-container">
      <div className="map-form-wrapper center-form form-container">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="entry-form edit-profile-form"
        >
          <div className="close-icon" onClick={handleClick}>
            ✖
          </div>

          <div className="wrap-input">
            <label htmlFor="img-select" className="form-file-input-wrapper">
              Change profile picture
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
            <label htmlFor="bio">Bio</label>
            <textarea
              {...register('bio')}
              rows="3"
              className="form-input form-input-txtarea"
              placeholder="What are your interests and hobbies?"
            ></textarea>
          </div>

          <button className="primary-button form-button">Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { IconContext } from 'react-icons';
import { MdImageSearch } from 'react-icons/md';

import { updatePost } from '../../API';

const EditPostForm = ({
  postId,
  setPostId,
  setShowEditPostForm,
  postFormPlaceholder,
  setPostFormPlaceholder,
}) => {
  const { register, handleSubmit } = useForm();
  const [imageUrl, setImageUrl] = React.useState(null);

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
    // set the url to send to database
    if (imageUrl !== null) {
      const cloudinaryImgUrl = await uploadImage();
      data.image = cloudinaryImgUrl;
    }
    if (data.description.length === 0) {
      delete data.description;
    }
    console.log(data);
    await updatePost(postId, data);

    window.location.reload(false);
  };

  const handleClick = () => {
    setShowEditPostForm(false);
    setPostFormPlaceholder('');
    setPostId('');
  };

  return (
    <div className="form-container">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="entry-form edit-profile-form"
      >
        <div className="close-icon" onClick={handleClick}>
          ✖
        </div>

        <div className="wrap-input">
          <label htmlFor="img-select" className="form-file-input-wrapper">
            Change Image
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
          <label htmlFor="description">Description</label>
          <textarea
            {...register('description')}
            rows="3"
            className="form-input form-input-txtarea"
            placeholder={postFormPlaceholder}
          ></textarea>
        </div>

        <button className="primary-button form-button">Update</button>
      </form>
    </div>
  );
};

export default EditPostForm;

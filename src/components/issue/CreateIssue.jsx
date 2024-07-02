import { useState } from 'react';
import { postApi, uploadImage } from '../../helpers/requestHelpers';
import Loader from '../loader/Loader';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../alert/Alert';

export default function CreateIssue() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState();
  const [imageLoader, setImageLoader] = useState(false);
  const [description, setDescription] = useState('');

  const handleMainFileSelect = async (event) => {
    setImageLoader(true)

    const files = event.target.files;
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
  
    try {
      const response = await uploadImage("/api/consent/uploadImage", formData);
      setImage(response?.imageUrls[0])
      setImageLoader(false)
    } catch (error) {
      setImageLoader(true)
      console.log(error);
    }
  };




  const handleSubmit = async (event) => {
    setLoading(true)
    event.preventDefault();
    const data = {
      description: description,
      imageUrl: image,
    };
    
    try {
      await postApi('post', '/api/issues/createIssue', data);
      setLoading(false)
      Toast.fire({
                icon: "success",
                title: "We Will Connect You Soon",
              });
      setDescription(null)
      setImage(null)

      // Handle post-submission logic (e.g., closing the modal, showing a success message)
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Something Went's wrong",
      });
      setLoading(false)
      console.log(error);
    }
  };


  return (
    <>
{ loading && <div className="col-12 d-flex justify-content-center">
  <Loader/>
  </div>}

{!loading && <div className="content-area">
  <h2 className='fw-bold text-center my-3' ><span style={{color:"#7C46BE"}} >Any Issue?</span> Connect to Admin</h2>
<div className="container consentForm p-5">

              <form className='row g-3' onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="exampleFormControlTextarea1" className="form-label">Explain Your Issue</label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                    className="form-control shadow-none" 
                    id="exampleFormControlTextarea1" 
                    rows="3">
                  </textarea>
                </div>

                {<div className="mb-3">
                  <label htmlFor="formFile" className="form-label">Upload Image</label>
                  <input
      type="file"
       className="form-control"
      onChange={handleMainFileSelect}
      accept=".jpg,.jpeg,.png" 
      id="formFile"// Specify accepted file types
    />
   
                </div>}

                <div className="col-12 d-flex justify-content-center">
  {imageLoader && <Loader/>}
  </div>
                {/* <div className="col-md-12 d-flex justify-content-around mt-3">
                  {imageLoader && <Loader />}
                  {image && (
                    <div className="position-relative" style={{ width: "200px", height: "150px" }}>
                      <i onClick={handleDeleteImage} role="button" className="fa-solid bg-danger text-white p-1 fa-xmark position-absolute top-0 end-0"></i>
                      <img 
                        className='px-2 mx-2 img-fluid' 
                        style={{ width: "200px", height: "150px" }} 
                        src={image} 
                        alt={`Uploaded file`} 
                      />
                    </div>
                  )}
                </div> */}
                <div className="modal-footer">
                  <button type="submit" className="btn btn-danger">Raise Issue</button>
                </div>
              </form>
              </div>
</div> }         
    </>
  );
}

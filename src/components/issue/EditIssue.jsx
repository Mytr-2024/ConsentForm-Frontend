import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApi, postApi, uploadImage } from '../../helpers/requestHelpers';
import Loader from '../loader/Loader';
import { Toast } from '../alert/Alert';

export default function EditIssue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState();
  const [imageLoader, setImageLoader] = useState(false);
  const [description, setDescription] = useState('');

  const fetchIssueData = async () => {
    setLoading(true);
    try {
      const response = await getApi("get", `/api/issues/issue/${id}`);
      const issueData = response?.data?.issue;
      setDescription(issueData?.description);
      setImage(issueData?.imageUrl);
    } catch (error) {
      console.error("Error fetching issue data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchIssueData();
    }
  }, [id]);

  const handleMainFileSelect = async (event) => {
    setImageLoader(true);

    const files = event.target.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const response = await uploadImage("/api/consent/uploadImage", formData);
      setImage(response?.imageUrls[0]);
    } catch (error) {
      console.log(error);
    } finally {
      setImageLoader(false);
    }
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const data = {
      description: description,
      imageUrl: image,
    };

    try {
      await postApi('post', `/api/issues/updateIssue/${id}`, data);
      setLoading(false);
      Toast.fire({
        icon: "success",
        title: "Issue Updated Successfully",
      });
      navigate('/issues'); // Redirect to the issues list or another appropriate page
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Something Went Wrong",
      });
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      {loading && <div className="col-12 d-flex justify-content-center"><Loader /></div>}
      {!loading && (
        <div className="content-area">
          <h2 className='fw-bold text-center my-3'>
            <span style={{ color: "#7C46BE" }}>Edit Issue</span>
          </h2>
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

              <div className="mb-3">
                <label htmlFor="formFile" className="form-label">Upload Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleMainFileSelect}
                  accept=".jpg,.jpeg,.png"
                  id="formFile"
                />
              </div>

              <div className="col-12 d-flex justify-content-center">
                {imageLoader && <Loader />}
              </div>

              {image && (
                <div className="col-md-12 d-flex justify-content-around mt-3">
                  <div className="position-relative" style={{ width: "200px", height: "150px" }}>
                    <img 
                      className='px-2 mx-2 img-fluid' 
                      style={{ width: "200px", height: "150px" }} 
                      src={image} 
                      alt={`Uploaded file`} 
                    />
                  </div>
                </div>
              )}

              <div className="modal-footer">
                <button type="submit" className="btn btn-danger">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

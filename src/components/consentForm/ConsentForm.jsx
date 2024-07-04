import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas';
import { getApi, postApi, uploadImage } from '../../helpers/requestHelpers'
import { useRecordWebcam } from 'react-record-webcam'
import QuillEditor from "react-quill";
import Loader from '../loader/Loader';
import { Toast } from "../../components/alert/Alert";
import Step from '../step/Step';
import patientRegistrationIcon from '../../assets/icons/registration.png';
import disease from '../../assets/icons/disease.png';
import faq from '../../assets/icons/faq.png';
import preview from '../../assets/icons/preview.png';
import submit from '../../assets/icons/submit.png';
import summary from '../../assets/icons/summary.png';
import treatement from '../../assets/icons/treatement.png';

const ConsentForm = () => {
    const steps = [
        { icon: patientRegistrationIcon, label: 'Registration' },
        { icon: disease, label: 'Diseases' },
        { icon: treatement, label: 'Treatment' },
        { icon: summary, label: 'Summary' },
        { icon: faq, label: 'FAQ' },
        { icon: preview, label: 'Preview Form' },
        { icon: submit, label: 'Submit Consent' }
    ];


    const OPTIONS = { options: { fileName: 'custom-name', fileType: 'webm', height: 1080, width: 1920 } }
    const { createRecording, openCamera, startRecording, stopRecording, closeCamera, clearAllRecordings } = useRecordWebcam()
    const [loader, setLoader] = useState(false);
    const [surgenLoader, setSurgenLoader] = useState(false);
    const [generalLoader, setGeneralLoader] = useState(false);


    const navigate = useNavigate();
    const [consentData, setConsentData] = useState({ patientName: "", patientId: "", mobileNo: "", adharCard: "", gender: "", dob: "", gaurdianName: "", address: "",relation:"" });
    const [errorMessage, setErrorMessage] = useState()
    const [loading, setLoading] = useState(false)

    const [allCaseType, setAllCaseType] = useState()
    const [allQuestions, setAllQuestions] = useState()
    const [allAnswer, setAllAnswer] = useState()
    const [caseType, setCaseType] = useState()
    const [customOption, setCustomOption] = useState()
    const [inputValues, setInputValues] = useState([]);

    // const [imageUrl, ] = useState()
    const [VideoUrl, setVideoUrl] = useState()
    const [showPreview , setShowPreview] = useState();

    const getAllcaseType = async () => {
        let allCase = await getApi("get", "/api/template/getAllCaseType")

        setAllCaseType(allCase?.data?.caseType)
      
    }


    const [smallLoader1, setsmallLoader1] = useState(false)
    const [smallLoader2, setsmallLoader2] = useState(false)

    useEffect(() => {
        // Fetch case types when component mounts
        getAllcaseType();
    
        // Set up form validation
      
    }, []);
    

    const [sign, setSign] = useState();
    const [surgenSign, setSurgenSign] = useState();

    const handleClearSign = () => {
        sign.clear();
    };
    const handleClearSurgenSign = () => {
        surgenSign.clear();
    };

    const [imageUrl, setImageUrl] = useState()
    const generateSign = async () => {
        setGeneralLoader(true)
        // Assuming sign is defined somewhere in your code
        const base64 = sign.getTrimmedCanvas().toDataURL('image/png');

        // Convert base64 string to Blob
        const base64ToBlob = (base64) => {
            const byteCharacters = atob(base64.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type: 'image/png' });
        };

        // Create a FormData object
        const formData = new FormData();
        const file = base64ToBlob(base64);
        formData.append('images', file, 'signature.png');

        try {
            const response = await uploadImage("/api/consent/uploadImage", formData);
            setImageUrl(response?.imageUrls[0])
            setGeneralLoader(false)
        } catch (error) {
            console.log(error);
            setGeneralLoader(false)
        }
    };

    const [surgenImageUrl, setSurgenImageUrl] = useState()
    const generateSurgenSign = async () => {
        setSurgenLoader(true)
        // Assuming sign is defined somewhere in your code
        const base64 = surgenSign.getTrimmedCanvas().toDataURL('image/png');

        // Convert base64 string to Blob
        const base64ToBlob = (base64) => {
            const byteCharacters = atob(base64.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type: 'image/png' });
        };

        // Create a FormData object
        const formData = new FormData();
        const file = base64ToBlob(base64);
        formData.append('images', file, 'signature.png');

        try {
            const response = await uploadImage("/api/consent/uploadImage", formData);
            setSurgenImageUrl(response?.imageUrls[0])
            setSurgenLoader(false)
        } catch (error) {
            setSurgenLoader(false)
            console.log(error);
        }
    };

    const handleInputChange = async (e) => {
        setErrorMessage("")
        setMobileRedBorder(false);
        setAadharRedBorder(false);
        const { name, value } = e.target;
        setConsentData({ ...consentData, [name]: value });
    };

    const [value, setValue] = useState("");
    const quill = useRef();

    const handleCaseTypeChange = async (e) => {
    setsmallLoader1(true)
        setCaseType(e.target.value)
        const res = await getApi("get", `/api/template/questionsByCaseType?caseType=${e.target.value}`);
        setAllQuestions(res?.data?.questions)
        
        const temp = await getApi("get", `/api/template/getTemplateByCaseType?caseType=${e.target.value}`);
        console.log(temp)
        setValue(temp?.data?.deltaForm)
        setSingleConsentData(temp?.data)
        console.log(temp?.data?.videoUrl)
        setsmallLoader1(false)
        // setSingleConsentData(temp?.data?.template)
    }

// Working here
const [customFields, setCustomFields] = useState([])
const handleCustomOptionChange = async (e, field) => {
    const optionValue = e.target.value;
    setCustomOption(optionValue);  // Assuming setCustomOption updates the state for the current option value

    // Update the customFields state array to modify the existing field or add a new one
    setCustomFields(prevFields => {
        const fieldIndex = prevFields.findIndex(f => f.fieldName === field);
        const newField = { fieldName: field, option: optionValue };

        if (fieldIndex !== -1) {
            // If the field already exists, update it
            return prevFields.map((item, index) => index === fieldIndex ? newField : item);
        } else {
            // If the field does not exist, add it
            return [...prevFields, newField];
        }
    });

    // Log the customFields state after the update (this will not immediately show the updated state)
    console.log(customFields);

    // Ensure caseType is available here, either from state or props
    const temp = await getApi("get", `/api/template/getOptions?caseType=${encodeURIComponent(caseType)}&fieldName=${encodeURIComponent(field)}&optionName=${encodeURIComponent(optionValue)}`);
    console.log(temp);

    if (temp?.data) {
        // Update singleOptionData by either adding new data or updating existing
        setSingleOptionData(prevOptions => {
            const index = prevOptions.findIndex(option => option.fieldName === field);
            if (index !== -1) {
                // If data exists for this field, update it
                return prevOptions.map((opt, idx) => idx === index ? {...opt, ...temp.data} : opt);
            } else {
                // If no data exists for this field, add new data
                return [...prevOptions, {...temp.data, fieldName: field}];
            }
        });
    }
};





    const handleAnswerChange = async (e, index) => {
        const { value } = e.target;
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);

    };

    const handleConsentSubmit = async (e) => {
        e.preventDefault();
        // e.stopPropagation();
        
        if(consentData?.mobileNo?.length!=10){
            setMobileRedBorder(true);
            window.scrollTo(0,0)
            return
        }

        if(consentData?.adharCard?.length!=12){
            setAadharRedBorder(true);
            window.scrollTo(0,0)
            return
        }

        setLoader(true)

        if(imageUrl===undefined && index===6){
            setLoader(false)
            setLoading(false)
            scrollToAndHighlightButton('capturePatient')
            return
        }
        if(surgenImageUrl===undefined && index===6){
            setLoader(false)
            setLoading(false)
            scrollToAndHighlightButton('captureSurgeon')
            return
        }

        // if(videoUrlState==undefined && index===6){
        //     setLoader(false)
        //     setLoading(false)
        //     scrollToAndHighlightButton('captureVideo')
        //     return
        // }
        // if(videoUrlState===undefined){
        //     Toast.fire({
        //         icon: "error",
        //         title: "We need Your Video",
        //       });
        //       setLoader(false)
        //       setLoading(false)
        //       return
        // }

        // const form = e.currentTarget;
        // if (!form.checkValidity()) {
        //     form.classList.add('was-validated');
        //     return;
        // }
        
        // const data = {
        //     ...consentData,
        //     patientSignatureUrl: imageUrl,
        //     surgeonSignatureUrl:surgenImageUrl,
        //     // VideoUrl: videoUrlState,
        //     VideoUrl: "hello",
        //     caseType: caseType,
        //     createdBy: JSON.parse(localStorage.getItem('user'))?.user?.email,
        //     question: allQuestions.reduce((acc, question, index) => {
        //         acc[question] = inputValues[index];
        //         return acc;
        //     }, {}),
        //     customFields:customFields
        // };
    
        const data = {
            ...consentData,
            caseType: caseType || undefined,
            createdBy: JSON.parse(localStorage.getItem('user'))?.user?.email,
            question: allQuestions?.reduce((acc, question, index) => {
                        acc[question] = inputValues[index];
                        return acc;
                    }, {}) || undefined,
                    customFields:customFields||undefined,
                    patientSignatureUrl: imageUrl || undefined,
                        surgeonSignatureUrl:surgenImageUrl || undefined,
                        VideoUrl: videoUrlState || undefined,
        };

    
        try {
            setLoading(true);
            let res = await postApi('post', `api/consent/submitConsent`, data);
            console.log(res?.data)
            if(res?.data?.consent?.patientSignatureUrl){
                navigate('/consentList')
            }
           
            if(res?.data?.status==true){
                setIndex(index+1)
                setLoader(false)
                // setIndex(index+1)
                setLoading(false);
            }else{
                setLoading(false);
                setLoader(false)

                Toast.fire({
                    icon: "error",
                    title: res?.data?.message||"Something Went's Wrong, Retry",
                  });
                  return
            }
            
        } catch (error) {
            setLoader(false)
            setLoading(false);
            Toast.fire({
                icon: "error",
                title: error?.message,
              });

        }
    };
    


const [index, setIndex] = useState(0)



    const [recordingState, setRecordingState] = useState()

  


    const [recordedState, setRecordedState] = useState()


    const [videoUrlState, setVideoUrlState] = useState();




const handleClearVideo = () => {
    // Reset state variables related to recordings
    setRecordingState(undefined);
    setRecordedState(undefined);
    setShowPreview(false);
setElapsedTime(0)
    // Clear video sources
    activeRecordings?.forEach(recording => {
        if (recording.webcamRef.current) {
            recording.webcamRef.current.srcObject = null;
        }
        if (recording.previewRef.current) {
            recording.previewRef.current.srcObject = null;
        }
    });

    // Clear loading state if it's still active
    setLoading(false);

    // Reset activeRecordings
    // resetRecordings();
    clearAllRecordings()
};
const [videoLoader, setVideoLoader] = useState(false)

// Function to start recording
const startRecoding = async () => {
    setVideoLoader(true)

    setElapsedTime(0);
    if (recordingState?.id) {
        await stopRecording(recordingState.id);
        await closeCamera(recordingState.id);
    }

    const recording = await createRecording();
    setRecordingState(recording);
    await openCamera(recording?.id);
    setVideoLoader(false)
    await startRecording(recording?.id);
    
};

const stopRecoding = async () => {

    const recorded = await stopRecording(recordingState?.id);
    setRecordedState(recorded);
    await closeCamera(recordingState?.id);
    setShowPreview(true);
    clearInterval(timerRef.current);

};



    const saveRecoding = async () => {
        setVideoLoader(true)
        const element = document.getElementById('captureVideo');
        element.classList.remove('highlight')
        const formData = new FormData();
        console.log( recordedState?.blob)
        formData.append('video', recordedState?.blob, 'recorded.webm');
        try {

            let res = await postApi("post", "api/consent/uploadVideo", formData)
            console.log(res)
            if (res?.data?.status === true) {
                setVideoUrlState(res?.data?.videoUrl)
                setVideoLoader(false)
                document.getElementById('closeSaveVideo').click();
                Toast.fire({
                    icon: "success",
                    title: "Video Uploaded",
                  });
            }
            else {
                console.log(errorMessage)
                setVideoLoader(false)
                Toast.fire({
                    icon: "error",
                    title: "Time Out",
                  });
            }
        } catch (error) {
            console.log(error)
            setVideoLoader(false)
        }
    }

    let { activeRecordings } = useRecordWebcam()
    const [singleConsentData, setSingleConsentData] = useState()
    const [singleOptionData, setSingleOptionData] = useState([])


   const [mobileRedBorder, setMobileRedBorder] = useState(false)
   const [aadharRedBorder, setAadharRedBorder] = useState(false)

   const [elapsedTime, setElapsedTime] = useState(0);
const timerRef = useRef(null);

useEffect(() => {
    if (recordingState) {
        timerRef.current = setInterval(() => {
            setElapsedTime(prevTime => prevTime + 1);
        }, 1000);
    } else {
        clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
}, [recordingState]);


function scrollToAndHighlightButton(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        // Scroll to the element
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
        // Add a class to highlight the button
        element.classList.add('highlight');
    } else {
        console.error('Element not found:', elementId);
    }
  }


  const handleIncreaseIndex=()=>{
    setIndex(index+1)
  }
  const handleDecreaseIndex=()=>{
    setIndex(index+-1)
  }

    return (
        <>
         
       <div style={{background:"white"}}  className="steps-container mb-3 d-flex justify-content-center align-items-center ">
            <div className="steps w-100 overflow-auto">

                {steps.map((step, idx) => (
                    <Step key={idx} icon={step.icon} label={step.label} isActive={idx === index} />
                ))}
            </div>
        </div>
        {loader && (
        <div className="d-flex w-100 justify-content-center align-items-center">
          <Loader />
        </div>
      )}
       { !loader &&  <div style={{ minHeight: "55vh" }} className="container consentForm p-5">
            <form className='row g-3 needs-validation'  onSubmit={handleConsentSubmit}>

{index==0 &&
<><h4 style={{color:"#771E99"}} className='fw-bold' >PATIENT REGISTRATION</h4>
<div className="col-md-4  has-validation">
<label htmlFor="Pname" className="form-label">Patient Name</label>
<input
type="text"
className="form-control"
id="Pname"
placeholder="Enter Patient Name"
required
name="patientName"
value={consentData.patientName}
onChange={handleInputChange}
aria-describedby="inputGroupPrepend3 validationServerUsernameFeedback"
/>
</div>

<div className="col-md-4">
<label htmlFor="Pid" className="form-label">
    Patient Id
</label>
<input
    type="text"
    className="form-control"
    id="Pid"
    name='patientId'
    placeholder="Enter Paitent Id"
        required
    value={consentData.patientId}
    onChange={handleInputChange}
/>
</div>

<div className="col-md-4">
<label htmlFor="Pnum" className="form-label">
Mobile Number <span style={{ color: "red" }}>{mobileRedBorder && "(Must be of 10 digits)"}</span>
</label>
<input
type="text"
className="form-control"
id="Pnum"
style={mobileRedBorder ? { border: "1px solid red" } : {}}
name='mobileNo'
placeholder="Enter Mobile Number"
required
value={consentData.mobileNo}
onChange={handleInputChange}
/>
</div>

<div className="col-md-4">
<label htmlFor="Paadhar" className="form-label">
    Aadhar Card  <span style={{ color: "red" }}>{aadharRedBorder && "(Must be of 12 digits)"}</span>
</label>
<input
    type="text"
    className="form-control "
    id="Paadhar"
    placeholder="Enter Aadhar Number"
    required
    style={aadharRedBorder ? { border: "1px solid red" } : {}}

    value={consentData.adharCard}
    onChange={handleInputChange}
    name='adharCard'
/>
</div>


<div className="col-md-4">
<label htmlFor="gender" className="form-label">
    Gender
</label>
<select
    className="form-control"
    id="gender"
    required
    value={consentData.gender}
    onChange={handleInputChange}
    name='gender'
>
    <option  value=""  >Select Gender</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
    <option value="others">Others</option>
</select>
</div>

<div className="col-md-4">
<label htmlFor="Pdob" className="form-label">
    Date Of Birth
</label>
<input
    type="date"
    className="form-control "
    id="Pdob"
    required
    name='dob'
    value={consentData.dob}
    onChange={handleInputChange}
    max={new Date().toISOString().split('T')[0]}
/>
</div>
<div className="col-md-4">
<label htmlFor="Gname" className="form-label">
    Gaurdian Name
</label>
<input
    type="text"
    className="form-control "
    id="Gname"
    placeholder="Enter Gaurdian Name"
    required
    name='gaurdianName'
    value={consentData.gaurdianName}
    onChange={handleInputChange}
/>
</div>
<div className="col-md-4">
<label htmlFor="Paddress" className="form-label">
    Address
</label>
<input
    type="text"
    className="form-control "
    id="Paddress"
    placeholder="Enter Patient Address"
    required
    name='address'
    value={consentData.address}
    onChange={handleInputChange}
/>
</div>

<div className="col-md-4">
<label htmlFor="relation" className="form-label">
    Relation with patient
</label>
<input
    type="text"
    className="form-control "
    id="relation"
    placeholder="Enter relation with patient"
    required
    name='relation'
    value={consentData.relation}
    onChange={handleInputChange}
/>
</div>

<div className="  d-flex justify-content-between flex-row-reverse">
    <div className="d-flex justify-content-end">
{index >= 0 && index < 6  && (
                    <button type='submit' className='position-relative my-5'>
                        <i style={{ fontSize: "60px", color: "#F44336" }} className="fa-solid fa-circle-arrow-right"></i>
                    </button>
            )}
            </div>

            <div className="d-flex justify-content-between">
{index > 0 && (
                    <button type='button' className='position-relative my-5'>
                        <i onClick={handleDecreaseIndex} style={{ fontSize: "60px", color: "#F44336",transform: "rotate(180deg)"}} className="fa-solid fa-circle-arrow-right"></i>
                    </button>
            )}
            </div>
</div>

</>}

</form>
{/* case type started */}


{index===1 &&
<>

<form className='row g-3 needs-validation'  onSubmit={handleConsentSubmit}>

                <div className="col-md-12">
                    <label htmlFor="caseType" className="form-label">
                        Case Type
                    </label>
                    <select
                        className="form-control"
                        id="caseType"
                        required
                        name='caseType'
                        value={caseType}
                        onChange={handleCaseTypeChange}
                    >
                        <option value="" >Select Case Type</option> 
                        {allCaseType?.map((caseType, index) => (
                            <option key={index} value={caseType}>{caseType.charAt(0).toUpperCase() + caseType.slice(1)}</option>
                        ))}
                    </select>
                </div>
                {smallLoader1 && <div className="d-flex justify-content-center">
    <Loader/>
</div>
}
               {caseType && !smallLoader1 &&
                <div className="col-md-12">
                    <div className="col-md-11 my-4">
  <div className="row">

 
<label htmlFor="created By" className="form-label">
                        {singleConsentData?.caseType}
                        </label>
<div className="col-md-7 height_of_quill">
<QuillEditor
            theme="snow"
            value={value}
            readOnly={true}
            modules={{
                toolbar: false, 
              }}
          />
<div className="">
{singleConsentData?.imageUrl.map((image,index)=>(


<img style={{height:"200px", width:"250px"}} alt='' key={index} src={image}/>


))}
</div>

</div>
<div className="col-md-2">
<label htmlFor="created By" className="form-label">
                        {singleConsentData?.caseType}
                        </label>

                        <div className="video-container">
                       
<iframe width="380" height="225"
src={singleConsentData?.videoUrl}
  title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


    </div>

</div>

</div>

</div>
</div>
}
<div className="  d-flex justify-content-between flex-row-reverse">
    <div className="d-flex justify-content-end">
{index >= 0 && index < 6  && (
                    <button type='submit' className='position-relative my-5'>
                        <i style={{ fontSize: "60px", color: "#F44336" }} className="fa-solid fa-circle-arrow-right"></i>
                    </button>
            )}
            </div>

            <div className="d-flex justify-content-between">
{index > 0 && (
                    <button type='button' className='position-relative my-5'>
                        <i onClick={handleDecreaseIndex} style={{ fontSize: "60px", color: "#F44336",transform: "rotate(180deg)"}} className="fa-solid fa-circle-arrow-right"></i>
                    </button>
            )}
            </div>
</div>
</form>
</>
}



{ caseType && !smallLoader1 && index===4 && <div className="col-md-12 my-4">
<div className="accordion" id="accordionExample">



 {singleConsentData?.faqs?.map((faq,index)=>(
  <div key={index} className="accordion-item">
    <h2 className="accordion-header">
      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseOne${index}`} aria-expanded="true" aria-controls="collapseOne">
        {faq?.title}
      </button>
    </h2>
    <div id={`collapseOne${index}`} className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div className="accordion-body">
      <div className="row">

 
<div className="col-md-7 ">
<QuillEditor
            theme="snow"
            value={faq?.description}
            readOnly={true} 
            modules={{
                toolbar: false, 
              }}
          />
<div className="">
{faq?.imageUrl.map((image,index)=>(


<img  className='object-fit-contain my-2' style={{height:"200px", width:"50vw"}} alt='' key={index} src={image}/>


))}
</div>

</div>
<div className="col-md-2">
<label htmlFor="created By" className="form-label">
                        {singleConsentData?.caseType}
                        </label>

                        <div className="video-container">
   
 
                        


<iframe width="380" height="225"
  src={faq?.videoUrl}
  title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


    </div>
</div>
</div>
      </div>
    </div>
  </div>
 )) }
 
</div>
<div className="  d-flex justify-content-between flex-row-reverse">
    <div className="d-flex justify-content-end">
{index >= 0 && index < 6  && (
                    <button onClick={handleIncreaseIndex}  type='button' className='position-relative my-5'>
                        <i style={{ fontSize: "60px", color: "#F44336" }} className="fa-solid fa-circle-arrow-right"></i>
                    </button>
            )}
            </div>

            <div className="d-flex justify-content-between">
{index > 0 && (
                    <button type='button' className='position-relative my-5'>
                        <i onClick={handleDecreaseIndex} style={{ fontSize: "60px", color: "#F44336",transform: "rotate(180deg)"}} className="fa-solid fa-circle-arrow-right"></i>
                    </button>
            )}
            </div>
</div>
</div>}
                
               


{/* Custom Fields Started */}
 {caseType && !smallLoader1 && index===2 &&
    <form className='row g-3 needs-validation'  onSubmit={handleConsentSubmit}>
    <div className="">

{ singleConsentData?.customFields?.map((custom,index)=>(
    <div key={index} className="col-md-12">
                    <label htmlFor="caseType" id='selectedField'  className="form-label">
                       {custom?.fieldName}
                    </label>
                    <select
                        className="form-control"
                        id="optionF"
                        required
                        name='caseType'
                        value={customFields[index]?.option?customFields[index]?.option:customOption}
                        onChange={(e) => handleCustomOptionChange(e, custom?.fieldName)}
                        >
                        <option value="">Select {custom?.fieldName}</option> 
                        {custom?.options?.map((option, index) => (
                            <option key={index} value={option?.name}>{option?.name?.charAt(0).toUpperCase() + option?.name?.slice(1)}</option>
                        ))}
                    </select>


                {customOption &&    <div className="col-md-12">
                    <div className="col-md-11 my-4">
  <div className="row">

 
<label htmlFor="created By" className="form-label">
                        {singleConsentData?.caseType}
                        </label>
<div className="col-md-7 height_of_quill">
<QuillEditor
            theme="snow"
            value={singleOptionData[index]?.description}
            readOnly={true}
            modules={{
                toolbar: false,
              }}
          />
<div className="">
{singleOptionData[index]?.imageUrl?.map((image,index)=>(


<img style={{height:"200px", width:"250px"}} alt='' key={index} src={image}/>


))}
</div>

</div>
<div className="col-md-2">
<label htmlFor="created By" className="form-label">
                        {singleConsentData?.caseType}
                        </label>

                        <div className="video-container">
          





<iframe width="380" height="225"
src={singleOptionData[index]?.videoUrl}
title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>




    </div>
</div>

</div>
</div>

                </div>}







                </div>
)) 
}


</div> 


{/* Question started */}

{index===2 &&<>
{ allQuestions && <div  className="col-md-12">
<h3 className='mt-3'>Questions</h3>
</div>
}


{allQuestions?.map((que, index) => (
                    <div key={index} className="col-md-12">
                        <label htmlFor={`ques-${index}`} className="form-label">
                            <b>Question {index + 1} </b>   {que}
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id={`ques-${index}`}
                            name='questions'
                            placeholder="Enter Your Answer"
                            value={inputValues[index] || ''} 
                            onChange={(e) => handleAnswerChange(e, index)} 
                            required
                        />
                    </div>
                ))}
<div className="  d-flex justify-content-between flex-row-reverse">
    <div className="d-flex justify-content-end">
{index >= 0 && index < 6  && (
                    <button type='submit' className='position-relative my-5'>
                        <i style={{ fontSize: "60px", color: "#F44336" }} className="fa-solid fa-circle-arrow-right"></i>
                    </button>
            )}
            </div>

            <div className="d-flex justify-content-between">
{index > 0 && (
                    <button type='button' className='position-relative my-5'>
                        <i onClick={handleDecreaseIndex} style={{ fontSize: "60px", color: "#F44336",transform: "rotate(180deg)"}} className="fa-solid fa-circle-arrow-right"></i>
                    </button>
            )}
            </div>
</div>

</>}
</form>
}




{index===3 && <h4 style={{color:"#771E99"}} className='fw-fw-semibold' >SUMMARY</h4>
}
{index===3 &&
<><div className='p-4' style={{background:"#E8E9EC",borderRadius:"30px"}} >

{caseType &&<div className="col-md-6 mb-3">
<label htmlFor="disease" className="form-label">
    Disease
</label>
<p  className="mb-0 " id='disease'>
    {caseType}
    </p>
</div>}

{customFields && <div >
        {customFields?.map((field, index) => (
            <div className="col-md-6" key={index}>
                <label htmlFor={`field-${index}`} className="form-label">
                    {field?.fieldName}
                </label>
                <p className="mb-0" id={`field-${index}`}>
                    {field?.option}
                </p>
            </div>
        ))}
    </div>}

    </div>
    <div className="  d-flex justify-content-between flex-row-reverse">
    <div className="d-flex justify-content-end">
{index >= 0 && index < 6  && (
                    <button onClick={handleIncreaseIndex}  type='button' className='position-relative my-5'>
                        <i style={{ fontSize: "60px", color: "#F44336" }} className="fa-solid fa-circle-arrow-right"></i>
                    </button>
            )}
            </div>

            <div className="d-flex justify-content-between">
{index > 0 && (
                    <button type='button' className='position-relative my-5'>
                        <i onClick={handleDecreaseIndex} style={{ fontSize: "60px", color: "#F44336",transform: "rotate(180deg)"}} className="fa-solid fa-circle-arrow-right"></i>
                    </button>
            )}
            </div>
</div>
</> 
    }

{/* Signature started */}


{index===5 &&<>
<div className="">
            <h2 className='text-center' >Preview Consent Form</h2>
                        </div>
                        
                            <div className="modal-body">
                                <div className="row mt-5 d-flex justify-content-between">

                               
                                <div className="col-lg-5 borderC mx-3 d-flex flex-column mb-5 justify-content-center ">
                        <label htmlFor="Pname" className="form-label">
                            Patient Name
                        </label>
                        <span className="form-label">
                            {consentData?.patientName}
                        </span>
                        
                    </div>
                    <div className="col-lg-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="patientId" className="form-label">
                        Case Type
                        </label>
                        <span className="form-label">
                    {caseType}            </span>
                        
                    </div>
</div>
                <div className="col-md-12">
<button
  type='button'
  className=" d-flex justify-content-center align-items-center btn bg-primary-color text-light  w-100"
  data-bs-toggle="modal"
  data-bs-target="#previewModal"
>
  <i className="fa-solid fa-file-signature me-2"></i>
  Preview Form

  
                               

                                 
</button>
                </div>
                <div className="  d-flex justify-content-between flex-row-reverse">
    <div className="d-flex justify-content-end">
{index >= 0 && index < 6  && (
                    <button onClick={handleIncreaseIndex}  type='button' className='position-relative my-5'>
                        <i style={{ fontSize: "60px", color: "#F44336" }} className="fa-solid fa-circle-arrow-right"></i>
                    </button>
            )}
            </div>

            <div className="d-flex justify-content-between">
{index > 0 && (
                    <button type='button' className='position-relative my-5'>
                        <i onClick={handleDecreaseIndex} style={{ fontSize: "60px", color: "#F44336",transform: "rotate(180deg)"}} className="fa-solid fa-circle-arrow-right"></i>
                    </button>
            )}
            </div>
</div>
</div>  
</>}





 <div className="modal fade" id="previewModal" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-fullscreen">
                        <div className="modal-content">
                        <div className="modal-header d-flex justify-content-between">
                        <h2 className='text-center' >Preview Consent Form</h2>
                            <button type="button" className="btn-close ms-auto p-4 " data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        
                            <div className="modal-body">
                                <div className="row d-flex justify-content-between">

                               
                                <div className="col-md-5 borderC mx-3 d-flex flex-column mb-5 justify-content-center ">
                        <label htmlFor="Pname" className="form-label">
                            Patient Name
                        </label>
                        <span className="form-label">
                            {consentData?.patientName}
                        </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="patientId" className="form-label">
                        Case Type
                        </label>
                        <span className="form-label">
                    {caseType}            </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="patientId" className="form-label">
                        Patient Id
                        </label>
                        <span className="form-label">
                        {consentData?.patientId}                      </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="adharCard" className="form-label">
                            Aadhar Number
                        </label>
                        <span className="form-label">
                        {consentData?.adharCard}
                        </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="gaurdianName" className="form-label">
                        Gaurdian Name
                        </label>
                        <span className="form-label">
                       {consentData?.gaurdianName}                       </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="gaurdianName" className="form-label">
                        Relation With Patient
                        </label>
                        <span className="form-label">
                       {consentData?.relation}                       </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="mobileNo" className="form-label">
                        Mobile Number
                        </label>
                        <span className="form-label">
                        {consentData?.mobileNo }                       </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="gaurdianName" className="form-label">
                        Gender
                        </label>
                        <span className="form-label">
                       {consentData?.gender}                       </span>
                        
                    </div>
                   
                   
                    
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="gaurdianName" className="form-label">
                        Address
                        </label>
                        <span className="form-label">
                       {consentData?.address}                       </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="gaurdianName" className="form-label">
                        Date Of Birth
                        </label>
                        <span className="form-label">
                       {consentData?.dob}                       </span>
                        
                    </div>

                    </div>
                    <div className="row px-3 d-flex justify-content-center">

                    
                    <div className="col-md-12   borderC mx-5  d-flex mb-5 flex-column justify-content-center ">
                    { singleConsentData?.customFields?.map((custom,index)=>(
    <div key={index} className="col-md-12">
                    <label htmlFor="caseType" className="form-label">
                       {customFields[index]?.fieldName} - 
                    </label>
                    
                    <span className="form-label">
                    {customFields[index]?.option}

                         </span>

                         {customFields[index]?.option &&   
                          <div className="col-md-12">
                    <div className="col-md-11 my-4">
  <div className="row">

 
<label htmlFor="created By" className="form-label">
                        {singleConsentData?.caseType}
                        </label>
<div className="col-md-7 height_of_quill">
<QuillEditor
            theme="snow"
            value={singleOptionData[index]?.description}
            readOnly={true} 
            modules={{
                toolbar: false, 
              }}
          />
<div className="">
{singleOptionData[index]?.imageUrl?.map((image,index)=>(


<img style={{height:"200px", width:"250px"}} alt='' key={index} src={image}/>


))}
</div>

</div>
<div className="col-md-2">
<label htmlFor="created By" className="form-label">
                        {singleConsentData?.caseType}
                        </label>

                        <div className="video-container">
           

             <iframe width="380" height="225"
src={singleOptionData[index]?.videoUrl} 
title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>



    
    </div>
</div>

</div>
</div>

                </div>}







                </div>
)) 
}
                        
                    </div>



                    <div  className="col-md-12">
<h3 className='mt-3 text-center'>Questions</h3>
</div>


{allQuestions?.map((que, index) => (
                    <div key={index} className="col-md-12 my-2">
                        <label htmlFor={`ques-${index}`} className="form-label">
                            <b>Question {index + 1} </b>   {que}
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id={`ques-${index}`}
                            name='questions'
                            placeholder="Enter Your Answer"
                            readOnly={true}
                            value={inputValues[index] || ''} 
                           
                        />
                       
                    </div>
                ))}



{/* <div className="col-md-10 borderC mx-3  d-flex flex-column mb-5 justify-content-center ">
                        <label htmlFor="caseType" className="form-label">
                             Surgen Signature
                        </label>
                        <img style={{height:"200px",width:"300px"}} src={surgenImageUrl} alt=''></img>

        
                        
                    </div>
<div className="col-md-10 borderC mx-3  d-flex  py-3 flex-column mb-5 justify-content-center ">
                        <label htmlFor="caseType" className="form-label">
                             Patient Signature
                        </label>
                        <img style={{height:"200px",width:"300px"}} src={imageUrl} alt=''></img>
                       
                        
                    </div>
                    <div className="col-md-10 borderC mx-3  d-flex  py-3 flex-column mb-5 justify-content-center ">
                        <label htmlFor="caseType" className="form-label">
                             Patient Video
                        </label>
   

<iframe width="380" height="225"
  src={videoUrlState}
  title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>



</div> */}
                    </div>
                    
                
                            </div>
                            <div className="modal-footer">
                                <button type="button" data-bs-dismiss="modal" className="btn btn-secondary"  >Close</button>
                            </div>
                        </div>
                    </div>
                </div> 




















          {index===6  &&      <form className='row g-3 needs-validation'  onSubmit={handleConsentSubmit}>
    <h4 className='fw-semibold' style={{color:"#771E99"}} >Sign and Submit</h4>
<div className="row mt-4 py-3" style={{border:"2px solid #C3C8CA", borderRadius:"30px"}}>
                <div className="col-md-6 my-2">
<button
  type='button'
  id="captureSurgeon"
  onClick={() => {
    document.getElementById('captureSurgeon').classList.remove('highlight');
}}
  className=" d-flex justify-content-center align-items-center btn bg-primary-color text-light p-5 w-100"
  data-bs-toggle="modal"
  data-bs-target="#uploadSurgenSignatureModal"
>
  <i className="fa-solid fa-file-signature me-2"></i>
  {surgenImageUrl ? 'Signature Uploaded' : 'Upload Surgeon Signature'}

  
                                {surgenLoader && <div  className="d-flex mx-3 justify-content-end align-items-center">
                                     <div style={{height:"20px",width:"20px"}} className="spinner-border text-white" role="status">

</div>
                                 </div>}

                                 
</button>
                </div>

                <div className="col-md-6 my-2">
                    <button type='button' 
                    id="capturePatient"
                    onClick={() => {
                        document.getElementById('capturePatient').classList.remove('highlight');
                    }}
                    className=" d-flex justify-content-center align-items-center btn bg-primary-color text-light p-5 w-100  " 
                    data-bs-toggle="modal"
                     data-bs-target="#uploadSignatureModal">
                        <i className="fa-solid fa-file-signature mx-2">
                        </i>
                        {imageUrl ? 'Signature Uploaded' : 'Upload Signature'}
                        {generalLoader && <div  className="d-flex mx-3 justify-content-end align-items-center">
                                     <div style={{height:"20px",width:"20px"}} className="spinner-border text-white" role="status">

</div>
                                 </div>}
                         </button>
                </div>

                <div className="col-md-12 my-2">
                    <button
                     onClick={() => {
                        document.getElementById('captureVideo').classList.remove('highlight');
                    }}
                    type="button" id="captureVideo" className="btn bg-primary-color text-light p-5 w-100  " data-bs-toggle="modal" data-bs-target="#uploadVideoModal"><i className="fa-solid fa-video"></i> {videoUrlState?'Captured':'Capture Consent Video'}</button>
                </div>
                
                </div>
                 <div className="col-12">
                    <button className="btn btn-success w-100">Submit</button>
                </div>

                <div className="  d-flex justify-content-between ">
   

            <div className="d-flex justify-content-between">
{index ===6  && (
                    <button type='button' className='position-relative my-5'>
                        <i onClick={handleDecreaseIndex} style={{ fontSize: "60px", color: "#F44336",transform: "rotate(180deg)"}} className="fa-solid fa-circle-arrow-right"></i>
                    </button>
            )}
            </div>
</div>
</form>}

                {/* ----modal--- */}

                <div className="modal fade" id="uploadSignatureModal" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-fullscreen">
                        <div className="modal-content">
                        <div className="modal-header">
                        <h2>Your Signature</h2>
                            <button type="button" className="btn-close ms-auto p-4 " data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        
                            <div className="modal-body">
                                <SignatureCanvas
                                    canvasProps={{width:1480,height:550, className: 'sigCanvas' }}
                                    ref={data => setSign(data)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClearSign} >Reset</button>
                                <button type="button" className="btn btn-main" data-bs-dismiss="modal" onClick={generateSign}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>


{/* Modal of surgen */}
   <div className="modal fade" id="uploadSurgenSignatureModal" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-fullscreen">
                        <div className="modal-content">
                        <div className="modal-header">
                        <h2>Your Signature</h2>
                            <button type="button" className="btn-close ms-auto p-4 " data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        
                            <div className="modal-body">
                               
                                <SignatureCanvas
                                    canvasProps={{width:1480,height:550, className: 'sigCanvas' }}
                                    ref={data => setSurgenSign(data)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClearSurgenSign} >Reset</button>
                                <button type="button" className="btn btn-main" data-bs-dismiss="modal" onClick={generateSurgenSign}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="uploadVideoModal" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-fullscreen">
               
                        <div className="modal-content">
                        <div className="modal-header d-flex justify-content-between">
                    <h3 className='text-center' >Tap start recording button to start recording</h3>
                            <button id='closeSaveVideo' type="button" className="btn-close ms-auto p-2 " data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                            {videoLoader &&
                                <div className="d-flex w-100 justify-content-center my-2 align-items-center">
                                    <Loader />
                                </div>
                            }
                            <div className="modal-body d-flex align-items-center ">
                                {activeRecordings?.map(recording => (
                                    <div key={recording?.id} >
                                     <video ref={recording?.webcamRef} autoPlay className={`videoPreview ${showPreview? 'd-none' : ''}`} />
                                        <h2 className={`text-center ${!showPreview? 'd-none' : ''}`}>Your Video Preview</h2>
                                        <video ref={recording?.previewRef} controls className={`videoPreview ${!showPreview? 'd-none' : ''}`} />
                                    </div>
                                ))}
                            </div>
                            <div className="modal-footer">
                            <div className="timer">
                            <div className="timer">
                        {recordingState && !showPreview ? (
                            `Recording Time: ${Math.floor(elapsedTime / 60)}:${elapsedTime % 60}`
                        ) : (
                            `Recorded Time: ${Math.floor(elapsedTime / 60)}:${elapsedTime % 60}`
                        )}
                    </div>                    </div>
                              
                                <button type="button" className="btn btn-secondary" onClick={handleClearVideo} >Reset</button>
                                <button type="button" disabled={showPreview} className="btn btn-main" onClick={startRecoding}>Start Recording </button>
                                <button type="button" disabled={elapsedTime<=0 || showPreview} className="btn btn-danger" onClick={stopRecoding}>Stop Recording </button>

                                <button
                                    type="button"
                                    className="btn btn-success"
                                    data-bs-dismiss={ loading ? 'modal' : ''}
                                    onClick={saveRecoding}
                                    disabled={!recordedState}
                                >
                                    Save Recording
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

               



                {/* <div className="col-md-12">
<button
  type='button'
  className=" d-flex justify-content-center align-items-center btn bg-primary-color text-light  w-100"
  data-bs-toggle="modal"
  data-bs-target="#previewModal"
>
  <i className="fa-solid fa-file-signature me-2"></i>
  Preview Form

  
                               

                                 
</button>
                </div> */}

{/* <div className="d-flex justify-content-between flex-row-reverse">
    <div className="d-flex justify-content-end">
{index >= 0 && index < 6  && (
                    <button type='button' className='position-relative my-5'>
                        <i onClick={handleIncreaseIndex} style={{ fontSize: "60px", color: "#F44336" }} className="fa-solid fa-circle-arrow-right"></i>
                    </button>
            )}
            </div>

            <div className="d-flex justify-content-between">
{index > 0 && (
                    <button type='button' className='position-relative my-5'>
                        <i onClick={handleDecreaseIndex} style={{ fontSize: "60px", color: "#F44336",transform: "rotate(180deg)"}} className="fa-solid fa-circle-arrow-right"></i>
                    </button>
            )}
            </div>
</div> */}

                {/* <div className="col-12">
                    <button className="btn btn-success w-100">Submit</button>
                </div> */}
          
        </div>}
        </>
    )
}

export default ConsentForm
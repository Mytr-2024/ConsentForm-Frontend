
import { useEffect, useState } from 'react'
import './Consent.css'
import { getApi } from '../../helpers/requestHelpers'
import { Link, useParams } from 'react-router-dom'
import Loader from '../../components/loader/Loader'
import { AreaTop } from '../../components'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
import  { useRef } from 'react';
import { format } from "date-fns";
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import QuillEditor from "react-quill";

export default function ViewConsent() {
      const [htmlStart, setHtmlStart] = useState()
    const [singleConsentData, setSingleConsentData] = useState()
    const [loader, setLoader] = useState(true)
    const {_id}=useParams()

    const getConsentData=async()=>{
      try {
        setLoader(true)
        let res=   await getApi("get",`/api/consent/consentById?consentId=${_id}`)
        setSingleConsentData(res?.data?.consent)
        handleCaseTypeChange(res?.data?.consent?.caseType)
        setCaseType(res?.data?.consent?.caseType)
        // const rest = await getApi("get", `/api/template/questionsByCaseType?caseType=${res?.data?.consent?.caseType}`);
        // setAllQuestions(rest?.data?.questions)
        // // const temp = await getApi("get", `/api/template/getTemplateByCaseType?caseType=${res?.data?.consent?.caseType}`);
        // setValue(temp?.data?.deltaForm)
        // var cfg = {};
        // var converter = new QuillDeltaToHtmlConverter(temp?.data?.deltaForm?.ops, cfg);
        //  setHtmlStart(converter.convert()) 
        setLoader(false)
      } catch (error) {

        console.log(error)
        setLoader(false)
      }
    }

    useEffect(() => {
        getConsentData();
    }, [])

    const [value, setValue] = useState("");
    const [caseType, setCaseType] = useState()
    const [allQuestions, setAllQuestions] = useState()
    const reportemplateRef=useRef(null);

const prindPdf = async () => {
    setLoader(true);
    const input = reportemplateRef.current;
    if (!input) {
      console.error("The report template reference is not set.");
      setLoader(false);
      return;
    }
    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        allowTaint: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('document.pdf');
      setLoader(false);
    } catch (error) {
      console.error("Error generating PDF", error.message, error.stack);
      setLoader(false);
    }
  };

const [viewData, setViewData] = useState()
const handleCaseTypeChange = async (caseType) => {
        // const temp = await getApi("get", `/api/template/getTemplateByCaseType?caseType=${caseType}`);
        // console.log(temp)
        // setValue(temp?.data?.deltaForm)
        // setViewData(temp?.data)
    }

  return (
    <>
      {loader &&
   <div className="d-flex w-100 justify-content-center align-items-center">
       <Loader/>
   </div>
}
  
   {!loader && 
    <div className="content-area" ref={reportemplateRef}>
      <AreaTop title={`Consent Form - ${singleConsentData?.patientName}`}/>
   <div    className="container consentForm px-0 py-5 d-flex  flex-wrap justify-content-center align-items-center">
        <div className="col-md-5 borderC mx-3 d-flex flex-column mb-5 justify-content-center ">
                        <label htmlFor="Pname" className="form-label">
                            Patient Name
                        </label>
                        <span className="form-label">
                            {singleConsentData?.patientName}
                        </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="patientId" className="form-label">
                        Patient Id
                        </label>
                        <span className="form-label">
                        {singleConsentData?.patientId}                      </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="adharCard" className="form-label">
                            Aadhar Number
                        </label>
                        <span className="form-label">
                        {singleConsentData?.adharCard}
                        </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="gaurdianName" className="form-label">
                        Gaurdian Name
                        </label>
                        <span className="form-label">
                       {singleConsentData?.gaurdianName}                       </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="gaurdianName" className="form-label">
                        Relation With Patient
                        </label>
                        <span className="form-label">
                       {singleConsentData?.relation}                       </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="gaurdianName" className="form-label">
                        Address
                        </label>
                        <span className="form-label">
                       {singleConsentData?.address}                       </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="gaurdianName" className="form-label">
                        Date Of Birth
                        </label>
                        <span className="form-label">
                       {singleConsentData?.dob}                       </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="gaurdianName" className="form-label">
                        Gender
                        </label>
                        <span className="form-label">
                       {singleConsentData?.gender}                       </span>
                        
                    </div>
                
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="mobileNo" className="form-label">
                        Mobile Number
                        </label>
                        <span className="form-label">
                        {singleConsentData?.mobileNo }                       </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="createdAt" className="form-label">
                        Created At
                        </label>
                        <span className="form-label">
                       {format(new Date(singleConsentData?.createdAt), "MM/dd/yyyy")}                    </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="updated At" className="form-label">
                        Updated At
                        </label>
                        <span className="form-label">
                        {format(new Date(singleConsentData?.updatedAt), "MM/dd/yyyy")} 
                      
                                              </span>
                        
                    </div>
                   
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="created By" className="form-label">
                        Created By
                        </label>
                        <span className="form-label">
                        {singleConsentData?.createdBy}                        </span>
                        
                    </div>
                    {/* <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="updated By" className="form-label">
                        Updated By
                        </label>
                        <span className="form-label">
                        {singleConsentData?.updatedBy?singleConsentData?.updatedBy:"Unknown"}                       </span>
                        
                    </div> */}

                  {singleConsentData?.VideoUrl &&  <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="video" className="form-label">
                        Video
                        </label>
                        <span className="form-label d-flex justify-content-center mt-2">
                            <video   controls={true} style={{width:"280px",height:"200px"}} src={singleConsentData?.VideoUrl}>

                            </video>

                                                </span>
                        
                    </div>}


                 {singleConsentData?.patientSignatureUrl &&   <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="signature" className="form-label">
                        Signature
                        </label>
                        <span className="form-label d-flex justify-content-center">
                        <img style={{maxWidth:"280px",height:"200px"}} src={singleConsentData?.patientSignatureUrl} alt="Image Missing" />
                                             </span>
                        
                    </div>}


                   {singleConsentData?.caseType && <div className="col-md-10 borderC mx-3  d-flex flex-column mb-5 justify-content-center ">
                        <label htmlFor="caseType" className="form-label">
                            Case Type
                        </label>
                        <span className="form-label">
                        {singleConsentData?.caseType}
                        </span>
                        
                    </div>}

                  {singleConsentData?.surgeonSignatureUrl &&  <div className="col-md-10 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="signature" className="form-label">
                        Signature
                        </label>
                        <span className="form-label d-flex justify-content-center">
                        <img style={{maxWidth:"280px",height:"200px"}} src={singleConsentData?.surgeonSignatureUrl} alt="" />
                                             </span>
                        
                    </div>}


{value &&  <div className="col-md-10">
                    <div className="col-md-11 my-4">
  <div className="row">

 
<label htmlFor="created By" className="form-label">
                        {viewData?.caseType}
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
{viewData?.imageUrl?.map((image,index)=>(


<img style={{height:"200px", width:"250px"}} alt='' key={index} src={image}/>


))}
</div>

</div>
<div className="col-md-2">
<label htmlFor="created By" className="form-label">
                        {viewData?.caseType}
                        </label>

                        <div className="video-container">
                      
<iframe width="380" height="225"
src={viewData?.videoUrl}
  title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


      
    </div>
</div>

</div>
</div>

{viewData?.faqs && <div className="col-md-12 my-4">
<div className="accordion" id="accordionExample">



 {viewData?.faqs?.map((faq,index)=>(
  <div key={index} className="accordion-item">
    <h2 className="accordion-header">
      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#faq-${index}`} aria-expanded="true" aria-controls="collapseOne">
        {faq?.title}
      </button>
    </h2>
    <div id={`faq-${index}`} className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div className="accordion-body">
      <div className="row">

 
{/* <label htmlFor="created By" className="form-label">
                        {faq?.caseType}
                        </label> */}
<div className="col-md-7 ">
<QuillEditor
            theme="snow"
            value={faq?.description}
            readOnly={true} // Set readOnly to true to disable editing
            modules={{
                toolbar: false, // Hide the toolbar
              }}
          />
<div className="d-flex justify-content-start">
{faq?.imageUrl?.map((image,index)=>(


<img  className='object-fit-contain my-2' style={{height:"200px", width:"50vw"}} alt='' key={index} src={image}/>


))}
</div>

</div>
<div className="col-md-2">
<label htmlFor="created By" className="form-label">
                        {viewData?.caseType}
                        </label>

                        <div className="video-container">
   
 
                        {/* <iframe
  width="391" 
  height="220"
  src={faq?.videoUrl}
  frameborder="0" 
  autoPlay={false}
  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>  
</iframe> */}


<iframe width="300" height="205"
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
</div>}
                </div>}





                {viewData?.customFields?.length >= 1 && (
  <div className="col-md-10 w-100 px-2 px-sm-3 px-md-5 px-lg-5 mt-3">
    <h3 className="text-center">Custom Field's</h3>
  </div>
)}

{viewData?.customFields && <div className="col-md-10">


{viewData?.customFields?.map((custom, index) => (
  <div key={index} className="col-md-12">
    <label htmlFor={`customField_${index}`} className="form-label">
      {custom?.fieldName}
    </label>
    {custom?.options?.map((option, optionIndex) => (
      <div key={optionIndex} className="col-md-12">
        <h5 className="form-control" id={`customOption_${index}_${optionIndex}`}>
          {option?.name}
        </h5>

        <div className="col-md-12">
          <div className="col-md-11 my-4">
            <div className="row">
              <label htmlFor={`description_${index}_${optionIndex}`} className="form-label">
                Description
              </label>
              <div className="col-md-7 height_of_quill">
                <QuillEditor
                  theme="snow"
                  value={option?.description}
                  readOnly={true} // Set readOnly to true to disable editing
                  modules={{
                    toolbar: false, // Hide the toolbar
                  }}
                />
                <div className="">
                  {option?.imageUrl?.map((image, imgIndex) => (
                    <img
                      style={{ height: "200px", width: "250px" }}
                      alt=""
                      key={imgIndex}
                      src={image}
                    />
                  ))}
                </div>
              </div>
              <div className="col-md-2">
                <label htmlFor={`video_${index}_${optionIndex}`} className="form-label">
                  Video
                </label>
                <div className="video-container">
                  <iframe
                    width="380"
                    height="225"
                    src={option?.videoUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
))}
     </div>  }

{ singleConsentData?.question && <>

<div  className="col-md-10 w-100    px-2 px-sm-3 px-md-5 px-lg-5 mt-3">
<h3>Question's</h3>
</div>       

<div className='w-100' >
{singleConsentData?.question ? (
  Object.entries(singleConsentData.question).map(([key, value], index) => (
    <div key={index} className="col-md-10 w-100 px-2 px-sm-3 px-md-5 px-lg-5 mt-3">
      <label htmlFor={`ques-${index}`} className="form-label w-100">
        <b>Question {index + 1} </b> {key}
      </label>
      <input
        type="text"
        className="form-control"
        id={`ques-${index}`}
        name='questions'
        value={value}
        required
        readOnly
      />
    </div>
  ))
) : (
  <p>No questions available</p>
)}

        </div>
        </>
       }



</div>
<div className="col-md-10 w-100  my-3  px-2 px-sm-3 px-md-5 px-lg-5 ">
    
{!singleConsentData?.surgeonSignatureUrl &&    <Link to={`/continueConsent/${_id}`} className='btn btn-warning text-white fw-semibold w-100 mt-3' type="button" >Continue This Form</Link>
}    <button className='btn btn-primary w-100 mt-3' type="button" onClick={prindPdf} >Print</button>
    </div>
</div>

 }
 
 </>

  )
}

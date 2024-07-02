
export default function CreateIssue() {
  return (
    <>


<div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
<div className="mb-3">
  <label htmlFor="exampleFormControlTextarea1" className="form-label">Explain Your Issue</label>
  <textarea  className="form-control shadow-none " id="exampleFormControlTextarea1" rows="3"></textarea>
</div>


<div className="mb-3">
  <label htmlFor="formFile" className="form-label">Default file input example</label>
  <input className="form-control" type="file" id="formFile"/>
</div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-danger">Rise Issue</button>
      </div>
    </div>
  </div>
</div>
    </>
  )
}

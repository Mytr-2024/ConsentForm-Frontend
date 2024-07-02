import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "./layout/BaseLayout";
import { Dashboard, PageNotFound} from "./screens";
import {Login} from "./screens"
import {CreateTemplate} from "./screens"
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min';
import PrivateComponent from './middlewares/PrivateComponent'
import ConsentList from "./screens/consent/ConsentList";
import ViewConsent from "./screens/consent/ViewConsent";
import EditConsent from "./screens/consent/EditConsent";
import TemplateList from "./screens/Create-template/TemplateList";
import ViewTemplate from "./screens/Create-template/ViewTemplate";
import EditTemplate from "./screens/Create-template/EditTemplate";
import CreateAdmin from "./screens/admin/CreateAdmin";
import ViewAdmin from "./screens/admin/ViewAdmin";
import EditAdmin from "./screens/admin/EditAdmin";
import {ValidSuperAdmin} from './middlewares/ValidSuperAdmin'
import Stats from "./screens/stats/Stats";
import { IsLoggedIn } from "./middlewares/IsLoggedIn";
import ContinueConsent from "./components/contineConsent/ContinueConsent";
import CreateIssue from "./components/issue/CreateIssue";
import IssueList from "./components/issue/IssueList";
import ViewIssue from "./components/issue/ViewIssue";
import EditIssue from "./components/issue/EditIssue";

function App() {
  

  

  return (
    <>
      <Router>
        <Routes>
        <Route path="/" element={
          <IsLoggedIn>
          <Login/>
          </IsLoggedIn>
          }/>
          <Route element={<BaseLayout />}>
            <Route path="/*" element={<PageNotFound />} />
          </Route>

          <Route element={<PrivateComponent/>}> 
          <Route element={<BaseLayout />}>
            <Route path="/das" element={<Dashboard />} />
            <Route path="/consentList" element={<ConsentList />} />
            {/* <Route path="/stats" element={<Stats />} /> */}
            <Route path="/stats/:email" element={<Stats />} />
            <Route path="/viewConsent/:_id" element={<ViewConsent />} />
            <Route path="/editConsent/:_id" element={<EditConsent />} />
            <Route path="/editAdmin/:email" element={<EditAdmin />} />
            <Route path="/continueConsent/:id" element={<ContinueConsent />} />
            <Route path="/createIssue" element={<CreateIssue />} />
            {/* <Route path="/create-template" element={<CreateTemplate/>} /> */}
            {/* <Route path="/templateList" element={<TemplateList/>} /> */}
            {/* <Route path="/viewTemplate/:_id" element={<ViewTemplate/>} /> */}
            {/* <Route path="/editTemplate/:_id" element={<EditTemplate/>} /> */}
            {/* <Route path="/createAdmin" element={<CreateAdmin/>} /> */}
            {/* <Route path="/viewAdmin" element={<ViewAdmin/>} /> */}
          


          <Route
              path={'/create-template'}
              element={
                <ValidSuperAdmin>
                  {<CreateTemplate/>}
                </ValidSuperAdmin>}
              
              exact={true}
            />
          <Route
              path={'/templateList'}
              element={
                <ValidSuperAdmin>
                  {<TemplateList/>}
                </ValidSuperAdmin>}
              
              exact={true}
            />
          
          <Route
              path={'/viewTemplate/:_id'}
              element={
                <ValidSuperAdmin>
                  {<ViewTemplate/>}
                </ValidSuperAdmin>}
              
              exact={true}
            />
          <Route
              path={'/editTemplate/:_id'}
              element={
                <ValidSuperAdmin>
                  {<EditTemplate/>}
                </ValidSuperAdmin>}
              
              exact={true}
            />
          <Route
              path={'/createAdmin'}
              element={
                <ValidSuperAdmin>
                  {<CreateAdmin/>}
                </ValidSuperAdmin>}
              
              exact={true}
            />
          <Route
              path={'/viewAdmin'}
              element={
                <ValidSuperAdmin>
                  {<ViewAdmin/>}
                </ValidSuperAdmin>}
              
              exact={true}
            />

<Route
              path={'/issues'}
              element={
                <ValidSuperAdmin>
                  {<IssueList/>}
                </ValidSuperAdmin>}
              
              exact={true}
            />
<Route
              path={`/viewIssue/:id`}
              element={
                <ValidSuperAdmin>
                  {<ViewIssue/>}
                </ValidSuperAdmin>}
              
              exact={true}
            />
<Route
              path={`/editIssue/:id`}
              element={
                <ValidSuperAdmin>
                  {<EditIssue/>}
                </ValidSuperAdmin>}
              
              exact={true}
            />

</Route>

          </Route>

        </Routes>
      </Router>
    </>
  );
}

export default App;

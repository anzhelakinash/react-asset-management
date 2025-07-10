import { Navigate, createBrowserRouter } from "react-router-dom";
import LayoutDefault from "../views/layouts/LayoutDefault";
import HomeView from "../components/pages/Home/HomeView";
import FileUpload from "../components/pages/FileUploadView";
import AssetsView from "../components/pages/Assets/AssetsView";
import PerformanceView from "../components/pages/Performance/PerformanceView";
import StressScenarioView from "../components/pages/RiskAssessment/RiskAssessmentView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/main/home" />,
  },
  {
    path: "/main",
    element: <LayoutDefault />,
    children: [
      {
        path: "home",
        element: <HomeView title="Home" />,
      },
      {
        path: "assets",
        element: <AssetsView title="Assets" />,
      },
      {
        path: "performance",
        element: <PerformanceView title="Performance" />,
      },
      {
        path: "stress-scenarios",
        element: <StressScenarioView title="Stress Scenarios" />,
      },
      {
        path: "data-management",
        element: <FileUpload title="Data Management" />,
      },
    ],
  }

]);

export default router;

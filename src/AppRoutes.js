import { ErrorBoundary } from "react-error-boundary";
import FilmsList from "./components/FilmsList";
import FilmUpload from "./components/FilmUpload";
import Player from "./components/Player";
import SignInLandingComponent from "./components/Account/SignInLandingComponent";
import ProtectedComponent from "./components/Routes/ProtectedComponent";
import AuthErrorComponent from "./components/Account/AuthError";
import FilmEditor from "./components/FilmEditor";
import LogoutComponent from "./components/Account/LogoutComponent";
import UsersList from "./components/UsersList";
import StripeOnboardingReturn from "./components/Stripe/StripeOnboardingReturn";
import StripeProductsDashboardComponent from "./components/Stripe//Dashboard/StripeProductsDashboard";
import SubscribeComponent from "./components/Stripe/Subscribe/SubscribeComponent";
import SuccessComponent from "./components/Stripe/Subscribe/SuccessComponent";
import CancelComponent from "./components/Stripe/Subscribe/CancelComponent";
import AboutComponent from "./components/About/AboutComponent";
import AboutEditorComponent from "./components/About/AboutEditorComponent";
import RegulationsComponent from "./components/Regulations/RegulationsComponent";
import PrivacyPolicyComponent from "./components/PrivacyPolicy/PrivacyPolicyComponent";
import RegulationsEditorComponent from "./components/Regulations/RegulationsEditorComponent";
import PrivacyPolicyEditorComponent from "./components/PrivacyPolicy/PrivacyPolicyEditorComponent";

function fallbackRender({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

const AppRoutes = [
  {
    index: true,
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <AboutComponent />
      </ErrorBoundary>
    ),
  },
  {
    path: "/regulations",
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <RegulationsComponent />
      </ErrorBoundary>
    ),
  },
  {
    path: "/regulationsEditor",
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <ProtectedComponent accessFor="ADMIN">
          <RegulationsEditorComponent />
        </ProtectedComponent>
      </ErrorBoundary>
    ),
  },
  {
    path: "/privacy-policy",
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <PrivacyPolicyComponent />
      </ErrorBoundary>
    ),
  },
  {
    path: "/privacyPolicyEditor",
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <ProtectedComponent accessFor="ADMIN">
          <PrivacyPolicyEditorComponent />
        </ProtectedComponent>
      </ErrorBoundary>
    ),
  },
  {
    path: "/aboutEditor",
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <ProtectedComponent accessFor="ADMIN">
          <AboutEditorComponent />
        </ProtectedComponent>
      </ErrorBoundary>
    ),
  },
  {
    path: "/success",
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <SuccessComponent usingCoolingOffPeriod={false} />
      </ErrorBoundary>
    ),
  },
  {
    path: "/ordersuccess",
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <SuccessComponent usingCoolingOffPeriod={true} />
      </ErrorBoundary>
    ),
  },
  {
    path: "/cancel",
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <ProtectedComponent>
          <CancelComponent />
        </ProtectedComponent>
      </ErrorBoundary>
    ),
  },
  {
    path: "/subscribe",
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <SubscribeComponent />
      </ErrorBoundary>
    ),
  },
  {
    path: "/stripeOnboardingReturn",
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <ProtectedComponent accessFor="ADMIN">
          <StripeOnboardingReturn />
        </ProtectedComponent>
      </ErrorBoundary>
    ),
  },
  {
    path: "/stripeProductsDashboard",
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <ProtectedComponent accessFor="ADMIN">
          <StripeProductsDashboardComponent />
        </ProtectedComponent>
      </ErrorBoundary>
    ),
  },
  {
    path: "/users-list",
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <ProtectedComponent accessFor="ADMIN">
          <UsersList />
        </ProtectedComponent>
      </ErrorBoundary>
    ),
  },
  {
    path: "/films-list",
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <FilmsList />
      </ErrorBoundary>
    ),
  },
  {
    path: "/player/:id",
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <Player />
      </ErrorBoundary>
    ),
  },
  {
    path: "/editor/:id",
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <ProtectedComponent accessFor="ADMIN">
          <FilmEditor />
        </ProtectedComponent>
      </ErrorBoundary>
    ),
  },
  {
    path: "/films-upload",
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <ProtectedComponent accessFor="ADMIN">
          <FilmUpload />
        </ProtectedComponent>
      </ErrorBoundary>
    ),
  },
  {
    path: "/logout",
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <LogoutComponent />
      </ErrorBoundary>
    ),
  },
  {
    path: "signin-oidc",
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <SignInLandingComponent />
      </ErrorBoundary>
    ),
  },
  {
    path: "auth-error",
    element: <AuthErrorComponent />,
  },
];

export default AppRoutes;

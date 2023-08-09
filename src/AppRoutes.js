import { ErrorBoundary } from "react-error-boundary";
import FilmsList from "./components/FilmsList";
import FilmUpload from "./components/FilmUpload";
import { Home } from "./components/Home";
import Player from "./components/Player";
import SignInLandingComponent from "./components/Account/SignInLandingComponent";
import ProtectedComponent from "./components/Routes/ProtectedComponent";
import AuthErrorComponent from "./components/Account/AuthError";
import FilmEditor from "./components/FilmEditor";
import LogoutComponent from "./components/Account/LogoutComponent";
import UsersList from "./components/UsersList";
import StripeOnboardingReturn from "./components/Stripe/StripeOnboardingReturn";

function fallbackRender({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
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
    protected: false,
    element: (
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          console.log("ErrorBoundary onReset: ", details);
        }}
      >
        <Home />
      </ErrorBoundary>
    ),
  },
  {
    path: "/stripeOnboardingReturn",
    protected: true,
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
    path: "/users-list",
    protected: true,
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
    protected: false,
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
    protected: false,
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
    protected: true,
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
    protected: true,
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
    protected: true,
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
    protected: false,
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

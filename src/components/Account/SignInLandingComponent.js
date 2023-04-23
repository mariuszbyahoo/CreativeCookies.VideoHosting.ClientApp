import { useParams } from "react-router-dom";

const SignInLandingComponent = (props) => {
  const params = useParams();
  // useParams returns no changes?!
  debugger;
  return (
    <>
      <h4>This is SignIn landing component</h4>
      {/* Get the code and state from url and then compare state with the stored value + perform other actions specified in RFC6749 */}
      {Object.entries(params).map((v, i) => (
        <h5>
          Value: {v}, Index: {i}
        </h5>
      ))}
    </>
  );
};

export default SignInLandingComponent;

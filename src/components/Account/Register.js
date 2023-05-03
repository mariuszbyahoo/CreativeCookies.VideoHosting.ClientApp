const RegisterComponent = (props) => {
  const registerUrl = `https://${process.env.REACT_APP_API_ADDRESS}/identity/account/register`;

  return (
    <a href={registerUrl} className={props.className}>
      Register
    </a>
  );
};

export default RegisterComponent;

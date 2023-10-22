import { CircularProgress, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";

const RegisterComponent = (props) => {
  const registerUrl = `https://${process.env.REACT_APP_API_ADDRESS}/identity/account/register`;
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  const handleRegisterClick = (event) => {
    event.preventDefault();
    setIsDialogOpened(true);
    window.location = registerUrl;
  };

  return (
    <>
      <a
        href={registerUrl}
        className={props.className}
        onClick={handleRegisterClick}
      >
        Register
      </a>
      <Dialog open={isDialogOpened}>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegisterComponent;

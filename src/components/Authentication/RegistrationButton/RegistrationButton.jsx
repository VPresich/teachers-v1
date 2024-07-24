import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../../../redux/auth/operations";
import ModalWrapper from "../../UI/ModalWrapper/ModalWrapper";
import RegisterForm from "../Forms/RegisterForm/RegisterForm";
import {
  errNotify,
  successNotify,
} from "../../../auxiliary/notification/notification";
import { ERR_REGISTRATION, SUCCESS_REGISTRATION } from "../Forms/constants";
import css from "./RegistrationButton.module.css";

const RegistrationButton = () => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const dispatch = useDispatch();

  const handleShowRegister = () => {
    setShowRegisterForm(true);
  };

  const handleCloseRegister = () => {
    setShowRegisterForm(false);
  };

  const handleRegistration = (values) => {
    console.log("Values", values);
    dispatch(register(values))
      .unwrap()
      .then(() => {
        successNotify(SUCCESS_REGISTRATION);
        setShowRegisterForm(false);
      })
      .catch(() => {
        errNotify(ERR_REGISTRATION);
      });
  };

  return (
    <>
      <button className={css.btn} onClick={handleShowRegister}>
        Registration
      </button>

      {showRegisterForm && (
        <ModalWrapper onClose={handleCloseRegister}>
          <RegisterForm handleRegistration={handleRegistration} />
        </ModalWrapper>
      )}
    </>
  );
};

export default RegistrationButton;

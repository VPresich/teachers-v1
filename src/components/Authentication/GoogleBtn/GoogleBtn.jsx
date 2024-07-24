import { useDispatch } from "react-redux";
import { logInWithGoogle } from "../../../redux/auth/operations";
import css from "./GoogleBtn.module.css";
import googleIcon from "../../../assets/img/google/google-icon.svg";
import {
  successNotify,
  errNotify,
} from "../../../auxiliary/notification/notification";
import { SUCCESS_LOGIN, ERR_LOGIN } from "../Forms/constants";

// export default function GoogleBtn() {
//   return (
//     <a href={`${BaseURL}/users/google`} className={css.btn}>
//       <span>
//         <img src={googleIcon} alt="google icon" className={css.icon} />
//       </span>
//     </a>
//   );
// }

export default function GoogleBtn() {
  const dispatch = useDispatch();

  const handleGoogleRegister = () => {
    dispatch(logInWithGoogle())
      .unwrap()
      .then(() => {
        successNotify(SUCCESS_LOGIN);
      })
      .catch(() => {
        errNotify(ERR_LOGIN);
      });
  };
  return (
    <button className={css.btn} onClick={handleGoogleRegister}>
      <span>
        <img src={googleIcon} alt="google icon" className={css.icon} />
      </span>
    </button>
  );
}

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import css from "./Input.module.css";

const Input = ({ name, onChange, value, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    formState: { errors },
  } = useFormContext();

  const handlePassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={css.wrapper}>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={clsx(css.input, type === "password" && css.password)}
        type={inputType}
      />
      {type === "password" && (
        <span onClick={handlePassword} className={css.eyeIcon}>
          {showPassword ? (
            <FaEye className={css.icon} />
          ) : (
            <FaEyeSlash className={css.icon} />
          )}
        </span>
      )}
      {errors[name] && (
        <span className={css.error}>{errors[name].message}</span>
      )}
    </div>
  );
};

export default Input;

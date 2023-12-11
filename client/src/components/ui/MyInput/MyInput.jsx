import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import s from "./style.module.css";

export function MyInput({ value, onChange, id, label, isPassword = false }) {
  if (isPassword) {
    return (
      <div className="p-float-label">
        <Password
          toggleMask
          feedback={false}
          className={s.input}
          value={value}
          onChange={onChange}
        />
        <label>{label}</label>
      </div>
    );
  }

  return (
    <div className="p-float-label">
      <InputText id={id} className={s.input} value={value} onChange={onChange} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

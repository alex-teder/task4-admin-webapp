import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { PATHS } from "/src/router";
import { LayoutWrapper } from "/src/components/LayoutWrapper";
import { MyInput } from "/src/components/ui/MyInput/MyInput";
import s from "./style.module.css";
import { apiLogIn } from "/src/api";
import { saveUser } from "/src/utils/storageUtils";
import { isLoginFormValid } from "/src/utils/validation";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handler = (fn) => (e) => fn(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoginFormValid({ email, password })) {
      setError("All fields are required!");
      return;
    }
    setError(null);
    const { data, error } = await apiLogIn(email, password);
    if (error) {
      setError(error);
    } else {
      saveUser({ ...data, email });
      navigate(PATHS.USERS);
    }
  };

  return (
    <LayoutWrapper centered>
      <Card title="Log in">
        <form className={s.form} onSubmit={handleSubmit}>
          <MyInput id="email" label="Email" value={email} onChange={handler(setEmail)} />
          <MyInput label="Password" isPassword value={password} onChange={handler(setPassword)} />
          <Button label="LOG IN" type="submit" />

          {error && <Message severity="error" text={error} />}
        </form>
      </Card>

      <p>
        No account yet? <Link to={PATHS.SIGNUP}>Sign up!</Link>
      </p>
    </LayoutWrapper>
  );
}

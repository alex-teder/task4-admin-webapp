import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { PATHS } from "/src/router";
import { LayoutWrapper } from "/src/components/LayoutWrapper";
import { MyInput } from "/src/components/ui/MyInput";
import s from "./style.module.css";
import { apiSignUp } from "/src/api";
import { saveUser } from "/src/utils/storageUtils";
import { isSignupFormValid } from "/src/utils/validation";

export function SignupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handler = (fn) => (e) => fn(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSignupFormValid({ username, email, password })) {
      setError("All fields are required!");
      return;
    }
    setIsLoading(true);
    setError(null);
    const { data, error } = await apiSignUp(username, email, password);
    if (error) {
      setIsLoading(false);
      setError(error);
    } else {
      saveUser({ ...data, email });
      navigate(PATHS.USERS);
    }
  };

  return (
    <LayoutWrapper centered>
      <Card title="Sign up">
        <form className={s.form} onSubmit={handleSubmit}>
          <MyInput
            id="username"
            label="Username"
            value={username}
            onChange={handler(setUsername)}
          />
          <MyInput id="email" label="Email" value={email} onChange={handler(setEmail)} />
          <MyInput label="Password" isPassword value={password} onChange={handler(setPassword)} />
          <Button label="SIGN UP" type="submit" loading={isLoading} />

          {error && <Message severity="error" text={error} />}
        </form>
      </Card>

      <p>
        Already have an account? <Link to={PATHS.LOGIN}>Log in!</Link>
      </p>
    </LayoutWrapper>
  );
}

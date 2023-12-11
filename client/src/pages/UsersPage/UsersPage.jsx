import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { LayoutWrapper } from "/src/components/LayoutWrapper";
import { MainToolbar } from "/src/components/MainToolbar";
import { apiGetUsers, apiBlockUsers, apiUnblockUsers, apiDeleteUsers } from "/src/api";
import { getUser, saveUser } from "/src/utils/storageUtils";
import { PATHS } from "/src/router";
import { StatusFooter } from "/src/components/StatusFooter";
import { MainTable } from "/src/components/MainTable";

const STATUS = {
  IDLE: "idle",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
  LOADING: "loading",
};

export function UsersPage() {
  const navigate = useNavigate();
  const [selection, setSelection] = useState([]);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (status === STATUS.IDLE) {
      setStatus(STATUS.LOADING);
      apiGetUsers(getUser().token)
        .then(({ data, error }) => {
          if (error) {
            setErrorMsg(error);
            setStatus(STATUS.FAILED);
          } else {
            setStatus(STATUS.SUCCEEDED);
            setUsers(data);
          }
        })
        .catch((err) => {
          setStatus(STATUS.FAILED);
          console.warn(err.message);
        });
    }
  }, [status]);

  const handleBlock = async () => {
    setStatus(STATUS.LOADING);
    const ids = selection.map(({ _id }) => _id);
    await apiBlockUsers(getUser().token, ids);
    if (selection.some(({ email }) => email === getUser().email)) {
      saveUser({});
      navigate(PATHS.LOGIN);
    }
    setSelection([]);
    setStatus(STATUS.IDLE);
  };

  const handleUnblock = async () => {
    setStatus(STATUS.LOADING);
    const ids = selection.map(({ _id }) => _id);
    await apiUnblockUsers(getUser().token, ids);
    setSelection([]);
    setStatus(STATUS.IDLE);
  };

  const handleDelete = async () => {
    setStatus(STATUS.LOADING);
    const ids = selection.map(({ _id }) => _id);
    await apiDeleteUsers(getUser().token, ids);
    if (selection.some(({ email }) => email === getUser().email)) {
      saveUser(null);
      navigate(PATHS.LOGIN);
    }
    setSelection([]);
    setStatus(STATUS.IDLE);
  };

  const handleLogout = () => {
    saveUser(null);
    navigate(PATHS.LOGIN);
  };

  return (
    <LayoutWrapper>
      <Card>
        {errorMsg && (
          <Message
            style={{ width: "100%", marginBottom: "1rem" }}
            severity="error"
            text={errorMsg}
          />
        )}

        <MainToolbar
          active={selection && selection.length}
          onBlock={handleBlock}
          onUnblock={handleUnblock}
          onDelete={handleDelete}
        />
        <Divider />
        <MainTable
          loading={status === STATUS.LOADING}
          value={users}
          selection={selection}
          setSelection={setSelection}
        />
      </Card>
      <StatusFooter email={getUser().email} onLogout={handleLogout} />
    </LayoutWrapper>
  );
}

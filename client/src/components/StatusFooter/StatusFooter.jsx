import { Button } from "primereact/button";

export function StatusFooter({ email, onLogout }) {
  return (
    <div
      style={{
        marginTop: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      {email ? (
        <span>
          You are logged in as <b>{email}</b>
        </span>
      ) : (
        <span>
          <b>You are not logged in!</b>
        </span>
      )}
      <Button label="Log out" icon="pi pi-sign-out" outlined rounded onClick={onLogout} />
    </div>
  );
}

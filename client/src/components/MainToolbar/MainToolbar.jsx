import { Button } from "primereact/button";

export function MainToolbar({ active, onBlock, onUnblock, onDelete }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
      <Button disabled={!active} label="Block" rounded text onClick={onBlock} />
      <Button disabled={!active} label="Unblock" rounded text onClick={onUnblock} />
      <Button
        disabled={!active}
        label="Delete"
        rounded
        text
        icon="pi pi-trash"
        severity="danger"
        onClick={onDelete}
      />
    </div>
  );
}

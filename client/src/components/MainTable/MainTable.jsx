import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { format, parseISO } from "date-fns";

const DATE_FORMAT = "dd-MM-yyyy, HH:mm";

const statusBodyTemplate = ({ isBlocked }) => (isBlocked ? <b>Blocked</b> : <b>Active</b>);
const createdAtTemplate = ({ createdAt }) => format(parseISO(createdAt), DATE_FORMAT);
const lastSeenTemplate = ({ lastSeen }) => format(parseISO(lastSeen), DATE_FORMAT);

export function MainTable({ loading, value, selection, setSelection }) {
  return (
    <DataTable
      stripedRows
      loading={loading}
      value={value}
      selectionMode="checkbox"
      selection={selection}
      onSelectionChange={(e) => setSelection(e.value)}
      tableStyle={{ fontSize: "0.875rem" }}
    >
      <Column selectionMode="multiple"></Column>
      <Column field="username" header="Username"></Column>
      <Column field="email" header="Email"></Column>
      <Column header="Created at" body={createdAtTemplate}></Column>
      <Column header="Last seen" body={lastSeenTemplate}></Column>
      <Column header="Status" body={statusBodyTemplate}></Column>
    </DataTable>
  );
}

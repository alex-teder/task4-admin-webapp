import { wrapper, centeredWrapper } from "./style.module.css";

export function LayoutWrapper({ children, centered = false }) {
  return <div className={centered ? centeredWrapper : wrapper}>{children}</div>;
}

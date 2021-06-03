import { Alert, Space } from "antd";
import { LegacySiteLink } from "components/atomic/molecules";
import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "WarningBar_01: Dismissed";

export function WarningBar() {
  const [showing, setShowing] = useState(true);

  useEffect(() => {
    const isDismissed = window.localStorage.getItem(LOCAL_STORAGE_KEY);

    if (isDismissed === "true") {
      setShowing(false);
    }
  }, [setShowing]);

  useEffect(() => {
    if (!showing) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, "true");
    }
  }, [showing]);

  return showing ? (
    <Alert
      showIcon={true}
      closable={true}
      style={{ position: "fixed", top: 70, left: 10, zIndex: 10 }}
      type="info"
      onClose={() => setShowing(false)}
      message={
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <div>
            The new UI is finally out, but there may still be some bugs.{" "}
          </div>
          <LegacySiteLink />
        </Space>
      }
    />
  ) : null;
}

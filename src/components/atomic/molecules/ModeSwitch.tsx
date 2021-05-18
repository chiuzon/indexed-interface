import { Switch } from "antd";
import { actions, selectors } from "features";
import { useDispatch, useSelector } from "react-redux";
import { useTranslator } from "hooks";

export function ModeSwitch() {
  const tx = useTranslator();
  const dispatch = useDispatch();
  const theme = useSelector(selectors.selectTheme);

  return (
    <Switch
      checked={["dark", "outrun"].includes(theme)}
      checkedChildren={
        theme === "outrun" ? (
          <div className="perfectly-centered">
            <OutrunEmoji /> {tx("OUTRUN")}
          </div>
        ) : (
          `🌙 ${tx("DARK")}`
        )
      }
      unCheckedChildren={`🔆 ${tx("LIGHT")}`}
      onClick={() => dispatch(actions.themeToggled())}
    />
  );
}

function OutrunEmoji() {
  return (
    <div
      style={{
        width: 16,
        height: 16,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -2,
          left: 0,
          zIndex: 1,
        }}
      >
        🌕
      </div>
      <div
        style={{
          position: "absolute",
          top: -2,
          left: 0,
          zIndex: 2,
        }}
      >
        🌴
      </div>
    </div>
  );
}
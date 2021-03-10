import { Dropdown, Menu, notification } from "antd";
import { actions } from "features";
import { useBreakpoints } from "helpers";
import { useDispatch } from "react-redux";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import jazzicon from "@metamask/jazzicon";
import styled from "styled-components";

interface Props {
  address: string;
}

export default function JazzIcon({ address }: Props) {
  const dispatch = useDispatch();
  const blockie = useRef<null | HTMLSpanElement>(null);
  const handleDisconnect = React.useCallback(() => {
    dispatch(actions.userDisconnected());

    notification.info({
      message: "Disconnected",
      description: "You have successfully disconnected your wallet.",
    });
  }, [dispatch]);
  const breakpoints = useBreakpoints();

  // Effect:
  // On load, display a success notification.
  useEffect(() => {
    notification.success({
      message: "Connected",
      description: "You have successfully connected your wallet.",
    });
  }, []);

  // Effect:
  // Use refs to integrate the third party library for displaying a wallet identicon.
  useEffect(() => {
    const _blockie = blockie.current;
    let element: any;

    if (_blockie) {
      const parsedAddress = parseInt(address.slice(2, 10), 16);

      element = jazzicon(breakpoints.md ? 35 : 25, parsedAddress);
      element.style.border = "2px solid #ccccff";

      _blockie.appendChild(element);
    }

    return () => {
      if (element) {
        element.remove();
      }

      if (_blockie) {
        ReactDOM.unmountComponentAtNode(_blockie);
      }
    };
  }, [address, breakpoints.md]);

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`https://etherscan.io/address/${address}`}
    >
      <Dropdown
        arrow={true}
        overlay={
          <Menu>
            <Menu.Item>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://etherscan.io/address/${address}`}
              >
                View on Etherscan
              </a>
            </Menu.Item>
            <Menu.Item onClick={handleDisconnect}>Disconnect</Menu.Item>
          </Menu>
        }
      >
        <S.Blockie ref={blockie} />
      </Dropdown>
    </a>
  );
}

const S = {
  JazzIcon: styled.div`
    /* position: relative; */
  `,
  Blockie: styled.span`
    /* position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%; */
  `,
};

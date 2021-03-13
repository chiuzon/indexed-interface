import { Action, Performance, Recent, Subscreen } from "app/subscreens";
import { AppState, actions, selectors } from "features";
import { CgArrowsExpandRight } from "react-icons/cg";
import {
  ChartCard,
  PoolDropdown,
  PoolInteractions,
  ProviderRequirementDrawer,
  RankedTokenList,
  ScreenHeader,
} from "components";
import { Col, Row } from "antd";
import { Link, Redirect } from "react-router-dom";
import { useBreakpoints } from "helpers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";

type Props = { poolId: string, poolName: string }

export default function Pool({ poolId, poolName }: Props) {
  const dispatch = useDispatch();
  const isConnected = useSelector(selectors.selectConnected);
  const breakpoints = useBreakpoints();
  const pool = useSelector((state: AppState) => selectors.selectFormattedIndexPool(state, poolId));

  const chartActions = useMemo(
    () =>
      [
        {
          type: "default",
          title: (
            <Link to={`/pools/${poolName}/chart`}>
              Expand <CgArrowsExpandRight />
            </Link>
          ),
          onClick: () => {
            /* */
          },
        },
      ] as Action[],
    [poolName]
  );
  const interactionActions = useMemo(
    () =>
      [
        {
          title: "Swap",
          onClick: () => {
            /* */
          },
          type: "primary",
        },
      ] as Action[],
    []
  );

  // Effect:
  // When the pool changes and not connected to the server, get the juicy details.
  useEffect(() => {
    let poolUpdateListenerId: string;

    // This screen always needs user data.
    const tokenUserDataListenerId = (dispatch(
      actions.registerTokenUserDataListener(poolId)
    ) as unknown) as string;

    // Pool updates and TheGraph/CoinGecko data is only required if not receiving data from the server.
    if (!isConnected) {
      poolUpdateListenerId = (dispatch(
        actions.registerPoolUpdateListener(poolId)
      ) as unknown) as string;
    }

    // After adding the listeners, trigger a batch send so the user can see data fast.
    dispatch(actions.sendBatch());

    return () => {
      [tokenUserDataListenerId, poolUpdateListenerId]
        .filter(Boolean)
        .forEach((_id) => dispatch(actions.listenerUnregistered(_id)));
    };
  }, [dispatch, poolId, isConnected]);

  if (pool) {
    // Subscreens
    const performance = <Performance pool={pool} />;
    const chart = (
      <Subscreen title="Chart" padding={0} defaultActions={chartActions}>
        {poolId ? <ChartCard poolId={poolId} /> : null}
      </Subscreen>
    );
    const assets = (
      <Subscreen title="Assets" padding={0}>
        <RankedTokenList pool={pool} />
      </Subscreen>
    );
    const interactions = (
      <Subscreen
        title="Interact"
        padding={0}
        defaultActions={interactionActions}
      >
        <ProviderRequirementDrawer includeSignerRequirement={true} />
        <PoolInteractions pool={pool} />
      </Subscreen>
    );
    const recents = <Recent pool={pool} />;

    // Variants
    const mobileSized = (
      <Row gutter={25}>
        <Col span={24}>{performance}</Col>
        <Col span={24}>{chart}</Col>
        <Col span={24}>{interactions}</Col>
        <Col span={24}>{assets}</Col>
        <Col span={24}>{recents}</Col>
      </Row>
    );
    const tabletSized = (
      <>
        <Row gutter={25}>
          <Col span={12}>
            {performance}
            {chart}
          </Col>
          <Col span={12}>
            {assets}
            {interactions}
          </Col>
        </Row>
        <Row gutter={25}>
          <Col span={24}>{recents}</Col>
        </Row>
      </>
    );
    const desktopSized = (
      <Row gutter={20}>
        <Col span={16}>
          <Row gutter={25}>
            <Col span={12}>
              {performance}
              {chart}
            </Col>
            <Col span={12}>{interactions}</Col>
          </Row>
          <Row gutter={25}>
            <Col span={24}>{recents}</Col>
          </Row>
        </Col>
        <Col span={8}>{assets}</Col>
      </Row>
    );

    return (
      <>
        <ScreenHeader
          title={pool.name}
          overlay={<PoolDropdown />}
          activeBreadcrumb={<Link to="/pools">Index Pools</Link>}
        />
        {(() => {
          switch (true) {
            case breakpoints.xxl:
              return desktopSized;
            case breakpoints.xl:
              return tabletSized;
            case breakpoints.lg:
              return tabletSized;
            case breakpoints.md:
              return tabletSized;
            case breakpoints.sm:
              return tabletSized;
            case breakpoints.xs:
              return mobileSized;
          }
        })()}
      </>
    );
  } else {
    return <Redirect to="/pools" />;
  }
}

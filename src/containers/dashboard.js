import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getPositions } from "../library/store/positions";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "../assets/css/dashboard.scss";
import moment from "moment";
import { order } from "../library/constant";
import { getStoplossMtm } from "../library/helper";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
export default function DashboardPage() {
  const dispatch = useDispatch();
  const positions = useSelector((state) => state.positions.value.positions);
  const [rowData, setRowData] = useState(positions);
  const [isPositionsExited, setIsPositionsExited] = useState(false);
  const [totalMtm, setTotalMtm] = useState(0);
  const [stoplossMtm, setStoplossMtm] = useState(getStoplossMtm());
  const [isEditStoploss, setIsEditStoploss] = useState(false);
  const [colDefs, setColDefs] = useState([
    { field: "tradingSymbol", headerName: "Symbol" },
    { field: "positionType", headerName: "Status" },
    {
      field: "drvExpiryDate",
      headerName: "Expiry",
      valueGetter: (p) => moment(p.data.drvExpiryDate).format("Do MMM YY"),
    },
    { field: "netQty", headerName: "Qty" },
    {
      field: "costPrice",
      headerName: "Price",
      valueGetter: (p) => {
        return p.data.costPrice.toFixed(2);
      },
    },
    {
      field: "mtm",
      headerName: "MTM",
      valueGetter: (p) => {
        let mtm = 0;
        if (p.data.positionType === "CLOSED") {
          mtm += p.data.realizedProfit;
        } else if (p.data.positionType === "SHORT") {
          mtm += p.data.unrealizedProfit;
        } else {
          mtm += p.data.unrealizedProfit + p.data.realizedProfit;
        }
        console.log("total", totalMtm);
        setTotalMtm((total) => total + parseInt(mtm));
        return parseInt(mtm);
      },
      cellStyle: (params) => {
        if (params.data.positionType === "CLOSED") {
          if (params.data.realizedProfit > 0) {
            return { color: "green" };
          } else {
            return { color: "red" };
          }
        } else {
          if (params.data.unrealizedProfit + params.data.realizedProfit > 0) {
            return { color: "green" };
          } else {
            return { color: "red" };
          }
        }
        return null;
      },
    },
  ]);

  const placeOrder = (orderObj) => {
    if (orderObj) {
      console.log("order", orderObj);
    }
  };
  const exitAllPositions = () => {
    if (!isPositionsExited) {
      positions.map((position) => {
        let orderObj = {};
        if (position.positionType !== "CLOSED") {
          if (position.positionType === "SHORT") {
            orderObj = {
              security_id: position.securityId,
              exchange_segment: position.exchangeSegment,
              transaction_type: order.BUY,
              quantity: position.netQty,
              order_type: order.MARKET,
              product_type: position.productType,
              price: 0,
            };
          } else {
            orderObj = {
              security_id: position.securityId,
              exchange_segment: position.exchangeSegment,
              transaction_type: order.SELL,
              quantity: position.netQty,
              order_type: order.MARKET,
              product_type: position.productType,
              price: 0,
            };
          }
          placeOrder(orderObj);
        }
      });
    }
    setIsPositionsExited(true);
    dispatch(getPositions());
  };
  const getRowId = useCallback(
    (params) => params.data.tradingSymbol + params.data.drvExpiryDate,
    []
  );
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      cellClass: "align-right",
      enableCellChangeFlash: true,
    };
  }, []);

  useEffect(() => {
    if (totalMtm < 5000) {
      if (positions.length > 0) {
        exitAllPositions();
      }
    }
  }, [totalMtm]);
  console.log("positions", positions);
  const refresh = () => {
    dispatch(getPositions());
  };
  const editStoplossMtm = () => {};
  return (
    <>
      <div className="dashboard-details">
        {/* <button onClick={()=> refresh() } className="btn btn-primary">Refresh</button> */}
        <span>
          Total MTM:{" "}
          <span className={totalMtm > 0 ? "mtm-green" : "mtm-red"}>
            {totalMtm}
          </span>
        </span>
        <span className="stoploss-span">
          Stoploss MTM:
          {isEditStoploss ? (
            <div className="p-inputgroup flex-1 input-stoploss">              
              <InputText placeholder="stoploss Mtm" value={stoplossMtm } className="p-inputtext-sm stoploss-item" />
              <Button icon="pi pi-check" onClick={(e) => setIsEditStoploss(false)} className="p-button-success stoploss-item" />
            </div>
          ) : (
            // <InputText type="text" value={stoplossMtm } className="p-inputtext-sm input-stoploss" placeholder="Small" />
            <span>
              {stoplossMtm}{" "}
              <i
                className="pi pi-pencil icon-button"
                onClick={(e) => setIsEditStoploss(true)}
              ></i>
            </span>
          )}
        </span>
      </div>
      <div
        id="myGrid"
        className="ag-theme-material"
        style={{ width: "100%", height: "100%" }}
      >
        <AgGridReact
          rowData={positions}
          columnDefs={colDefs}
          showGrid={true}
          defaultColDef={defaultColDef}
          getRowId={getRowId}
        />
      </div>
    </>
  );
}

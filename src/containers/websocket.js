import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import { getToken } from "../library/helper";
import Header from "../components/header";
import socketIO from "socket.io-client";
import { Buffer } from 'buffer';
export default function DashboardPage() {
  
  const socket = new WebSocket('wss://api-feed.dhan.co');
  socket.binaryType = "arraybuffer";
  
  const clientToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzIxMjc2NjczLCJ0b2tlbkNvbnN1bWVyVHlwZSI6IlNFTEYiLCJ3ZWJob29rVXJsIjoiIiwiZGhhbkNsaWVudElkIjoiMTEwMjU5MzIyOCJ9.uUPCjgJgL6qskzS4YfSOQx9GCwJSWRQMShasKMZeFnkN9HCqS8oj1sZd84jMbHg2PmLtrxtVsWwVW8Y_lulCMw";
  const clientId = "1102593228";
  const createAuthPacket = () => {
    let api_access_token = Buffer.from(clientToken, "utf-8");
  api_access_token = padWithZeros(api_access_token, 500);
  let authentication_type = Buffer.from("2P", "utf-8");
  let payload = Buffer.concat([api_access_token, authentication_type]);
  
  
  let client_id = Buffer.from(clientId, "utf-8");
  client_id = padWithZeros(client_id, 30);
  let dhan_auth = Buffer.alloc(50);
  let feed_request_code = 11;
  let message_length =
    83 + api_access_token.length + authentication_type.length;
  let header = Buffer.concat([
    Buffer.from([feed_request_code]),
    Buffer.from([message_length]),
    client_id,
    dhan_auth,
  ]);
  let authorization_packet = Buffer.concat([header, payload]);
    return authorization_packet;

  }
  
  const createHeaderForSuscribtion = () => {
    let client_id = Buffer.from(clientId, "utf-8");
    client_id = padWithZeros(client_id, 30);
    let dhan_auth = Buffer.alloc(50);
    const num_instruments = 2;
    const subscription_code = 15;
    const message_length = 83 + 4 + num_instruments * 21;
    const headerForInstruments=Buffer.concat([
      Buffer.from([subscription_code]),
      Buffer.from([message_length]),
      client_id,
      dhan_auth,
    ]);
    console.log("header",headerForInstruments)
    let exchangeSegments = [{ exchange: 1, securityId: "1333" },{ exchange: 0, securityId: "13" }];
    let instruments;
    exchangeSegments.forEach((item) => {
      let wthZero=Buffer.from(item.securityId, "utf-8")
      if (instruments !== undefined) {
        instruments = Buffer.concat([
          instruments,
          Buffer.from([item.exchange]),
          padWithZeros(wthZero,20),
        ]);
      } else {
        instruments = Buffer.concat([
          Buffer.from([item.exchange]),
          padWithZeros(wthZero,20),
        ]);   
      }

    })
    let i = 0;
    while (i < 100-num_instruments) {
      instruments=Buffer.concat([
        instruments,
        Buffer.from([0]),
        padWithZeros(Buffer.from("", "utf-8"),20),
      ]);
      i++;
    }
    // console.log("instruments", instruments);

    // console.log("instruments",instruments)

    let subscription_packet = Buffer.concat([headerForInstruments, Buffer.from([num_instruments]), instruments]);
    // console.log("subscription_packet",subscription_packet)
    return subscription_packet;
  }

  
  
  function padWithZeros(data, length) {
    if (data.length >= length) {
      return data.slice(0, length);
    } else {
      const zeroPadding = Buffer.alloc(length - data.length, 0);
      return Buffer.concat([data, zeroPadding]);
    }
  }
  // console.log("authorization_packet", authorization_packet);
  socket.onopen = function(event) {
    // // console.log("connected to dhan websocket")
    const authorization_packet = createAuthPacket();
    // const subsciption_packet = createHeaderForSuscribtion();
    // console.log("subsciption_packet,",subsciption_packet)
    socket.send(authorization_packet) // true
     // true

  };
  socket.onerror = function (event) {
    console.log("onerror",event)
  }
  socket.onmessage = function (event) {
    console.log("orignial message",event.data)
    if (event.data instanceof ArrayBuffer) {
      // binary frame
      const view = new DataView(event.data);
      console.log("view",view);
      // var enc = new TextDecoder();
      var firstByte = view.getUint8(0);
      console.log("firstByte",firstByte)
      // console.log(enc.decode(view.getInt8(0)));
    } else {
      // text frame
      console.log(event.data);
    }
  };
  
  socket.onclose = function(event) {
    // Handle connection close
  };
  

  return <>dashbaord page</>;
}

"use client";

import { CardHeader, Divider } from "@nextui-org/react";
import { ReactElement } from "react";

export default function AdminLayoutContentHeader(props: {
  left?: ReactElement;
  right?: ReactElement;
}) {

  return (
    <>
      <CardHeader className="flex items-center justify-between gap-3">
        <div className="flex flex-col justify-between">{props.left}</div>
        <div>{props.right}</div>
      </CardHeader>
      <Divider />
    </>
  );
}

import Link from "next/link";
import React from "react";
// Dropdown list
export default function DropdownLink(props) {
  let { href, children, ...rest } = props;
  return (
    <Link href={href}>
      <p {...rest}>{children}</p>
    </Link>
  );
}

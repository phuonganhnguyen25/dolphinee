"use client";

import { Tab, Tabs } from "@nextui-org/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type IProps = {
  items: { value: string; label: string }[];
  selected_key: string;
  search_key: string;
};

export default function TabsComponent({
  items = [],
  selected_key = "",
  search_key,
}: IProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  return (
    <Tabs
      color={"primary"}
      selectedKey={selected_key}
      aria-label="Dynamic tabs"
      items={items}
    >
      {(item) => {
        params.set(search_key, item.value);
        params.set("page", "1");
        return (
          <Tab
            textValue={item.label}
            key={item.value}
            title={
              <Link href={`${pathname}?${params.toString()}`}>
                {item.label}
              </Link>
            }
          />
        );
      }}
    </Tabs>
  );
}

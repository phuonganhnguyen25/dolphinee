"use client";

import { useTranslations } from "next-intl";
import { Listbox, ListboxItem } from "@nextui-org/react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { GetLayoutMetadata } from "@/helpers/layout-metadata";

export default function AdminLayoutSidebar() {
  const t = useTranslations("Layout");
  const params = useParams();
  const pathname = usePathname();
  const path = (s: string) => `/${params.locale}/admin${s}`;
  const { sidebar_active_key } = GetLayoutMetadata(pathname);

  const items: { label: string; key: string; href: string }[] = [
    {
      label: t("Dashboard"),
      key: "1",
      href: path("/"),
    },
    {
      label: t("Category"),
      key: "2",
      href: path("/category"),
    },
  ];

  return (
    <div className="w-[260px] h-screen bg-white border-r px-4 py-6 flex flex-col justify-between">
      <Listbox
        selectedKeys={[sidebar_active_key]}
        selectionMode="single"
        aria-label="Actions"
      >
        {items.map((item) => (
          <ListboxItem textValue={item.label} key={item.key}>
            <Link className="w-full block" key={item.key} href={item.href}>
              {item.label}
            </Link>
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  );
}

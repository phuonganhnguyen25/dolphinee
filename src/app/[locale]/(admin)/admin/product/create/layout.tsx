import AdminLayoutContentHeader from "@/components/admin/content-header";
import { CardBody } from "@nextui-org/react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
  params: { locale: string };
}>) {
  const t_product = useTranslations("Product");

  return (
    <>
      <AdminLayoutContentHeader
        left={<h2 className="font-bold text-lg">{t_product("Create")}</h2>}
        right={<div />}
      />
      <CardBody>{children}</CardBody>
    </>
  );
}
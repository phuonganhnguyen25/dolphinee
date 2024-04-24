import AdminLayoutContentHeader from "@/components/admin/content-header";
import { CardBody } from "@nextui-org/react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const t = useTranslations("Layout");
  const t_category = useTranslations("Category");

  return (
    <>
      <AdminLayoutContentHeader
        left={<h2 className="font-bold text-lg">{t_category("Create")}</h2>}
        right={<div />}
      />
      <CardBody>{children}</CardBody>
    </>
  );
}

import AdminLayoutContentHeader from "@/components/admin/content-header";
import AddIcon from "@/components/icons/add";
import { Button, CardBody } from "@nextui-org/react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: ReactNode;
  params: { locale: string };
}>) {
  const t_product = useTranslations("Product");
  const t_form = useTranslations("Form");

  return (
    <>
      <AdminLayoutContentHeader
        left={<h2 className="font-bold text-lg">{t_product("List")}</h2>}
        right={
          <div>
            <Link href={`/${locale}/admin/product/create`}>
              <Button
                startContent={<AddIcon />}
                color="primary"
                variant="light"
              >
                {t_form("Button.Create")}
              </Button>
            </Link>
          </div>
        }
      />
      <CardBody>{children}</CardBody>
    </>
  );
}

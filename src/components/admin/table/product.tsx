"use client";

import { DATE_TIME_FORMAT } from "@/constants/date";
import { ICategory } from "@/interfaces/category";
import {
  Badge,
  Button,
  Chip,
  Pagination,
  PaginationItemType,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
  useDisclosure,
} from "@nextui-org/react";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import NotificationModal from "../modal/notification";
import Link from "next/link";
import EditIcon from "@/components/icons/edit";
import DeleteIcon from "@/components/icons/delete";
import ConfirmationModal from "../modal/confirmation";
import { DeleteCategoryAction } from "@/actions/category/delete";
import { IProduct } from "@/interfaces/product";
import { IPagination } from "@/interfaces";
import TabsComponent from "@/components/admin/tabs";
import { PRODUCT_STATUS } from "@prisma/client";

interface IProps {
  data: IProduct[];
  pagination: IPagination;
}

export default function ProductTable(props: IProps) {
  const t_category = useTranslations("Category");
  const t_table = useTranslations("Table");
  const t_messages = useTranslations("Messages");
  const t_form = useTranslations("Form");
  const [modal_msg, setModalMsg] = useState<string>("");
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isConfirmOpen,
    onClose: onConfirmClose,
    onOpen: onConfirmOpen,
  } = useDisclosure();
  const [delete_category] = useState<ICategory>();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);

  const columns = [
    {
      key: "sku",
      label: t_table("Label.SKU"),
    },
    {
      key: "name",
      label: t_table("Label.Product_Name"),
    },
    {
      key: "price_en",
      label: t_form("Price.EN"),
    },
    {
      key: "price_vi",
      label: t_form("Price.VI"),
    },
    {
      key: "category",
      label: t_table("Label.Category_Name"),
    },
    {
      key: "created_at",
      label: t_table("Label.Created_At"),
    },
    {
      key: "updated_at",
      label: t_table("Label.Updated_At"),
    },
    {
      key: "action",
      label: t_table("Label.Action"),
    },
  ];

  const renderCell = useCallback(
    (d: IProduct, columnKey: keyof IProduct | any) => {
      const cellValue = d[columnKey as keyof IProduct];

      switch (columnKey) {
        case "sku":
          return <div className="w-20">{cellValue.toString()}</div>;
        case "name":
          return (
            <div className="w-40">
              <Badge
                content={0}
                color="danger"
                placement="top-left"
                showOutline
                isInvisible={true}
              >
                <User
                  avatarProps={{
                    radius: "lg",
                    src: "",
                    style: {
                      minWidth: 40,
                    },
                  }}
                  description={
                    params.locale === "vi" ? d.name.name_en : d.name.name_vi
                  }
                  name={
                    params.locale === "vi" ? d.name.name_vi : d.name.name_en
                  }
                />
              </Badge>
            </div>
          );

        case "status":
          return <Chip color="default">{d.status}</Chip>;
        case "price_en":
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(d.price_en);
        case "price_vi":
          return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(d.price_vi);
        case "created_at":
          return <div>{dayjs(d.created_at).format(DATE_TIME_FORMAT)}</div>;
        case "updated_at":
          return <div>{dayjs(d.updated_at).format(DATE_TIME_FORMAT)}</div>;
        case "category":
          const category = d.product_category?.category;
          return category ? (
            <User
              avatarProps={{
                radius: "lg",
                src: "",
                className: "hidden",
              }}
              description={
                params.locale === "vi"
                  ? category.name?.name_en
                  : category.name?.name_vi
              }
              name={
                params.locale === "vi"
                  ? category.name?.name_vi
                  : category.name?.name_en
              }
            />
          ) : (
            "-"
          );
        case "action":
          return (
            <div className="relative flex items-center gap-2">
              <Link href={`/${params.locale}/admin/product/edit/${d.id}`}>
                <Button
                  startContent={<EditIcon />}
                  color="primary"
                  variant="light"
                  size="sm"
                  isIconOnly
                  aria-label="update icon"
                />
              </Link>
              <Button
                onClick={() => {
                  onConfirmOpen();
                  // setDeleteCategory(d);
                }}
                startContent={<DeleteIcon />}
                color="danger"
                variant="light"
                size="sm"
                isIconOnly
                aria-label="delete icon"
              />
            </div>
          );
        default:
          return cellValue;
      }
    },
    [onConfirmOpen, params.locale],
  );
  return (
    <>
      <NotificationModal
        onClose={onClose}
        isOpen={isOpen}
        modal_msg={modal_msg}
      />

      <ConfirmationModal
        onClose={onConfirmClose}
        isOpen={isConfirmOpen}
        metadata={{
          msg: t_messages("Confirm.Delete_Category", {
            category_name: `${delete_category?.name.name_en}/${delete_category?.name.name_vi}`,
          }),
          title: t_category("Delete"),
        }}
        loading={loading}
        onOk={() => {
          if (delete_category?.id) {
            setLoading(true);
            DeleteCategoryAction({ id: delete_category?.id }).then((x) => {
              setModalMsg(x.message);
              if (x.status) {
                setLoading(false);
                onConfirmClose();
                onOpen();
                router.refresh();
              } else {
                setLoading(false);
              }
            });
          }
        }}
      />

      <div className="">
        <Table
          aria-label="Example table with dynamic content"
          shadow={"none"}
          isStriped
          topContentPlacement={"inside"}
          bottomContent={
            <div className={"flex justify-between"}>
              <TabsComponent
                items={[
                  {
                    label: PRODUCT_STATUS.DRAFT.toString(),
                    value: PRODUCT_STATUS.DRAFT.toString(),
                  },
                  {
                    label: PRODUCT_STATUS.PUBLISHED.toString(),
                    value: PRODUCT_STATUS.PUBLISHED.toString(),
                  },
                ]}
                selected_key={
                  searchParams.get("status") ===
                  PRODUCT_STATUS.PUBLISHED.toString()
                    ? PRODUCT_STATUS.PUBLISHED.toString()
                    : PRODUCT_STATUS.DRAFT.toString()
                }
                search_key="status"
              />

              <Pagination
                key={"1"}
                total={Math.ceil(
                  props.pagination.total / props.pagination.per_page,
                )}
                initialPage={props.pagination.page}
                size={"md"}
                renderItem={({ className, ref, key, value, setPage, page }) => {
                  if (value === PaginationItemType.DOTS) {
                    return (
                      <button key={key} className={className}>
                        ...
                      </button>
                    );
                  }
                  return (
                    <Link key={key} href={`?page=${page}`}>
                      <button
                        ref={ref}
                        className={className}
                        onClick={() => setPage(+value)}
                      >
                        {value}
                      </button>
                    </Link>
                  );
                }}
              />
            </div>
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent="No products available"
            items={props.data || []}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey) as any}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

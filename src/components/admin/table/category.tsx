"use client";

import { OnChangeOrderCategory } from "@/actions/category/order";
import { DATE_TIME_FORMAT } from "@/constants/date";
import { ICategory } from "@/interfaces/category";
import {
  Badge,
  Button,
  Select,
  SelectItem,
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
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import NotificationModal from "../modal/notification";
import Link from "next/link";
import EditIcon from "@/components/icons/edit";
import DeleteIcon from "@/components/icons/delete";
import ConfirmationModal from "../modal/confirmation";
import { DeleteCategoryAction } from "@/actions/category/delete";

interface IProps {
  data: ICategory[];
}

export default function CategoryTable(props: IProps) {
  const t_category = useTranslations("Category");
  const t_table = useTranslations("Table");
  const t_messages = useTranslations("Messages");
  const [modal_msg, setModalMsg] = useState<string>("");
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isConfirmOpen,
    onClose: onConfirmClose,
    onOpen: onConfirmOpen,
  } = useDisclosure();
  const [delete_category, setDeleteCategory] = useState<ICategory>();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);

  const columns = [
    {
      key: "order",
      label: t_table("Label.Order"),
    },
    {
      key: "name",
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
    (d: ICategory, columnKey: keyof ICategory | any) => {
      const cellValue = d[columnKey as keyof ICategory];

      switch (columnKey) {
        case "name":
          return (
            <Badge
              content={d._count?.children}
              color="danger"
              placement="top-left"
              showOutline
              isInvisible={!d._count?.children}
            >
              <User
                avatarProps={{
                  radius: "lg",
                  src: "",
                }}
                description={
                  params.locale === "vi" ? d.name.name_en : d.name.name_vi
                }
                name={params.locale === "vi" ? d.name.name_vi : d.name.name_en}
              />
            </Badge>
          );

        case "order":
          return (
            <Select
              disabledKeys={[d.order.toString()]}
              selectedKeys={[d.order]}
              items={props.data?.map((x, i) => ({
                value: x.order,
                label: i + 1,
              }))}
              aria-label="order"
              onChange={(e) =>
                OnChangeOrderCategory({
                  category_id: d.id,
                  next_order: Number(e.target.value),
                }).then((x) => {
                  setModalMsg(x.message);
                  onOpen();
                  if (x.status) {
                    router.refresh();
                  }
                })
              }
            >
              {(item) => (
                <SelectItem textValue={item.label.toString()} key={item.value}>
                  {item.label}
                </SelectItem>
              )}
            </Select>
          );

        case "created_at":
          return <div>{dayjs(d.created_at).format(DATE_TIME_FORMAT)}</div>;
        case "updated_at":
          return <div>{dayjs(d.updated_at).format(DATE_TIME_FORMAT)}</div>;

        case "action":
          return (
            <div className="relative flex items-center gap-2">
              <Link href={`/${params.locale}/admin/category/edit/${d.id}`}>
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
                  setDeleteCategory(d);
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
    [],
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

      <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent="No products available" items={props.data}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey) as any}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

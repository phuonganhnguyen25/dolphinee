"use client";
// @ts-ignore
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "@/interfaces/category";
import { CreateCategoryValidator } from "@/validators/category";
import { CreateCategoryAction } from "@/actions/category/create";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NotificationModal from "../modal/notification";
import { RemoveDuplicateObj } from "@/helpers/remove-dup-obj";
import { UpdateCategoryAction } from "@/actions/category/update";
import { isEmpty } from "lodash";

type IProps = {
  categoryList: { label: string; value: number }[] | null;
  defaultFormValue: ICreateCategoryPayload;
  id: number | null;
};

export default function CreateCategoryForm({
  categoryList,
  defaultFormValue,
  id,
}: IProps) {
  const t_form = useTranslations("Form");
  const t_messages = useTranslations("Messages");
  const t_category = useTranslations("Category");

  const [modal_msg, setModalMsg] = useState<string>("");
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const { handleSubmit, control, trigger, reset, setError } =
    useForm<ICreateCategoryPayload>({
      resolver: zodResolver(CreateCategoryValidator),
      defaultValues: defaultFormValue,
    });

  const onSubmit: SubmitHandler<ICreateCategoryPayload> = async (data) => {
    let action = async () => await CreateCategoryAction(data);

    if (id) {
      const updateData = RemoveDuplicateObj(data, defaultFormValue);
      if (isEmpty(updateData)) {
        setModalMsg("Error.Nothing_Update");
        onOpen();
        return;
      }
      action = async () =>
        await UpdateCategoryAction({
          ...updateData,
          id,
        } as IUpdateCategoryPayload);
    }
    setLoading(true);
    await action().then((x) => {
      setModalMsg(x.message);

      if (!x?.status) {
        if (x?.type === "validation") {
          x.errors.forEach((err) => {
            setError(
              err.path[0],
              { message: err.message },
              { shouldFocus: true }
            );
          });
        }
        setLoading(false);
      } else {
        onOpen();
        setLoading(false);
        router.refresh();
        id ? reset(data) : reset();
      }
    });
  };

  return (
    <>
      <NotificationModal
        onClose={onClose}
        isOpen={isOpen}
        modal_msg={modal_msg}
      />

      <form
        className="w-full"
        id="create-product-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col md:flex-row my-5">
          <div className="w-full md:w-1/2 pr-0 md:pr-2 mb-4 md:mb-0">
            <Controller
              name="name_en"
              control={control}
              render={({ formState: { errors }, field }) => (
                <Input
                  type="text"
                  label={t_form("Name.EN")}
                  placeholder={t_form("Placeholder.Name")}
                  isInvalid={!!errors.name_en?.message}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    trigger("name_en");
                  }}
                  errorMessage={
                    errors.name_en?.message &&
                    t_messages(errors.name_en.message)
                  }
                />
              )}
            />
          </div>
          <div className="w-full md:w-1/2 pl-0 md:pl-2">
            <Controller
              name="name_vi"
              control={control}
              render={({ formState: { errors }, field }) => (
                <Input
                  type="text"
                  label={t_form("Name.VI")}
                  placeholder={t_form("Placeholder.Name")}
                  value={field.value}
                  isInvalid={!!errors.name_vi?.message}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    trigger("name_vi");
                  }}
                  errorMessage={
                    errors.name_vi?.message &&
                    t_messages(errors.name_vi.message)
                  }
                />
              )}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row my-5">
          <div className="w-full md:w-1/2 pr-0 md:pr-2 mb-4 md:mb-0">
            <Controller
              name="parent_id"
              control={control}
              render={({ formState: { errors }, field }) => (
                <Select
                  selectedKeys={[field.value]}
                  items={categoryList || []}
                  label={t_category("Parent")}
                  placeholder={t_category("Parent")}
                  isInvalid={!!errors.parent_id?.message}
                  errorMessage={
                    errors.parent_id?.message &&
                    t_messages(errors.parent_id.message)
                  }
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                    trigger("parent_id");
                  }}
                >
                  {(item) => (
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                  )}
                </Select>
              )}
            />
          </div>
          <div className="w-full md:w-1/2 pl-0 md:pl-2"></div>
        </div>

        <Button isLoading={loading} type="submit" color="primary">
          {t_form(id ? "Button.Update" : "Button.Create")}
        </Button>
      </form>
    </>
  );
}

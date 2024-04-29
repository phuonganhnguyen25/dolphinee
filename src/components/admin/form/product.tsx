"use client";
// @ts-ignore
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, Input, useDisclosure } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NotificationModal from "../modal/notification";
import {
  ICreateProductPayload,
  IUpdateProductPayload,
} from "@/interfaces/product";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { CreateProductValidator } from "@/validators/product";
import { CreateProductAction } from "@/actions/product/create";
import SelectCategoryAllLevel from "@/components/admin/select/category-all";
import { RemoveDuplicateObj } from "@/helpers/remove-dup-obj";
import { isEmpty } from "lodash";
import { UpdateProductAction } from "@/actions/product/update";
import UploadPhotos from "@/components/admin/upload/photos";

type IProps = {
  // categoryList: { label: string; value: number }[] | null;
  defaultFormValue: ICreateProductPayload;
  id: number | null;
};

export default function CreateProductForm({
  // categoryList,
  defaultFormValue,
  id,
}: IProps) {
  const t_form = useTranslations("Form");
  const t_messages = useTranslations("Messages");
  const t_product = useTranslations("Product");
  const t_category = useTranslations("Category");

  const [modal_msg, setModalMsg] = useState<string>("");
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const { handleSubmit, control, trigger, reset, setError } =
    useForm<ICreateProductPayload>({
      resolver: zodResolver(CreateProductValidator),
      defaultValues: defaultFormValue,
    });

  const onSubmit: SubmitHandler<ICreateProductPayload> = async (data) => {
    let action = async () => await CreateProductAction(data);

    if (id) {
      const updateData = RemoveDuplicateObj(data, defaultFormValue);
      if (isEmpty(updateData)) {
        setModalMsg("Error.Nothing_Update");
        onOpen();
        return;
      }
      action = async () =>
        await UpdateProductAction({
          ...updateData,
          id,
        } as IUpdateProductPayload);
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
              { shouldFocus: true },
            );
            trigger(err.path[0]);
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
                    trigger("name_en").then();
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
                    trigger("name_vi").then();
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
              name="price_en"
              control={control}
              render={({ formState: { errors }, field }) => (
                <Input
                  type="number"
                  label={t_form("Price.EN")}
                  placeholder={t_form("Placeholder.Price")}
                  isInvalid={!!errors.price_en?.message}
                  value={field.value.toString()}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                    trigger("price_en").then();
                  }}
                  startContent="$"
                  errorMessage={
                    errors.price_en?.message &&
                    t_messages(errors.price_en.message)
                  }
                />
              )}
            />
          </div>
          <div className="w-full md:w-1/2 pl-0 md:pl-2">
            <Controller
              name="price_vi"
              control={control}
              render={({ formState: { errors }, field }) => (
                <Input
                  type="number"
                  label={t_form("Price.VI")}
                  placeholder={t_form("Placeholder.Price")}
                  value={field.value.toString()}
                  isInvalid={!!errors.price_vi?.message}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                    trigger("price_vi").then();
                  }}
                  startContent="₫"
                  errorMessage={
                    errors.price_vi?.message &&
                    t_messages(errors.price_vi.message)
                  }
                />
              )}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row my-5">
          <div className="w-full md:w-1/2 pr-0 md:pr-2 mb-4 md:mb-0">
            <Controller
              name="category_id"
              control={control}
              render={({ formState: { errors }, field }) => (
                <SelectCategoryAllLevel<ICreateProductPayload, "category_id">
                  metadata={{
                    label: t_category("Text"),
                    placeholder: t_category("Text"),
                    type: "number",
                    default_value: field.value,
                  }}
                  field={field}
                  trigger={trigger}
                  errors={{
                    show: !!errors.category_id?.message,
                    message: errors.category_id?.message || "",
                  }}
                  form_key="category_id"
                />
              )}
            />
          </div>
          <div className="w-full md:w-1/2 pl-0 md:pl-2"></div>
        </div>

        <div className="my-4">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div className="w-full">
                <MDEditor
                  onBlur={field.onBlur}
                  textareaProps={{
                    placeholder: t_product("Description"),
                  }}
                  aria-placeholder={t_product("Description")}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("description").then();
                  }}
                  previewOptions={{
                    rehypePlugins: [[rehypeSanitize]],
                  }}
                />
              </div>
            )}
          />
        </div>

        <div className="my-4">
          <Controller
            name="is_new"
            control={control}
            render={({ field }) => (
              <div className="w-full">
                <Checkbox
                  onChange={(e) => field.onChange(e.target.checked)}
                  isSelected={field.value}
                  size="md"
                >
                  <small>{t_product("Is_New")}</small>
                </Checkbox>
              </div>
            )}
          />
        </div>

        <div>
          <UploadPhotos />
        </div>

        <Button isLoading={loading} type="submit" color="primary">
          {t_form(id ? "Button.Update" : "Button.Create")}
        </Button>
      </form>
    </>
  );
}

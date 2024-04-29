"use client";

import { GetListSelectCategoryLevel1 } from "@/actions/category/get";
import { Select, SelectItem } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";

type IProps<T, TKey extends string> = {
  metadata: {
    label: string;
    placeholder: string;
    type: "string" | "number";
    default_value: any;
  };
  field: ControllerRenderProps<T | any, TKey>;
  trigger: any;
  errors: {
    show: boolean;
    message: string;
  };
  form_key: TKey;
};

export default function SelectCategoryLv1<T, TKey extends string>({
  metadata,
  field,
  errors,
  trigger,
  form_key,
}: IProps<T, TKey>) {
  const [data, setData] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const SetField = useCallback(
    (value: any) => {
      field.onChange(metadata.type === "number" ? Number(value) : value);
      trigger(form_key);
    },
    [field, form_key, metadata.type, trigger],
  );

  useEffect(() => {
    GetListSelectCategoryLevel1().then((x) => {
      setData(x.data?.data ? x.data.data : []);
      setLoading(false);
      if (metadata.default_value) {
        SetField(metadata.default_value);
      }
    });
  }, [metadata.default_value, SetField]);

  return (
    <Select
      isLoading={loading}
      selectedKeys={[field.value]}
      items={data}
      label={metadata.label}
      placeholder={metadata.placeholder}
      isInvalid={errors.show}
      errorMessage={errors.message}
      onChange={(e) => {
        SetField(e.target.value);
      }}
    >
      {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
    </Select>
  );
}

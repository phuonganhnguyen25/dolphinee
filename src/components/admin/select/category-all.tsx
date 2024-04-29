"use client";

import { GetListSelectCategoryAllLevelAction } from "@/actions/category/get";
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

export default function SelectCategoryAllLevel<T, TKey extends string>({
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
    GetListSelectCategoryAllLevelAction().then((x) => {
      setData(x.data?.data ? x.data.data : []);
      setLoading(false);
      if (metadata.default_value) {
        SetField(metadata.default_value);
      }
    });
  }, []);

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
        const value = Number(e.target.value);
        SetField(value);
      }}
    >
      {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
    </Select>
  );
}

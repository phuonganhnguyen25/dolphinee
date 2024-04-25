import CreateCategoryForm from "@/components/admin/form/category";
import { IPageProps } from "@/interfaces";
import {
  GetCategoryById,
  GetListSelectCategoryLevel1,
} from "@/actions/category/get";
import CategoryTable from "@/components/admin/table/category";
import { Spacer } from "@nextui-org/react";

async function fetchData(category_id: number) {
  const category_by_id = await GetCategoryById(category_id);
  const category_selected_level1 = await GetListSelectCategoryLevel1();

  return {
    category_child_array: category_by_id.data?.data?.children || [],
    category_by_id,
    category_selected_level1:
      category_selected_level1?.data.data?.filter(
        (x) => x.value !== category_by_id.data?.data?.id
      ) || [],
    default_value: {
      name_en: category_by_id.data?.data?.name.name_en || "",
      name_vi: category_by_id.data?.data?.name.name_vi || "",
      parent_id: category_by_id.data?.data?.parent?.id || 0,
    },
  };
}

export default async function Home(props: IPageProps) {
  const { category_child_array, category_selected_level1, default_value } =
    await fetchData(Number(props.params.id));

  return (
    <section>
      <CreateCategoryForm
        categoryList={category_selected_level1}
        defaultFormValue={default_value}
        id={Number(props.params.id)}
      />
      <Spacer className="my-6" />
      <CategoryTable data={category_child_array} />
    </section>
  );
}

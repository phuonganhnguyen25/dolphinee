import CreateCategoryForm from "@/components/admin/form/category";
import { GetListCategoryLevel1 } from "@/actions/category/get";
import { PAYLOAD_CATEGORY_DEFAULT } from "@/actions/category";

async function fetchData() {
  const category_list_level1 = await GetListCategoryLevel1();
  const select_category = [{ label: "-", value: 0 }];

  const transform = category_list_level1?.data?.data
    ? category_list_level1.data?.data.map((item) => ({
        label: `${item.name.name_en}/${item.name.name_vi}`,
        value: item.id,
      }))
    : [];

  return {
    categoryList: [...select_category, ...transform],
    default_value: await PAYLOAD_CATEGORY_DEFAULT(),
  };
}

export default async function Home(props: any) {
  const { categoryList, default_value } = await fetchData();

  return (
    <section>
      <CreateCategoryForm
        categoryList={categoryList}
        defaultFormValue={default_value}
        id={null}
      />
    </section>
  );
}

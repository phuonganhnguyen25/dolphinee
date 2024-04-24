import { IPageParams } from "@/interfaces";
import CreateCategoryForm from "@/components/admin/form/category";
import { GetListCategoryLevel1 } from "@/actions/category/get";

async function fetchData() {
  const category_list_level1 = await GetListCategoryLevel1();
  const select_category = [{ label: "-", value: 0 }];

  const transform = category_list_level1.data?.data.map((item) => ({
    label: `${item.name.name_en}/${item.name.name_vi}`,
    value: item.id,
  }));

  return { categoryList: [...select_category, ...transform] };
}

export default async function Home(params: IPageParams) {
  const { categoryList } = await fetchData();

  return (
    <section>
      <CreateCategoryForm categoryList={categoryList} />
    </section>
  );
}

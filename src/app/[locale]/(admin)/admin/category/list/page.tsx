import CategoryTable from "@/components/admin/table/category";
import { IPageProps } from "@/interfaces";
import { GetListCategoryLevel1 } from "@/actions/category/get";

async function fetchData() {
  const category_list_level1 = await GetListCategoryLevel1();

  return { category_list_level1: category_list_level1.data.data };
}

export default async function Home(props: IPageProps) {
  const { category_list_level1 } = await fetchData();
  return (
    <section>
      <CategoryTable data={category_list_level1 || []} />
    </section>
  );
}

import { GetListCategoryLevel1 } from "@/actions/category/get";
import dynamic from "next/dynamic";
import SkeletonLoading from "@/components/admin/loading/skeleton";

const CategoryTable = dynamic(
  () => import("@/components/admin/table/category"),
  {
    loading: () => <SkeletonLoading />,
    ssr: false,
  },
);

async function fetchData() {
  const category_list_level1 = await GetListCategoryLevel1();

  return { category_list_level1: category_list_level1.data.data };
}

export default async function Home() {
  const { category_list_level1 } = await fetchData();
  return (
    <section>
      <CategoryTable data={category_list_level1 || []} />
    </section>
  );
}

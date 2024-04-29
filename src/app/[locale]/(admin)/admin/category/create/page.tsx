import { PAYLOAD_CATEGORY_DEFAULT } from "@/actions/category";
import dynamic from "next/dynamic";
import SkeletonLoading from "@/components/admin/loading/skeleton";

const CreateCategoryForm = dynamic(
  () => import("@/components/admin/form/category"),
  {
    loading: () => <SkeletonLoading />,
    ssr: false,
  },
);

async function fetchData() {
  return {
    default_value: await PAYLOAD_CATEGORY_DEFAULT(),
  };
}

export default async function Home() {
  const { default_value } = await fetchData();

  return (
    <section>
      <CreateCategoryForm defaultFormValue={default_value} id={null} />
    </section>
  );
}

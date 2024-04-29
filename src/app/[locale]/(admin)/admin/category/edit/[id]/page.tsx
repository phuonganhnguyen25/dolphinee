import {IPageProps} from "@/interfaces";
import {GetCategoryById} from "@/actions/category/get";
import {Spacer} from "@nextui-org/react";
import dynamic from "next/dynamic";
import SkeletonLoading from "@/components/admin/loading/skeleton";

const CreateCategoryForm = dynamic(() => import("@/components/admin/form/category"), {
    loading: () => <SkeletonLoading/>,
    ssr: false
});
const CategoryTable = dynamic(() => import("@/components/admin/table/category"), {
    loading: () => <SkeletonLoading/>,
    ssr: false
});

async function fetchData(category_id: number) {
    const category_by_id = await GetCategoryById(category_id);

    return {
        category_child_array: category_by_id.data?.data?.children || [],
        default_value: {
            name_en: category_by_id.data?.data?.name.name_en || "",
            name_vi: category_by_id.data?.data?.name.name_vi || "",
            parent_id: category_by_id.data?.data?.parent?.id || 0,
        },
    };
}

export default async function Home(props: IPageProps) {
    const {category_child_array, default_value} = await fetchData(
        Number(props.params.id)
    );

    return (
        <section>
            <CreateCategoryForm
                defaultFormValue={default_value}
                id={Number(props.params.id)}
            />
            <Spacer className="my-6"/>
            <CategoryTable data={category_child_array}/>
        </section>
    );
}

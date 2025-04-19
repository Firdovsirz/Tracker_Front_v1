import PageMeta from "../../components/common/PageMeta";
import TasksComponent from "../../components/tasks/TasksComponent";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function Notes() {
    return (
        <>
            <PageMeta
                title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Notes" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md" style={{fontSize: 30}}>
                    Tasks
                </h3>
                <TasksComponent />
            </div>
        </>
    );
}

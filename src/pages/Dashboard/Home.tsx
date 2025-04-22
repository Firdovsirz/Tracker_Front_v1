import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../components/common/PageMeta";
import SpeedDial from "../../components/speedDial/SpeedDial";
import InstallPrompt from "../../components/pwa/InstallPrompt";
export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7 flex flex-col justify-center items-center">

        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">Ftask</h1>
        <p className="mb-2 font-semibold text-gray-800 text-title-s dark:text-white/90 sm:text-title-md" style={{textAlign: "center"}}>Developed by Firdovsi Rzaev {`( Full-Stack Developer )`}</p>
        </div>
          <InstallPrompt />
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div> */}
      </div>
      <SpeedDial />
    </>
  );
}

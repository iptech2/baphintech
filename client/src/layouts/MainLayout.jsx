import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import MobileNavigation from "../components/mobileNavigation/MobileNavigation";
import WorkingBanner from "../components/workingBanner/WorkingBanner";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <Navbar />

      <WorkingBanner />

      <main className="w-full pb-20 lg:pb-0">
        {children}
      </main>

      <Footer />

      <MobileNavigation />
    </div>
  );
}

export default MainLayout;
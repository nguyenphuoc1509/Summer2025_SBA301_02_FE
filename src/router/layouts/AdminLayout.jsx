import Footer from "../../components/Footer/Footer";
import HeaderAdmin from "../../components/Header/HeaderAdmin";
import Sidebar from "../../components/Sidebar/Sidebar";

export const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 mt-16">
      <HeaderAdmin />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64">{children}</main>
      </div>
    </div>
  );
};

import HeaderComponent from "../../components/Header/Header";
import FooterComponent from "../../components/Footer/Footer";

export const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderComponent />
      <div className="flex pt-[66px]">
        <main className="flex-1">{children}</main>
      </div>
      <FooterComponent />
    </div>
  );
};

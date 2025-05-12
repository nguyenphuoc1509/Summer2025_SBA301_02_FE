import HeaderComponent from "../../components/Header/Header";
import FooterComponent from "../../components/Footer/Footer";

export const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <HeaderComponent />
      <div className="flex pt-[66px]">
        <main className="flex-1">{children}</main>
      </div>
      <FooterComponent />
    </div>
  );
};

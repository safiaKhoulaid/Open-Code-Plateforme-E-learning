import NavBar from "@/components/header/navbar";
import{ Footer }from "@/components/footer/footer";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <>
      <NavBar />
      <main className=''>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

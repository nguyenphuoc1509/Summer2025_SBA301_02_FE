import React, { useState } from "react";
import LoginPopup from "../../../components/Auth/LoginPopup";

const LoginCustomer = () => {
  const [show, setShow] = useState(true);

  // Khi đóng popup, có thể chuyển hướng hoặc ẩn popup
  const handleClose = () => {
    setShow(false);
    // window.location.href = "/"; // Nếu muốn chuyển về trang chủ khi đóng
  };

  return <>{show && <LoginPopup onClose={handleClose} />}</>;
};

export default LoginCustomer;

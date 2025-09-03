import React from "react";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate()
  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <h2 className="mb-3"> Status 404. page not found</h2>
      <button onClick={()=>navigate('/login')} className="mt-2 text-blue-500 underline">Dashboard</button>
    </div>
  );
}

export default ErrorPage;

import { Navigate } from "react-router-dom";


function PrivateAuthRedirectRoute({children})  {
  const localToken = localStorage.getItem("token");
  const localRole = localStorage.getItem("role");
  // console.log(role, localRole, localToken);
  if (localRole && localToken) {
     return <Navigate to={`/${localRole}`} replace />;
  }
  return children;
}
export default PrivateAuthRedirectRoute
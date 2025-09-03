import { Navigate } from "react-router-dom";
function ProtectedRoute({ isSignedIn, children }: any) {
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
}
export default ProtectedRoute;

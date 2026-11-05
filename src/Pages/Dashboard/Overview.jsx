import { useAuth } from "../../Authentication/useAuth";
import ClientOverview from "./ClientOverview";
import FreelancerOverview from "./FreelancerOverview";
import AdminOverview from "./AdminOverview";

const Overview = () => {
  const { role } = useAuth();
  if (role === "admin") return <AdminOverview />;
  if (role === "freelancer") return <FreelancerOverview />;
  return <ClientOverview />;
};

export default Overview;

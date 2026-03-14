import DashboardLayout from "@/components/layout/DashboardLayout/DashboardLayout";
import CustomersPage from "@/components/views/Customer/Customer";

const CustomerPage = () => {
  return (
    <DashboardLayout title="Customer List">
      <CustomersPage />
    </DashboardLayout>
  );
};

export default CustomerPage;

import AdminCrudPage, { FieldConfig } from "@/components/AdminCrudPage";
import { useAdminTable } from "@/hooks/useAdminData";

const fields: FieldConfig[] = [
  { name: "lga", label: "LGA", type: "text", required: true },
  { name: "name", label: "Coordinator Name", type: "text", required: true },
  { name: "phone", label: "Phone", type: "text" },
  { name: "is_active", label: "Active", type: "boolean" },
];

const AdminLgaCoordinators = () => {
  const { data, isLoading, create, update, remove, isCreating, isUpdating, isDeleting } = useAdminTable("lga_coordinators");
  return (
    <AdminCrudPage
      title="LGA Coordinators"
      fields={fields}
      data={data}
      isLoading={isLoading}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
      isCreating={isCreating}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
      displayColumns={["lga", "name", "phone", "is_active"]}
    />
  );
};

export default AdminLgaCoordinators;

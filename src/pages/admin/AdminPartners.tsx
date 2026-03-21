import AdminCrudPage, { FieldConfig } from "@/components/AdminCrudPage";
import { useAdminTable } from "@/hooks/useAdminData";

const fields: FieldConfig[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "logo_url", label: "Logo URL", type: "text", required: true },
  { name: "website_url", label: "Website URL", type: "text" },
  { name: "sort_order", label: "Sort Order", type: "number" },
  { name: "is_active", label: "Active", type: "boolean" },
];

const AdminPartners = () => {
  const { data, isLoading, create, update, remove, isCreating, isUpdating, isDeleting } = useAdminTable("partners");
  return (
    <AdminCrudPage
      title="Partners"
      fields={fields}
      data={data}
      isLoading={isLoading}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
      isCreating={isCreating}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
      displayColumns={["name", "logo_url", "sort_order", "is_active"]}
    />
  );
};

export default AdminPartners;

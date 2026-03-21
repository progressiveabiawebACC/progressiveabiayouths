import AdminCrudPage, { FieldConfig } from "@/components/AdminCrudPage";
import { useAdminTable } from "@/hooks/useAdminData";

const fields: FieldConfig[] = [
  { name: "label", label: "Label", type: "text", required: true },
  { name: "value", label: "Value", type: "number", required: true },
  { name: "suffix", label: "Suffix", type: "text" },
  { name: "sort_order", label: "Sort Order", type: "number" },
];

const AdminStats = () => {
  const { data, isLoading, create, update, remove, isCreating, isUpdating, isDeleting } = useAdminTable("site_stats");
  return (
    <AdminCrudPage
      title="Site Stats"
      fields={fields}
      data={data}
      isLoading={isLoading}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
      isCreating={isCreating}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
      displayColumns={["label", "value", "suffix", "sort_order"]}
    />
  );
};

export default AdminStats;

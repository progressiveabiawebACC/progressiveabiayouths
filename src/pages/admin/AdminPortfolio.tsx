import AdminCrudPage, { FieldConfig } from "@/components/AdminCrudPage";
import { useAdminTable } from "@/hooks/useAdminData";

const fields: FieldConfig[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "category", label: "Category", type: "text", required: true },
  { name: "image_url", label: "Image URL", type: "text", required: true },
  { name: "sort_order", label: "Sort Order", type: "number" },
  { name: "is_active", label: "Active", type: "boolean" },
];

const AdminPortfolio = () => {
  const { data, isLoading, create, update, remove, isCreating, isUpdating, isDeleting } = useAdminTable("portfolio_items");
  return (
    <AdminCrudPage
      title="Portfolio"
      fields={fields}
      data={data}
      isLoading={isLoading}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
      isCreating={isCreating}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
      displayColumns={["title", "category", "sort_order", "is_active"]}
    />
  );
};

export default AdminPortfolio;

import AdminCrudPage, { FieldConfig } from "@/components/AdminCrudPage";
import { useAdminTable } from "@/hooks/useAdminData";

const fields: FieldConfig[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "time", label: "Time", type: "text", required: true },
  { name: "location", label: "Location", type: "text", required: true },
  { name: "category", label: "Category", type: "text", required: true },
  { name: "image_url", label: "Image URL", type: "text", required: true },
  { name: "is_active", label: "Active", type: "boolean" },
];

const AdminEvents = () => {
  const { data, isLoading, create, update, remove, isCreating, isUpdating, isDeleting } = useAdminTable("events");
  return (
    <AdminCrudPage
      title="Events"
      fields={fields}
      data={data}
      isLoading={isLoading}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
      isCreating={isCreating}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
      displayColumns={["title", "date", "category", "is_active"]}
    />
  );
};

export default AdminEvents;

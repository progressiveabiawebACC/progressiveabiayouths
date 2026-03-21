import AdminCrudPage, { FieldConfig } from "@/components/AdminCrudPage";
import { useAdminTable } from "@/hooks/useAdminData";

const fields: FieldConfig[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "role", label: "Role", type: "text", required: true },
  { name: "image_url", label: "Image URL", type: "text" },
  { name: "bio", label: "Bio", type: "textarea" },
  { name: "sort_order", label: "Sort Order", type: "number" },
  { name: "is_active", label: "Active", type: "boolean" },
];

const AdminTeam = () => {
  const { data, isLoading, create, update, remove, isCreating, isUpdating, isDeleting } = useAdminTable("team_members");
  return (
    <AdminCrudPage
      title="Team Members"
      fields={fields}
      data={data}
      isLoading={isLoading}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
      isCreating={isCreating}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
      displayColumns={["name", "role", "sort_order", "is_active"]}
    />
  );
};

export default AdminTeam;

import AdminCrudPage, { FieldConfig } from "@/components/AdminCrudPage";
import { useAdminTable } from "@/hooks/useAdminData";

const fields: FieldConfig[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "subtitle", label: "Subtitle", type: "textarea", required: true },
  { name: "image_url", label: "Image URL", type: "text", required: true },
  { name: "cta1_label", label: "CTA 1 Label", type: "text" },
  { name: "cta1_link", label: "CTA 1 Link", type: "text" },
  { name: "cta2_label", label: "CTA 2 Label", type: "text" },
  { name: "cta2_link", label: "CTA 2 Link", type: "text" },
  { name: "sort_order", label: "Sort Order", type: "number" },
  { name: "is_active", label: "Active", type: "boolean" },
];

const AdminHeroSlides = () => {
  const { data, isLoading, create, update, remove, isCreating, isUpdating, isDeleting } = useAdminTable("hero_slides");
  return (
    <AdminCrudPage
      title="Hero Slides"
      fields={fields}
      data={data}
      isLoading={isLoading}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
      isCreating={isCreating}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
      displayColumns={["title", "subtitle", "sort_order", "is_active"]}
    />
  );
};

export default AdminHeroSlides;

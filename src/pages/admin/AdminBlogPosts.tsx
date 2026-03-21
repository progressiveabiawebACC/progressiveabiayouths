import AdminCrudPage, { FieldConfig } from "@/components/AdminCrudPage";
import { useAdminTable } from "@/hooks/useAdminData";

const fields: FieldConfig[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
  { name: "content", label: "Content", type: "textarea", required: true },
  { name: "author", label: "Author", type: "text", required: true },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "category", label: "Category", type: "text", required: true },
  { name: "tags", label: "Tags", type: "tags" },
  { name: "image_url", label: "Image URL", type: "text", required: true },
  { name: "read_time", label: "Read Time", type: "text" },
  { name: "is_published", label: "Published", type: "boolean" },
];

const AdminBlogPosts = () => {
  const { data, isLoading, create, update, remove, isCreating, isUpdating, isDeleting } = useAdminTable("blog_posts");
  return (
    <AdminCrudPage
      title="Blog Posts"
      fields={fields}
      data={data}
      isLoading={isLoading}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
      isCreating={isCreating}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
      displayColumns={["title", "author", "category", "is_published"]}
    />
  );
};

export default AdminBlogPosts;

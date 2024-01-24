import { api } from "~/trpc/server";

import AdminListItem from "./AdminListItem";

interface AdminListProps {
  query?: string;
}

export default async function AdminList({ query }: AdminListProps) {
  const admins = await api.admin.getAdmins.query(query);
  return (
    <>
      {admins.map((admin) => (
        <AdminListItem key={admin.user.id} admin={admin} />
      ))}
    </>
  );
}

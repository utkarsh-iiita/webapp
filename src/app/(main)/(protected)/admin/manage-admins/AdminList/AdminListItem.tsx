import { type api } from "~/trpc/server";

type admins = ReturnType<typeof api.admin.getAdmins.query> extends Promise<
  infer T
>
  ? T
  : never;

interface AdminListItemProps {
  admin: admins[number];
}

export default function AdminListItem({ admin }: AdminListItemProps) {
  return <div>{admin.user.name}</div>;
}

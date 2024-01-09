import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";

export default async function LoginLayout(props) {
  const session = await getServerAuthSession();
  if (session) {
    redirect("/dashboard");
  }

  return props.children;
}

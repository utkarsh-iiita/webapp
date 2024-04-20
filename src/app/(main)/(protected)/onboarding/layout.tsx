import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
export default async function ProtectedPagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let session = await getServerAuthSession();
    if (session?.user?.userGroup !== "student") {
        return redirect("/admin");
    }
    if (session?.user?.isOnboardingComplete === true) {
        return redirect("/dashboard");
    }
    return <>{children}</>;
}

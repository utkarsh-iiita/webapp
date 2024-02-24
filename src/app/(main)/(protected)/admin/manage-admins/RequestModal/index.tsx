import { api } from "~/trpc/server";

import RequestModalClient from "./modal";

export default async function RequestModal() {
    const requests = await api.admin.getAdmins.query({ query: '', permissions: 0 });

    return <RequestModalClient requests={requests} />
}
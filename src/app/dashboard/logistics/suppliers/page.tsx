import { getLogisticsSuppliers } from "@/app/actions/logistics-suppliers";
import { SuppliersClient } from "./suppliers-client";

export default async function SettingsSuppliersPage() {
    const suppliers = await getLogisticsSuppliers();

    return <SuppliersClient initialSuppliers={suppliers} />;
}

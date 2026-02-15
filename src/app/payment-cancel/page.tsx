import { Suspense } from "react";
import PaymentCancel from "@/components/pages/PaymentCancel";

export default function PaymentCancelPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentCancel />
        </Suspense>
    );
}

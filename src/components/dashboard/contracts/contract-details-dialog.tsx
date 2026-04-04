"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ContractPDFPreview } from "./contract-pdf-preview"

interface ContractDetailsDialogProps {
    contract: any | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ContractDetailsDialog({ contract, open, onOpenChange }: ContractDetailsDialogProps) {
    if (!contract) return null

    // Mock form data structure expected by ContractPDFPreview
    const mockFormData = {
        clientName: contract.clientName,
        clientDoc: "000.000.000-00", // Mock
        eventDate: new Date(contract.date),
        venue: contract.eventName, // Using event name as venue for now
        startTime: "22:00",
        endTime: "00:00",
        fee: contract.amount,
        amount: contract.amount,
        includeRider: true,
        contractType: "BAR" as const
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detalhes do Contrato: {contract.id}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <ContractPDFPreview data={mockFormData} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

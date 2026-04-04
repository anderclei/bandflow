"use client"

import React, { useRef, useState } from "react"
import SignatureCanvas from "react-signature-canvas"
import { Button } from "@/components/ui/button"
import { Eraser, Check } from "lucide-react"

interface DigitalSignaturePadProps {
    onSave: (signatureData: string) => void
}

export function DigitalSignaturePad({ onSave }: DigitalSignaturePadProps) {
    const sigCanvas = useRef<SignatureCanvas>(null)
    const [isEmpty, setIsEmpty] = useState(true)

    const clear = () => {
        sigCanvas.current?.clear()
        setIsEmpty(true)
    }

    const save = () => {
        if (sigCanvas.current) {
            const data = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")
            onSave(data)
        }
    }

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white">
                <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{
                        width: 500,
                        height: 200,
                        className: "signature-canvas w-full h-[200px]"
                    }}
                    onBegin={() => setIsEmpty(false)}
                />
            </div>
            <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={clear} disabled={isEmpty} className="h-9 px-4">
                    <Eraser className="mr-2 h-4 w-4" />
                    Limpar
                </Button>
                <Button size="sm" onClick={save} disabled={isEmpty} className="h-9 px-4 font-bold">
                    <Check className="mr-2 h-4 w-4" />
                    Confirmar Assinatura
                </Button>
            </div>
        </div>
    )
}

"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import QRValidator from "@/components/qr-validator"

export default function ValidateTicketPage() {
  const params = useParams()
  const [qrData, setQrData] = useState<string>("")

  useEffect(() => {
    // Simular datos del QR basados en el ID del ticket
    const ticketId = params.ticketId as string
    const [orderNumber, seatId, customerName, eventDate] = ticketId.split("-")

    const mockQRData = JSON.stringify({
      orderNumber: orderNumber,
      seatId: seatId,
      customerName: customerName,
      eventDate: eventDate,
      validationUrl: `https://livenation.com/validate/${ticketId}`,
    })

    setQrData(mockQRData)
  }, [params.ticketId])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Validación de Ticket</h1>
          <p className="text-gray-600">Sistema de verificación Live Nation</p>
        </div>

        {qrData && <QRValidator qrData={qrData} />}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Sistema de validación seguro
            <br />© 2025 Live Nation Productions
          </p>
        </div>
      </div>
    </div>
  )
}

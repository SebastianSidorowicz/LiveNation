"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import QRValidator from "./qr-validator"

export default function TestQRScanner() {
  const [qrData, setQrData] = useState("")
  const [showValidator, setShowValidator] = useState(false)

  const handleTestValidation = () => {
    // Simular datos de QR para prueba
    const testQRData = JSON.stringify({
      orderNumber: "LN12345678",
      seatId: "A1",
      customerName: "Juan Pérez",
      eventDate: "2025-06-20",
      validationUrl: `${window.location.origin}/validate/LN12345678-A1`,
    })

    setQrData(testQRData)
    setShowValidator(true)
  }

  const handleManualQR = () => {
    if (qrData.trim()) {
      setShowValidator(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-md">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🔍 Probador de QR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleTestValidation} className="w-full bg-green-600 hover:bg-green-700">
              🎫 Probar Ticket Válido
            </Button>

            <div className="space-y-2">
              <Label htmlFor="qr-input">O pega datos de QR manualmente:</Label>
              <Input
                id="qr-input"
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                placeholder="Pega los datos del QR aquí..."
              />
              <Button onClick={handleManualQR} variant="outline" className="w-full">
                Validar QR Manual
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                💡 Tip: Escanea el QR del ticket descargado o usa el botón de prueba
              </p>
            </div>
          </CardContent>
        </Card>

        {showValidator && qrData && (
          <div className="space-y-4">
            <QRValidator qrData={qrData} />
            <Button onClick={() => setShowValidator(false)} variant="outline" className="w-full">
              Cerrar Validador
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

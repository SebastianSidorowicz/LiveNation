"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Square, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TestQRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [scannedData, setScannedData] = useState<string>("")
  const [error, setError] = useState<string>("")
  const router = useRouter()

  const playScanBeep = async () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      if (audioContext.state === "suspended") await audioContext.resume()

      // Sonido de escaneo simple - beep corto
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.type = "square"

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)

      console.log("🔊 Beep de escaneo reproducido")
    } catch (error) {
      console.error("Error reproduciendo sonido:", error)
    }
  }

  const startCamera = async () => {
    try {
      setError("")
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setIsScanning(true)
      }
    } catch (err) {
      setError("No se pudo acceder a la cámara. Asegúrate de dar permisos.")
      console.error("Error accessing camera:", err)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsScanning(false)
  }

  const simulateQRScan = async () => {
    // Simular diferentes tipos de tickets
    const mockTickets = [
      "12345-A1-Juan%20Pérez-Bad%20Bunny",
      "67890-B5-María%20García-Dua%20Lipa",
      "11111-C3-Carlos%20López-Queen",
      "22222-D7-Ana%20Martín-Oasis",
    ]

    const randomTicket = mockTickets[Math.floor(Math.random() * mockTickets.length)]
    const qrUrl = `https://livenation.com/validate/${randomTicket}`

    setScannedData(qrUrl)

    // Reproducir beep de escaneo (no el sonido de iPhone)
    await playScanBeep()

    // Pequeña pausa para mostrar el resultado
    setTimeout(() => {
      router.push(`/validate/${randomTicket}`)
    }, 800)
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-6 w-6" />
              <span>Escáner QR - Live Nation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Vista de la cámara */}
            <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />

              {/* Overlay de escaneo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>

                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-red-500 animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {scannedData && (
              <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
                <p className="text-green-700 text-sm font-semibold">✅ QR Escaneado</p>
                <p className="text-green-600 text-xs mt-1">Redirigiendo a validación...</p>
              </div>
            )}

            {/* Controles */}
            <div className="flex space-x-2">
              {!isScanning ? (
                <Button onClick={startCamera} className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Iniciar Cámara
                </Button>
              ) : (
                <Button onClick={stopCamera} variant="outline" className="flex-1 bg-transparent">
                  <Square className="h-4 w-4 mr-2" />
                  Detener
                </Button>
              )}

              <Button onClick={simulateQRScan} variant="secondary">
                <RotateCcw className="h-4 w-4 mr-2" />
                Simular QR
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Apunta la cámara hacia un código QR de ticket
                <br />o usa "Simular QR" para probar
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

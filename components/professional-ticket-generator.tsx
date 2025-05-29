"use client"

import { jsPDF } from "jspdf"
import QRCode from "qrcode"

interface TicketData {
  seatId: string
  section: string
  price: number
  orderNumber: string
  customerName: string
  eventName: string
  eventDate: string
  eventTime: string
  eventLocation: string
}

export class ProfessionalTicketGenerator {
  private doc: jsPDF
  private pageWidth: number
  private pageHeight: number

  constructor() {
    this.doc = new jsPDF()
    this.pageWidth = this.doc.internal.pageSize.getWidth()
    this.pageHeight = this.doc.internal.pageSize.getHeight()
  }

  async generateTicket(ticketData: TicketData, yPosition = 30): Promise<number> {
    const ticketHeight = 100
    const margin = 20
    const ticketWidth = this.pageWidth - 2 * margin

    // Verificar si necesitamos nueva página
    if (yPosition + ticketHeight > this.pageHeight - 30) {
      this.doc.addPage()
      yPosition = 30
    }

    // Fondo principal del ticket
    this.doc.setFillColor(255, 255, 255) // Blanco
    this.doc.rect(margin, yPosition, ticketWidth, ticketHeight, "F")

    // Borde exterior elegante
    this.doc.setDrawColor(220, 38, 38) // Rojo Live Nation
    this.doc.setLineWidth(2)
    this.doc.rect(margin, yPosition, ticketWidth, ticketHeight, "S")

    // Borde interior decorativo
    this.doc.setDrawColor(240, 240, 240)
    this.doc.setLineWidth(0.5)
    this.doc.rect(margin + 3, yPosition + 3, ticketWidth - 6, ticketHeight - 6, "S")

    // Sección izquierda (información principal)
    const leftSectionWidth = ticketWidth * 0.65
    const rightSectionX = margin + leftSectionWidth

    // Header con logo 
    this.doc.setFont("helvetica", "bold")
    this.doc.setFontSize(14)
    this.doc.setTextColor(220, 38, 38)
    this.doc.text("LIVE NATION", margin + 8, yPosition + 15)

    this.doc.setFontSize(8)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text("PRODUCTIONS", margin + 8, yPosition + 22)

    // Nombre del evento
    this.doc.setFont("helvetica", "bold")
    this.doc.setFontSize(12)
    this.doc.setTextColor(0, 0, 0)
    const eventName = this.splitText(ticketData.eventName.toUpperCase(), 25)
    this.doc.text(eventName[0], margin + 8, yPosition + 35)
    if (eventName[1]) {
      this.doc.text(eventName[1], margin + 8, yPosition + 42)
    }

    // Información del evento 
    this.doc.setFont("helvetica", "normal")
    this.doc.setFontSize(9)
    this.doc.setTextColor(60, 60, 60)
    this.doc.text(`FECHA: ${ticketData.eventDate}`, margin + 8, yPosition + 55)
    this.doc.text(`HORA: ${ticketData.eventTime}`, margin + 8, yPosition + 63)

    // Ubicación 
    const location = this.splitText(ticketData.eventLocation, 30)
    this.doc.text(`LUGAR: ${location[0]}`, margin + 8, yPosition + 71)
    if (location[1]) {
      this.doc.text(`       ${location[1]}`, margin + 8, yPosition + 78)
    }

    // Información del asiento
    this.doc.setFont("helvetica", "bold")
    this.doc.setFontSize(16)
    this.doc.setTextColor(220, 38, 38)
    this.doc.text(`ASIENTO ${ticketData.seatId}`, margin + 8, yPosition + 92)

    // Línea divisoria vertical con perforaciones
    this.doc.setDrawColor(180, 180, 180)
    this.doc.setLineWidth(1)
    for (let i = 0; i < ticketHeight; i += 3) {
      if (i % 6 < 3) {
        // Crear efecto de perforación
        this.doc.line(rightSectionX, yPosition + i, rightSectionX, yPosition + i + 1.5)
      }
    }

    // Sección derecha (stub)
    const stubWidth = ticketWidth - leftSectionWidth

    // Fondo del stub
    this.doc.setFillColor(220, 38, 38)
    this.doc.rect(rightSectionX + 2, yPosition + 5, stubWidth - 4, ticketHeight - 10, "F")

    // Contenido del stub
    this.doc.setFont("helvetica", "bold")
    this.doc.setFontSize(10)
    this.doc.setTextColor(255, 255, 255)
    this.doc.text("ADMIT ONE", rightSectionX + 8, yPosition + 18)

    this.doc.setFontSize(14)
    this.doc.text(ticketData.seatId, rightSectionX + 8, yPosition + 30)

    this.doc.setFontSize(8)
    this.doc.text(ticketData.section, rightSectionX + 8, yPosition + 38)
    this.doc.text(`$${this.formatPrice(ticketData.price)}`, rightSectionX + 8, yPosition + 46)

    // Generar QR Code
    const qrData = `${typeof window !== "undefined" ? window.location.origin : "https://livenation.com"}/validate/${ticketData.orderNumber}-${ticketData.seatId}`

    try {
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 120,
        margin: 0,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "M",
      })

      const qrSize = 25
      const qrX = rightSectionX + (stubWidth - qrSize) / 2
      const qrY = yPosition + 55
      this.doc.addImage(qrCodeDataURL, "PNG", qrX, qrY, qrSize, qrSize)
    } catch (error) {
      console.error("Error generando QR:", error)
      // Fallback: rectángulo con texto
      this.doc.setDrawColor(255, 255, 255)
      this.doc.setLineWidth(1)
      this.doc.rect(rightSectionX + 8, yPosition + 55, 25, 25, "S")
      this.doc.setFontSize(6)
      this.doc.setTextColor(255, 255, 255)
      this.doc.text("QR", rightSectionX + 18, yPosition + 68, { align: "center" })
    }

    // Número de orden en el stub
    this.doc.setFont("helvetica", "normal")
    this.doc.setFontSize(6)
    this.doc.setTextColor(255, 255, 255)
    this.doc.text(`#${ticketData.orderNumber}`, rightSectionX + 8, yPosition + 88)

    // Información adicional en la sección izquierda
    this.doc.setFont("helvetica", "normal")
    this.doc.setFontSize(8)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text(`SECCION: ${ticketData.section}`, margin + 80, yPosition + 85)
    this.doc.text(`PRECIO: $${this.formatPrice(ticketData.price)}`, margin + 80, yPosition + 92)

    // Marca de agua sutil
    this.doc.setFont("helvetica", "bold")
    this.doc.setFontSize(24)
    this.doc.setTextColor(250, 250, 250)
    this.doc.text("Live Nation®", margin + 40, yPosition + 60, { angle: -15 })

    // Footer elegante
    this.doc.setFontSize(8)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text(
      "2025 Live Nation Productions. Todos los derechos reservados.",
      this.pageWidth / 2,
      this.pageHeight - 20,
      { align: "center" },
    )
    
    return yPosition + ticketHeight + 15

  }

  private splitText(text: string, maxLength: number): string[] {
    if (text.length <= maxLength) return [text]

    const words = text.split(" ")
    const lines: string[] = []
    let currentLine = ""

    for (const word of words) {
      if ((currentLine + word).length <= maxLength) {
        currentLine += (currentLine ? " " : "") + word
      } else {
        if (currentLine) lines.push(currentLine)
        currentLine = word
      }
    }

    if (currentLine) lines.push(currentLine)
    return lines.slice(0, 2) // Máximo 2 líneas
  }

  private formatPrice(price: number): string {
    return price.toLocaleString("es-ES")
  }

  async generateAllTickets(tickets: TicketData[]): Promise<void> {
    let currentY = 30

    // Página de portada mejorada
    this.addCoverPage(tickets[0])
    this.doc.addPage()

    // Título de la página de tickets
    this.doc.setFont("helvetica", "bold")
    this.doc.setFontSize(18)
    this.doc.setTextColor(220, 38, 38)
    this.doc.text("TUS TICKETS", this.pageWidth / 2, 20, { align: "center" })

    currentY = 35

    // Generar cada ticket
    for (const ticket of tickets) {
      currentY = await this.generateTicket(ticket, currentY)
    }
  }

  private addCoverPage(firstTicket: TicketData): void {
    const centerX = this.pageWidth / 2

    // Fondo de la portada con gradiente simulado
    this.doc.setFillColor(220, 38, 38)
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight, "F")

    // Elementos decorativos
    this.doc.setFillColor(180, 28, 28)
    this.doc.circle(20, 40, 15, "F")
    this.doc.circle(this.pageWidth - 20, this.pageHeight - 40, 20, "F")

    // Logo y título principal 
    this.doc.setFont("helvetica", "bold")
    this.doc.setFontSize(28)
    this.doc.setTextColor(255, 255, 255)
    this.doc.text("LIVE NATION", centerX, 60, { align: "center" })

    this.doc.setFontSize(14)
    this.doc.text("PRODUCTIONS", centerX, 75, { align: "center" })

    // Línea decorativa
    this.doc.setDrawColor(255, 255, 255)
    this.doc.setLineWidth(2)
    this.doc.line(centerX - 50, 85, centerX + 50, 85)

    // Información del evento
    this.doc.setFontSize(20)
    this.doc.text(firstTicket.eventName.toUpperCase(), centerX, 110, { align: "center" })

    this.doc.setFontSize(14)
    this.doc.text(`${firstTicket.eventDate} - ${firstTicket.eventTime}`, centerX, 130, { align: "center" })

    // Ubicación
    const locationLines = this.splitText(firstTicket.eventLocation, 40)
    this.doc.text(locationLines[0], centerX, 145, { align: "center" })
    if (locationLines[1]) {
      this.doc.text(locationLines[1], centerX, 155, { align: "center" })
    }

    // Información del cliente
    this.doc.setFontSize(12)
    this.doc.text(`TITULAR: ${firstTicket.customerName}`, centerX, 180, { align: "center" })
    this.doc.text(`ORDEN: ${firstTicket.orderNumber}`, centerX, 195, { align: "center" })

    // Instrucciones importantes
    this.doc.setFontSize(11)
    this.doc.text("INSTRUCCIONES IMPORTANTES", centerX, 220, { align: "center" })

    this.doc.setFontSize(9)
    const instructions = [
      "- Presenta este ticket en la entrada del evento",
      "- Trae una identificacion valida",
      "- Llega 30 minutos antes del evento",
      "- No se permite reingreso",
    ]

    instructions.forEach((instruction, index) => {
      this.doc.text(instruction, centerX, 235 + index * 10, { align: "center" })
    })
  }

  save(filename: string): void {
    this.doc.save(filename)
  }
}

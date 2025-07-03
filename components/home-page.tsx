"use client"

import { useState } from "react"
import ShowSearchHome from "@/components/show-search-home"
import ShowDetailPage from "@/components/show-detail-page"

interface HomePageProps {
  onLogout: () => void
}

type PageState = "search" | "show-detail"

export default function HomePage({ onLogout }: HomePageProps) {
  const [currentPage, setCurrentPage] = useState<PageState>("search")
  const [selectedShowId, setSelectedShowId] = useState<string>("")

  const handleSelectShow = (showId: string) => {
    setSelectedShowId(showId)
    setCurrentPage("show-detail")
  }

  const handleBackToSearch = () => {
    setCurrentPage("search")
    setSelectedShowId("")
  }

  if (currentPage === "show-detail") {
    return <ShowDetailPage showId={selectedShowId} onBack={handleBackToSearch} />
  }

  return <ShowSearchHome onLogout={onLogout} onSelectShow={handleSelectShow} />
}

"use client"

import { useState, useEffect } from "react"

export interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouch: boolean
  screenSize: {
    width: number
    height: number
  }
  orientation: "portrait" | "landscape" | null
}

export function useDevice(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouch: false,
    screenSize: {
      width: 0,
      height: 0,
    },
    orientation: null,
  })

  useEffect(() => {
    const updateDeviceInfo = () => {
      if (typeof window === "undefined") return

      const width = window.innerWidth
      const height = window.innerHeight

      // Check for touch capability
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0

      // Determine device type based on screen size and touch capability
      const isMobile = width < 768 && (isTouch || width < 640)
      const isTablet = width >= 768 && width < 1024
      const isDesktop = width >= 1024 || (!isTouch && width >= 768)

      // Determine orientation
      let orientation: "portrait" | "landscape" | null = null
      if (typeof window.screen?.orientation !== "undefined") {
        orientation = window.screen.orientation.angle === 0 || window.screen.orientation.angle === 180
          ? "portrait"
          : "landscape"
      } else if (width > height) {
        orientation = "landscape"
      } else {
        orientation = "portrait"
      }

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isTouch,
        screenSize: { width, height },
        orientation,
      })
    }

    // Initial check
    updateDeviceInfo()

    // Listen for resize and orientation changes
    window.addEventListener("resize", updateDeviceInfo)
    window.addEventListener("orientationchange", updateDeviceInfo)

    return () => {
      window.removeEventListener("resize", updateDeviceInfo)
      window.removeEventListener("orientationchange", updateDeviceInfo)
    }
  }, [])

  return deviceInfo
}

// Helper hook for mobile-specific behavior
export function useMobileAdaptation() {
  const { isMobile, isTouch, screenSize } = useDevice()

  return {
    // Common mobile adaptations
    touchTargetSize: isMobile ? 44 : 32, // Minimum 44px for touch targets
    spacing: isMobile ? "space-y-4" : "space-y-6",
    padding: isMobile ? "p-4" : "p-6",
    textSize: isMobile ? "text-sm" : "text-base",
    iconSize: isMobile ? 20 : 24,

    // Interaction patterns
    dragEnabled: !isMobile, // Disable drag on mobile
    contextMenuEnabled: !isTouch, // Disable context menus on touch devices
    doubleClickEnabled: !isTouch, // Disable double-click on touch devices

    // Layout adjustments
    gridCols: isMobile ? 1 : 2,
    maxWidth: isMobile ? "max-w-full" : "max-w-6xl",

    // Device info
    isMobile,
    isTouch,
    screenSize,
  }
}
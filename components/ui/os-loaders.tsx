"use client"

import { cn } from "@/lib/utils"

type OSTheme = "dos" | "win98" | "winxp" | "mac9" | "zephyr"

interface OSLoaderProps {
  os: OSTheme
  className?: string
  size?: "sm" | "md" | "lg"
}

export function OSLoader({ os, className, size = "md" }: OSLoaderProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  switch (os) {
    case "dos":
      return <DOSLoader className={cn(sizeClasses[size], className)} />
    case "win98":
      return <Win98Loader className={cn(sizeClasses[size], className)} />
    case "winxp":
      return <WinXPLoader className={cn(sizeClasses[size], className)} />
    case "mac9":
      return <Mac9Loader className={cn(sizeClasses[size], className)} />
    case "zephyr":
      return <ZephyrLoader className={cn(sizeClasses[size], className)} />
    default:
      return <GenericLoader className={cn(sizeClasses[size], className)} />
  }
}

function DOSLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-2 dos-text", className)}>
      <span>Loading...</span>
      <span className="animate-pulse">█</span>
    </div>
  )
}

function Win98Loader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="win98-button px-2 py-1 text-xs flex items-center space-x-1">
        <div className="w-3 h-3 border border-gray-400 bg-gray-200 flex items-center justify-center">
          <div className="w-2 h-2 border border-gray-600 bg-gray-300 animate-spin rounded-full" />
        </div>
        <span>Loading...</span>
      </div>
    </div>
  )
}

function WinXPLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className="relative w-4 h-4">
        <div className="absolute inset-0 border-2 border-blue-300 rounded-full animate-spin border-t-transparent" />
        <div className="absolute inset-1 bg-blue-600 rounded-full animate-pulse" />
      </div>
      <span>Please wait...</span>
    </div>
  )
}

function Mac9Loader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span>Loading...</span>
    </div>
  )
}

function ZephyrLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className="relative">
        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-0 w-6 h-6 border border-cyan-300 rounded-full animate-ping opacity-30" />
      </div>
      <span className="text-cyan-400">Initializing...</span>
    </div>
  )
}

function GenericLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      <span>Loading...</span>
    </div>
  )
}

// Skeleton loaders for different content types
interface OSSkeletonProps {
  os: OSTheme
  type: "text" | "card" | "list" | "button"
  lines?: number
  className?: string
}

export function OSSkeleton({ os, type, lines = 3, className }: OSSkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200"

  switch (os) {
    case "dos":
      return <DOSSkeleton type={type} lines={lines} className={className} />
    case "win98":
      return <Win98Skeleton type={type} lines={lines} className={className} />
    case "winxp":
      return <WinXPSkeleton type={type} lines={lines} className={className} />
    case "mac9":
      return <Mac9Skeleton type={type} lines={lines} className={className} />
    case "zephyr":
      return <ZephyrSkeleton type={type} lines={lines} className={className} />
    default:
      return <GenericSkeleton type={type} lines={lines} className={className} />
  }
}

function DOSSkeleton({ type, lines, className }: { type: string; lines: number; className?: string }) {
  if (type === "text") {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-4 bg-green-900/30 rounded dos-text">
            <span className="invisible">Loading text line {i + 1}</span>
          </div>
        ))}
      </div>
    )
  }
  return <div className={cn("h-8 bg-green-900/30 rounded dos-text", className)} />
}

function Win98Skeleton({ type, lines, className }: { type: string; lines: number; className?: string }) {
  if (type === "card") {
    return (
      <div className="win98-inset p-4">
        <div className="space-y-3">
          <div className="h-6 bg-gray-300 rounded animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-300 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }
  return <div className={cn("h-8 bg-gray-300 rounded animate-pulse", className)} />
}

function WinXPSkeleton({ type, lines, className }: { type: string; lines: number; className?: string }) {
  if (type === "card") {
    return (
      <div className="bg-white border border-gray-300 p-4 rounded">
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }
  return <div className={cn("h-8 bg-gray-200 rounded animate-pulse", className)} />
}

function Mac9Skeleton({ type, lines, className }: { type: string; lines: number; className?: string }) {
  if (type === "card") {
    return (
      <div className="bg-gray-100 border-2 border-gray-300 p-4 rounded">
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }
  return <div className={cn("h-8 bg-gray-200 rounded animate-pulse", className)} />
}

function ZephyrSkeleton({ type, lines, className }: { type: string; lines: number; className?: string }) {
  if (type === "card") {
    return (
      <div className="bg-slate-800 border border-cyan-500/20 p-4 rounded">
        <div className="space-y-3">
          <div className="h-6 bg-slate-700 rounded animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className="h-4 bg-slate-700 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }
  return <div className={cn("h-8 bg-slate-700 rounded animate-pulse", className)} />
}

function GenericSkeleton({ type, lines, className }: { type: string; lines: number; className?: string }) {
  return <div className={cn("h-8 bg-gray-200 rounded animate-pulse", className)} />
}
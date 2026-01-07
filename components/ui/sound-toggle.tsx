"use client"

import { Volume2, VolumeX } from "lucide-react"
import { useSoundPreferences } from "@/lib/sounds"
import { cn } from "@/lib/utils"

interface SoundToggleProps {
  className?: string
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "win98" | "winxp" | "mac9" | "zephyr"
}

export function SoundToggle({
  className,
  showLabel = false,
  size = "md",
  variant = "default"
}: SoundToggleProps) {
  const { preferences, toggleSound } = useSoundPreferences()

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  }

  const variantClasses = {
    default: "hover:bg-gray-100",
    win98: "win98-button",
    winxp: "winxp-button",
    mac9: "mac9-button",
    zephyr: "hover:bg-cyan-500/20"
  }

  const Icon = preferences.enabled ? Volume2 : VolumeX

  return (
    <button
      onClick={toggleSound}
      className={cn(
        "flex items-center gap-2 p-2 rounded transition-colors",
        variantClasses[variant],
        className
      )}
      title={preferences.enabled ? "Disable sound" : "Enable sound"}
    >
      <Icon className={sizeClasses[size]} />
      {showLabel && (
        <span className="text-sm">
          {preferences.enabled ? "Sound On" : "Sound Off"}
        </span>
      )}
    </button>
  )
}

// Sound settings panel for more advanced controls
export function SoundSettingsPanel({ className }: { className?: string }) {
  const { preferences, updatePreferences } = useSoundPreferences()

  return (
    <div className={cn("p-4 space-y-4", className)}>
      <h3 className="font-semibold">Sound Settings</h3>

      <div className="flex items-center justify-between">
        <span className="text-sm">Enable Sound</span>
        <input
          type="checkbox"
          checked={preferences.enabled}
          onChange={(e) => updatePreferences({ enabled: e.target.checked })}
          className="w-4 h-4"
        />
      </div>

      {preferences.enabled && (
        <div className="space-y-2">
          <label className="text-sm">Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={preferences.volume}
            onChange={(e) => updatePreferences({ volume: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="text-xs text-gray-500 text-center">
            {Math.round(preferences.volume * 100)}%
          </div>
        </div>
      )}
    </div>
  )
}
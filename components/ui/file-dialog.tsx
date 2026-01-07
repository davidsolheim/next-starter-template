"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "save" | "open"
  defaultFilename?: string
  onSave?: (filename: string, fileType: string) => void
  onOpen?: (file: File) => void
  theme?: "win98" | "winxp"
}

const fileTypes = [
  { label: "PNG Image", value: "png", mime: "image/png" },
  { label: "JPEG Image", value: "jpg", mime: "image/jpeg" },
  { label: "BMP Image", value: "bmp", mime: "image/bmp" },
]

export function FileDialog({ 
  open, 
  onOpenChange, 
  mode, 
  defaultFilename = "untitled", 
  onSave,
  onOpen,
  theme = "win98"
}: FileDialogProps) {
  const [filename, setFilename] = useState(defaultFilename)
  const [fileType, setFileType] = useState("png")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setFilename(defaultFilename)
      setFileType("png")
    }
  }, [open, defaultFilename])

  const handleSave = () => {
    if (onSave) {
      const ext = fileType === "jpg" ? "jpeg" : fileType
      const fullFilename = filename.endsWith(`.${ext}`) ? filename : `${filename}.${ext}`
      onSave(fullFilename, fileTypes.find(ft => ft.value === fileType)?.mime || "image/png")
    }
    onOpenChange(false)
  }

  const handleOpen = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onOpen) {
      onOpen(file)
      onOpenChange(false)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const isWin98 = theme === "win98"

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
      />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            "p-0 gap-0 max-w-md",
            isWin98 
              ? "bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]"
              : "bg-white border border-gray-300 shadow-lg rounded-lg"
          )}
          showCloseButton={false}
        >
          {/* Title Bar */}
          <div
            className={cn(
              "px-3 py-2 flex items-center justify-between select-none",
              isWin98
                ? "bg-gradient-to-r from-[#000080] to-[#1084d0] text-white font-bold text-sm"
                : "bg-gradient-to-b from-blue-50 to-white border-b border-blue-200"
            )}
          >
            <span className={cn("font-bold", isWin98 ? "text-white text-sm" : "text-gray-800")}>
              {mode === "save" ? "Save As" : "Open"}
            </span>
            <button
              onClick={() => onOpenChange(false)}
              className={cn(
                "w-6 h-5 flex items-center justify-center",
                isWin98
                  ? "bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] hover:bg-[#dfdfdf] active:border-[#000000] active:border-r-[#ffffff] active:border-b-[#ffffff] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-black text-xs font-bold"
                  : "bg-red-500 hover:bg-red-600 text-white rounded text-xs"
              )}
            >
              {isWin98 ? "×" : "×"}
            </button>
          </div>

          {/* Content */}
          <div className={cn("p-4 space-y-4", isWin98 ? "bg-[#c0c0c0]" : "bg-white")}>
            {mode === "save" ? (
              <>
                <div className="space-y-2">
                  <label className={cn("text-sm font-semibold block", isWin98 ? "text-black" : "text-gray-700")}>
                    File name:
                  </label>
                  <Input
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className={cn(
                      isWin98
                        ? "bg-white border-2 border-t-[#000000] border-l-[#000000] border-r-[#ffffff] border-b-[#ffffff] shadow-inner"
                        : "border border-gray-300"
                    )}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSave()
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className={cn("text-sm font-semibold block", isWin98 ? "text-black" : "text-gray-700")}>
                    Save as type:
                  </label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 text-sm",
                      isWin98
                        ? "bg-white border-2 border-t-[#000000] border-l-[#000000] border-r-[#ffffff] border-b-[#ffffff] shadow-inner"
                        : "border border-gray-300 rounded"
                    )}
                  >
                    {fileTypes.map((ft) => (
                      <option key={ft.value} value={ft.value}>
                        {ft.label} (*.{ft.value})
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <label className={cn("text-sm font-semibold block", isWin98 ? "text-black" : "text-gray-700")}>
                  Select a file:
                </label>
                <div className={cn(
                  "p-4 border-2 text-center",
                  isWin98
                    ? "bg-white border-t-[#000000] border-l-[#000000] border-r-[#ffffff] border-b-[#ffffff] shadow-inner"
                    : "border-gray-300 rounded"
                )}>
                  <p className={cn("text-sm mb-2", isWin98 ? "text-black" : "text-gray-600")}>
                    Click "Open" to select a file
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className={cn(
            "flex justify-end gap-2 p-3",
            isWin98 ? "bg-[#c0c0c0] border-t-2 border-t-[#808080]" : "bg-gray-50 border-t border-gray-200"
          )}>
            <button
              onClick={mode === "save" ? handleSave : handleOpen}
              className={cn(
                "px-4 py-1 text-sm font-semibold min-w-[75px]",
                isWin98
                  ? "bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] hover:bg-[#dfdfdf] active:border-[#000000] active:border-r-[#ffffff] active:border-b-[#ffffff] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-black"
                  : "bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
              )}
            >
              {mode === "save" ? "Save" : "Open"}
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className={cn(
                "px-4 py-1 text-sm font-semibold min-w-[75px]",
                isWin98
                  ? "bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] hover:bg-[#dfdfdf] active:border-[#000000] active:border-r-[#ffffff] active:border-b-[#ffffff] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-black"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800 rounded px-4 py-2"
              )}
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}


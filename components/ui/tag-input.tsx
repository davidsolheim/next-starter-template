"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface TagInputProps {
  id?: string
  placeholder?: string
  value: string[]
  onChange: (value: string[]) => void
  suggestions?: string[]
  className?: string
}

export function TagInput({ id, placeholder, value, onChange, suggestions = [], className }: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("")

  const filteredSuggestions = suggestions.filter((s) => !value.includes(s))

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    } else if (e.key === "," && inputValue.trim()) {
      e.preventDefault()
      addTag()
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  const addTag = (tag?: string) => {
    const tagToAdd = tag || inputValue.trim().replace(/^,|,$/g, "")
    if (tagToAdd && !value.includes(tagToAdd)) {
      onChange([...value, tagToAdd])
      if (!tag) setInputValue("")
    }
  }

  const removeTag = (index: number) => {
    const newValue = [...value]
    newValue.splice(index, 1)
    onChange(newValue)
  }

  return (
    <div className="space-y-2">
      <div
        className={`flex flex-wrap gap-2 p-2 border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${className}`}
      >
        {value.map((tag, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="w-3 h-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}
        <Input
          id={id}
          type="text"
          placeholder={value.length === 0 ? placeholder : ""}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag()}
          className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-7 min-w-[120px] p-0 shadow-none"
        />
      </div>

      {filteredSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-muted-foreground self-center mr-1">Suggestions:</span>
          {filteredSuggestions.slice(0, 10).map((suggestion) => (
            <Badge
              key={suggestion}
              variant="outline"
              className="cursor-pointer hover:bg-secondary transition-colors text-[10px] py-0 px-1.5"
              onClick={() => addTag(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}


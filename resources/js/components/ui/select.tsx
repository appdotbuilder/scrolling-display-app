import * as React from "react"
import { cn } from "@/lib/utils"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode
}

const Select: React.FC<SelectProps> = ({ className, children, ...props }) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => {
  return <option value={value}>{children}</option>
}

const SelectTrigger = Select
const SelectValue: React.FC<{ placeholder?: string }> = () => null

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
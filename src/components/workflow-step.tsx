import { CheckCircle, Circle, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StepStatus = "pending" | "in-progress" | "completed" | "error"

interface WorkflowStepProps {
  title: string
  description: string
  status: StepStatus
  duration?: string
  details?: string[]
  className?: string
}

const statusConfig = {
  pending: {
    icon: Circle,
    color: "text-muted-foreground",
    badge: "secondary",
  },
  "in-progress": {
    icon: Clock,
    color: "text-info",
    badge: "info" as const,
  },
  completed: {
    icon: CheckCircle,
    color: "text-success",
    badge: "success" as const,
  },
  error: {
    icon: AlertCircle,
    color: "text-destructive",
    badge: "destructive",
  },
} as const

export function WorkflowStep({
  title,
  description,
  status,
  duration,
  details,
  className,
}: WorkflowStepProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Card className={cn("transition-all duration-300 hover:shadow-md", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon className={cn("h-5 w-5", config.color)} />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {duration && (
              <span className="text-sm text-muted-foreground">{duration}</span>
            )}
            <Badge
              variant={config.badge}
              className="capitalize"
            >
              {status.replace("-", " ")}
            </Badge>
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {details && details.length > 0 && (
        <CardContent className="pt-0">
          <ul className="space-y-1 text-sm text-muted-foreground">
            {details.map((detail, index) => (
              <li key={index} className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  )
}
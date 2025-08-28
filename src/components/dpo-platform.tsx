import { useState } from "react"
import { DatasetManager } from "@/components/dataset-manager"
import { AnnotationInterface } from "@/components/annotation-interface"
import { DPOTraining } from "@/components/dpo-training"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, MessageSquare, Zap, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

type ActiveTab = "dataset" | "annotation" | "training" | "evaluation"

const tabs = [
  {
    id: "dataset" as const,
    label: "Dataset Management",
    icon: Database,
    description: "Create and manage preference datasets"
  },
  {
    id: "annotation" as const,
    label: "Preference Annotation", 
    icon: MessageSquare,
    description: "Compare responses and collect preferences"
  },
  {
    id: "training" as const,
    label: "DPO Training",
    icon: Zap,
    description: "Train your model with Direct Preference Optimization"
  },
  {
    id: "evaluation" as const,
    label: "Model Evaluation",
    icon: BarChart3,
    description: "Evaluate and benchmark your optimized model"
  }
]

export function DPOPlatform() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dataset")

  const renderContent = () => {
    switch (activeTab) {
      case "dataset":
        return <DatasetManager />
      case "annotation":
        return <AnnotationInterface />
      case "training":
        return <DPOTraining />
      case "evaluation":
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Model Evaluation</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive evaluation suite coming soon
                </p>
                <Badge variant="secondary">In Development</Badge>
              </div>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">DPO Platform</h1>
              <p className="text-sm text-muted-foreground">
                Direct Preference Optimization for Language Models
              </p>
            </div>
            <ModeToggle />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center space-x-2 whitespace-nowrap rounded-none border-b-2 border-transparent px-4 py-3",
                    activeTab === tab.id && "border-primary bg-transparent text-primary hover:bg-primary/10"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Description */}
      <div className="bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <p className="text-sm text-muted-foreground">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </div>
  )
}
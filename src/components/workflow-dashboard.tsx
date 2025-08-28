import { useState } from "react"
import { WorkflowStep, StepStatus } from "./workflow-step"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, Settings } from "lucide-react"

interface WorkflowData {
  id: string
  title: string
  description: string
  status: StepStatus
  duration?: string
  details?: string[]
}

const dpoWorkflow: WorkflowData[] = [
  {
    id: "data-collection",
    title: "Data Collection",
    description: "Gather preference pairs and comparison data for training",
    status: "completed",
    duration: "2.3h",
    details: [
      "Collected 10,000 preference pairs",
      "Validated data quality",
      "Applied filtering and cleaning"
    ]
  },
  {
    id: "model-initialization",
    title: "Model Initialization",
    description: "Initialize base model and prepare for DPO training",
    status: "completed",
    duration: "15m",
    details: [
      "Loaded pre-trained model",
      "Configured model architecture",
      "Set up training parameters"
    ]
  },
  {
    id: "preference-modeling",
    title: "Preference Modeling",
    description: "Train preference model to understand human feedback",
    status: "in-progress",
    duration: "1.2h",
    details: [
      "Training preference classifier",
      "Current accuracy: 87.3%",
      "Processing batch 342/500"
    ]
  },
  {
    id: "dpo-optimization",
    title: "DPO Optimization",
    description: "Direct preference optimization using collected feedback",
    status: "pending",
    details: [
      "Awaiting preference modeling completion",
      "Hyperparameters configured",
      "Learning rate: 1e-5"
    ]
  },
  {
    id: "evaluation",
    title: "Model Evaluation",
    description: "Evaluate optimized model performance and alignment",
    status: "pending",
    details: [
      "Prepare evaluation datasets",
      "Set up benchmarking metrics",
      "Configure safety assessments"
    ]
  },
  {
    id: "deployment",
    title: "Model Deployment",
    description: "Deploy optimized model to production environment",
    status: "pending",
    details: [
      "Prepare deployment configuration",
      "Set up monitoring systems",
      "Configure safety guardrails"
    ]
  }
]

const rlhfWorkflow: WorkflowData[] = [
  {
    id: "supervised-finetuning",
    title: "Supervised Fine-tuning",
    description: "Initial fine-tuning on high-quality supervised data",
    status: "completed",
    duration: "4.1h",
    details: [
      "Trained on curated instruction dataset",
      "Achieved 92.1% task completion rate",
      "Model checkpoint saved"
    ]
  },
  {
    id: "reward-modeling",
    title: "Reward Modeling",
    description: "Train reward model to predict human preferences",
    status: "completed",
    duration: "2.8h",
    details: [
      "Trained on 15K preference comparisons",
      "Model accuracy: 89.7%",
      "Validation loss: 0.23"
    ]
  },
  {
    id: "ppo-training",
    title: "PPO Training",
    description: "Proximal Policy Optimization using trained reward model",
    status: "in-progress",
    duration: "3.5h",
    details: [
      "Training with PPO algorithm",
      "Current reward score: 4.2/5.0",
      "Epoch 127/200"
    ]
  },
  {
    id: "safety-evaluation",
    title: "Safety Evaluation",
    description: "Comprehensive safety and alignment testing",
    status: "pending",
    details: [
      "Red team adversarial testing",
      "Bias and fairness evaluation",
      "Harmful content detection"
    ]
  },
  {
    id: "final-evaluation",
    title: "Final Evaluation",
    description: "Final performance assessment and benchmarking",
    status: "pending",
    details: [
      "Human evaluation studies",
      "Benchmark performance testing",
      "Quality assurance checks"
    ]
  }
]

export function WorkflowDashboard() {
  const [activeWorkflow, setActiveWorkflow] = useState<"dpo" | "rlhf">("dpo")
  const [isRunning, setIsRunning] = useState(true)

  const currentWorkflow = activeWorkflow === "dpo" ? dpoWorkflow : rlhfWorkflow
  const completedSteps = currentWorkflow.filter(step => step.status === "completed").length
  const totalSteps = currentWorkflow.length
  const progress = (completedSteps / totalSteps) * 100

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Model Optimization Pipeline</h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage DPO and RLHF training workflows
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant={isRunning ? "destructive" : "default"}
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center space-x-2"
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isRunning ? "Pause" : "Resume"}</span>
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Workflow Selector */}
        <div className="flex space-x-4 mb-8">
          <Button
            variant={activeWorkflow === "dpo" ? "default" : "outline"}
            onClick={() => setActiveWorkflow("dpo")}
            className="flex-1 max-w-xs"
          >
            DPO Pipeline
          </Button>
          <Button
            variant={activeWorkflow === "rlhf" ? "default" : "outline"}
            onClick={() => setActiveWorkflow("rlhf")}
            className="flex-1 max-w-xs"
          >
            RLHF Pipeline
          </Button>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {activeWorkflow === "dpo" ? "Direct Preference Optimization" : "Reinforcement Learning from Human Feedback"}
                </CardTitle>
                <CardDescription>
                  {completedSteps} of {totalSteps} steps completed
                </CardDescription>
              </div>
              <Badge variant={isRunning ? "info" : "secondary"}>
                {isRunning ? "Running" : "Paused"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Workflow Steps */}
        <div className="space-y-4">
          {currentWorkflow.map((step, index) => (
            <WorkflowStep
              key={step.id}
              title={step.title}
              description={step.description}
              status={step.status}
              duration={step.duration}
              details={step.details}
              className={index === 0 ? "border-primary/20" : ""}
            />
          ))}
        </div>

        {/* Reset Button */}
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="flex items-center space-x-2">
            <RotateCcw className="h-4 w-4" />
            <span>Reset Pipeline</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
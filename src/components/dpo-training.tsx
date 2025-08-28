import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, Square, Settings, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TrainingConfig {
  modelName: string
  datasetPath: string
  learningRate: number
  batchSize: number
  epochs: number
  betaValue: number
  warmupSteps: number
  saveSteps: number
}

export function DPOTraining() {
  const [config, setConfig] = useState<TrainingConfig>({
    modelName: "microsoft/DialoGPT-medium",
    datasetPath: "preference_dataset.json",
    learningRate: 0.00005,
    batchSize: 4,
    epochs: 3,
    betaValue: 0.1,
    warmupSteps: 100,
    saveSteps: 500
  })
  
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentEpoch, setCurrentEpoch] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const { toast } = useToast()

  const startTraining = () => {
    if (!config.modelName || !config.datasetPath) {
      toast({
        title: "Configuration Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setIsTraining(true)
    setProgress(0)
    setCurrentEpoch(0)
    setCurrentStep(0)
    setLogs([])
    
    // Simulate training progress
    const totalSteps = config.epochs * 100 // Assuming 100 steps per epoch
    let step = 0
    
    const interval = setInterval(() => {
      step++
      const newProgress = (step / totalSteps) * 100
      const epoch = Math.floor(step / 100) + 1
      
      setProgress(newProgress)
      setCurrentEpoch(epoch)
      setCurrentStep(step)
      
      // Add training logs
      if (step % 10 === 0) {
        const loss = (Math.random() * 0.5 + 0.1).toFixed(4)
        const accuracy = (Math.random() * 0.2 + 0.8).toFixed(3)
        setLogs(prev => [...prev, `Step ${step}: Loss=${loss}, Accuracy=${accuracy}`].slice(-10))
      }
      
      if (step >= totalSteps) {
        clearInterval(interval)
        setIsTraining(false)
        toast({
          title: "Training Complete",
          description: "DPO training has finished successfully!",
        })
      }
    }, 200)
  }

  const stopTraining = () => {
    setIsTraining(false)
    toast({
      title: "Training Stopped",
      description: "Training has been stopped manually.",
      variant: "destructive"
    })
  }

  const updateConfig = (key: keyof TrainingConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Training Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>DPO Training Configuration</CardTitle>
          <CardDescription>
            Configure parameters for Direct Preference Optimization training
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model Configuration */}
            <div className="space-y-4">
              <h4 className="font-semibold">Model Settings</h4>
              
              <div className="space-y-2">
                <Label htmlFor="model-name">Base Model</Label>
                <Input
                  id="model-name"
                  value={config.modelName}
                  onChange={(e) => updateConfig("modelName", e.target.value)}
                  placeholder="e.g., microsoft/DialoGPT-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataset-path">Dataset Path</Label>
                <Input
                  id="dataset-path"
                  value={config.datasetPath}
                  onChange={(e) => updateConfig("datasetPath", e.target.value)}
                  placeholder="e.g., preference_dataset.json"
                />
              </div>
            </div>

            {/* Training Parameters */}
            <div className="space-y-4">
              <h4 className="font-semibold">Training Parameters</h4>
              
              <div className="space-y-2">
                <Label>Learning Rate: {config.learningRate}</Label>
                <Slider
                  value={[config.learningRate * 100000]}
                  onValueChange={([value]) => updateConfig("learningRate", value / 100000)}
                  max={10}
                  min={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batch-size">Batch Size</Label>
                  <Select
                    value={config.batchSize.toString()}
                    onValueChange={(value) => updateConfig("batchSize", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="16">16</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="epochs">Epochs</Label>
                  <Select
                    value={config.epochs.toString()}
                    onValueChange={(value) => updateConfig("epochs", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h4 className="font-semibold">Advanced Settings</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Beta Value: {config.betaValue}</Label>
                <Slider
                  value={[config.betaValue * 100]}
                  onValueChange={([value]) => updateConfig("betaValue", value / 100)}
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warmup-steps">Warmup Steps</Label>
                <Input
                  id="warmup-steps"
                  type="number"
                  value={config.warmupSteps}
                  onChange={(e) => updateConfig("warmupSteps", parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="save-steps">Save Steps</Label>
                <Input
                  id="save-steps"
                  type="number"
                  value={config.saveSteps}
                  onChange={(e) => updateConfig("saveSteps", parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Training Status</CardTitle>
              <CardDescription>Monitor your DPO training progress</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {!isTraining ? (
                <Button onClick={startTraining} className="flex items-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>Start Training</span>
                </Button>
              ) : (
                <Button variant="destructive" onClick={stopTraining} className="flex items-center space-x-2">
                  <Square className="h-4 w-4" />
                  <span>Stop Training</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isTraining && (
            <>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{currentEpoch}</div>
                  <div className="text-sm text-muted-foreground">Current Epoch</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{currentStep}</div>
                  <div className="text-sm text-muted-foreground">Training Steps</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Training Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </>
          )}

          {!isTraining && progress === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Click "Start Training" to begin DPO optimization
            </div>
          )}

          {progress === 100 && !isTraining && (
            <div className="text-center py-4">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-lg font-semibold text-success">Training Complete!</div>
              <div className="text-sm text-muted-foreground">Your model has been optimized with DPO</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Training Logs */}
      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Training Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm max-h-48 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Plus, Upload, Download, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DatasetItem {
  id: string
  prompt: string
  responseA: string
  responseB: string
  preference?: "A" | "B" | "tie"
  reasoning?: string
  created: Date
}

export function DatasetManager() {
  const [dataset, setDataset] = useState<DatasetItem[]>([])
  const [newPrompt, setNewPrompt] = useState("")
  const [newResponseA, setNewResponseA] = useState("")
  const [newResponseB, setNewResponseB] = useState("")
  const { toast } = useToast()

  const addDataPoint = () => {
    if (!newPrompt.trim() || !newResponseA.trim() || !newResponseB.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    const newItem: DatasetItem = {
      id: Date.now().toString(),
      prompt: newPrompt.trim(),
      responseA: newResponseA.trim(),
      responseB: newResponseB.trim(),
      created: new Date()
    }

    setDataset([...dataset, newItem])
    setNewPrompt("")
    setNewResponseA("")
    setNewResponseB("")
    
    toast({
      title: "Data Point Added",
      description: "New comparison pair has been added to the dataset."
    })
  }

  const removeDataPoint = (id: string) => {
    setDataset(dataset.filter(item => item.id !== id))
    toast({
      title: "Data Point Removed",
      description: "Comparison pair has been removed from the dataset."
    })
  }

  const exportDataset = () => {
    const jsonData = JSON.stringify(dataset, null, 2)
    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `dpo_dataset_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Dataset Exported",
      description: "Dataset has been downloaded as JSON file."
    })
  }

  const importDataset = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)
        setDataset([...dataset, ...importedData])
        toast({
          title: "Dataset Imported",
          description: `Imported ${importedData.length} data points.`
        })
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to parse JSON file.",
          variant: "destructive"
        })
      }
    }
    reader.readAsText(file)
  }

  const annotatedCount = dataset.filter(item => item.preference).length
  const totalCount = dataset.length

  return (
    <div className="space-y-6">
      {/* Dataset Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dataset Overview</CardTitle>
              <CardDescription>
                Manage your preference dataset for DPO training
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                {annotatedCount}/{totalCount} Annotated
              </Badge>
              <div className="flex space-x-2">
                <input
                  type="file"
                  accept=".json"
                  onChange={importDataset}
                  className="hidden"
                  id="import-file"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("import-file")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportDataset}
                  disabled={dataset.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Add New Data Point */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Comparison Pair</CardTitle>
          <CardDescription>
            Create a new prompt with two responses for comparison
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Enter the instruction or question..."
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responseA">Response A</Label>
              <Textarea
                id="responseA"
                placeholder="Enter the first response..."
                value={newResponseA}
                onChange={(e) => setNewResponseA(e.target.value)}
                className="min-h-[150px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responseB">Response B</Label>
              <Textarea
                id="responseB"
                placeholder="Enter the second response..."
                value={newResponseB}
                onChange={(e) => setNewResponseB(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
          </div>

          <Button onClick={addDataPoint} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Comparison Pair
          </Button>
        </CardContent>
      </Card>

      {/* Dataset Items */}
      {dataset.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Dataset Items</CardTitle>
            <CardDescription>
              Review and manage your comparison pairs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataset.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      {item.preference && (
                        <Badge variant="success">
                          Preference: {item.preference}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeDataPoint(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Prompt:</strong> {item.prompt.substring(0, 100)}
                      {item.prompt.length > 100 && "..."}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                      <div>
                        <strong>Response A:</strong> {item.responseA.substring(0, 80)}
                        {item.responseA.length > 80 && "..."}
                      </div>
                      <div>
                        <strong>Response B:</strong> {item.responseB.substring(0, 80)}
                        {item.responseB.length > 80 && "..."}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, RotateCcw, Save } from "lucide-react"
import { cn } from "@/lib/utils"

interface ComparisonData {
  prompt: string
  responseA: string
  responseB: string
  preference?: "A" | "B" | "tie"
  reasoning?: string
}

interface ComparisonPairProps {
  data: ComparisonData
  onPreferenceSelect: (preference: "A" | "B" | "tie", reasoning?: string) => void
  className?: string
}

export function ComparisonPair({ data, onPreferenceSelect, className }: ComparisonPairProps) {
  const [selectedPreference, setSelectedPreference] = useState<"A" | "B" | "tie" | undefined>(data.preference)
  const [reasoning, setReasoning] = useState(data.reasoning || "")

  const handlePreferenceSelect = (preference: "A" | "B" | "tie") => {
    setSelectedPreference(preference)
    onPreferenceSelect(preference, reasoning)
  }

  const handleReasoningChange = (value: string) => {
    setReasoning(value)
    if (selectedPreference) {
      onPreferenceSelect(selectedPreference, value)
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Response Comparison</CardTitle>
        <CardDescription>Select which response better follows the instruction</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prompt */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Prompt:</h4>
          <p className="text-sm">{data.prompt}</p>
        </div>

        {/* Response Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Response A */}
          <div
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-all",
              selectedPreference === "A" 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            )}
            onClick={() => handlePreferenceSelect("A")}
          >
            <div className="flex items-center justify-between mb-3">
              <Badge variant="outline">Response A</Badge>
              {selectedPreference === "A" && (
                <ThumbsUp className="h-4 w-4 text-primary" />
              )}
            </div>
            <div className="text-sm whitespace-pre-wrap">{data.responseA}</div>
          </div>

          {/* Response B */}
          <div
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-all",
              selectedPreference === "B" 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            )}
            onClick={() => handlePreferenceSelect("B")}
          >
            <div className="flex items-center justify-between mb-3">
              <Badge variant="outline">Response B</Badge>
              {selectedPreference === "B" && (
                <ThumbsUp className="h-4 w-4 text-primary" />
              )}
            </div>
            <div className="text-sm whitespace-pre-wrap">{data.responseB}</div>
          </div>
        </div>

        {/* Tie Option */}
        <div className="flex justify-center">
          <Button
            variant={selectedPreference === "tie" ? "default" : "outline"}
            onClick={() => handlePreferenceSelect("tie")}
            className="flex items-center space-x-2"
          >
            <span>Both responses are equally good (Tie)</span>
          </Button>
        </div>

        {/* Reasoning */}
        {selectedPreference && (
          <div className="space-y-2">
            <label htmlFor="reasoning" className="text-sm font-medium">
              Reasoning (optional but recommended):
            </label>
            <Textarea
              id="reasoning"
              placeholder="Explain why you chose this preference..."
              value={reasoning}
              onChange={(e) => handleReasoningChange(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedPreference(undefined)
              setReasoning("")
              onPreferenceSelect("A", "")
            }}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
          
          {selectedPreference && (
            <Button
              onClick={() => onPreferenceSelect(selectedPreference, reasoning)}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Preference</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
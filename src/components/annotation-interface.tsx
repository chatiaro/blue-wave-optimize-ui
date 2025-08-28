import { useState } from "react"
import { ComparisonPair } from "./comparison-pair"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, CheckCircle, SkipForward } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AnnotationData {
  id: string
  prompt: string
  responseA: string
  responseB: string
  preference?: "A" | "B" | "tie"
  reasoning?: string
}

// Sample data for demonstration
const sampleData: AnnotationData[] = [
  {
    id: "1",
    prompt: "Write a professional email to decline a job offer politely.",
    responseA: "Dear [Hiring Manager],\n\nThank you for offering me the position. After careful consideration, I must decline as I have accepted another opportunity. I appreciate your time and consideration.\n\nBest regards,\n[Your Name]",
    responseB: "Hi there,\n\nThanks for the job offer! Unfortunately, I can't take it because I found something better. Hope you understand.\n\nThanks again!"
  },
  {
    id: "2", 
    prompt: "Explain quantum computing in simple terms for a 10-year-old.",
    responseA: "Quantum computing is like having a magical computer that can try many different solutions to a problem at the same time, instead of trying them one by one like regular computers. It uses special particles called 'qubits' that can be in multiple states simultaneously, making calculations much faster for certain types of problems.",
    responseB: "Quantum computers use quantum mechanics and superposition to process information using qubits instead of bits. They leverage quantum entanglement and interference to perform parallel computations, offering exponential speedup for specific algorithmic problems through quantum gates and circuits."
  },
  {
    id: "3",
    prompt: "Write a Python function to check if a string is a palindrome.",
    responseA: "def is_palindrome(s):\n    s = s.lower().replace(' ', '')\n    return s == s[::-1]\n\n# Example usage:\nprint(is_palindrome('A man a plan a canal Panama'))  # True",
    responseB: "def check_palindrome(text):\n    clean_text = ''.join(char.lower() for char in text if char.isalnum())\n    left, right = 0, len(clean_text) - 1\n    \n    while left < right:\n        if clean_text[left] != clean_text[right]:\n            return False\n        left += 1\n        right -= 1\n    \n    return True"
  }
]

export function AnnotationInterface() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [annotations, setAnnotations] = useState<AnnotationData[]>(sampleData)
  const { toast } = useToast()

  const currentItem = annotations[currentIndex]
  const progress = ((currentIndex + 1) / annotations.length) * 100
  const annotatedCount = annotations.filter(item => item.preference).length

  const handlePreferenceSelect = (preference: "A" | "B" | "tie", reasoning?: string) => {
    const updatedAnnotations = [...annotations]
    updatedAnnotations[currentIndex] = {
      ...updatedAnnotations[currentIndex],
      preference,
      reasoning
    }
    setAnnotations(updatedAnnotations)
    
    toast({
      title: "Preference Saved",
      description: `Selected ${preference === "tie" ? "tie" : `Response ${preference}`}`,
    })
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentIndex < annotations.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const skipCurrent = () => {
    if (currentIndex < annotations.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
    toast({
      title: "Skipped",
      description: "Moved to next comparison pair",
    })
  }

  const isComplete = currentIndex === annotations.length - 1 && currentItem.preference

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Preference Annotation</CardTitle>
              <CardDescription>
                Compare responses and indicate your preference
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                {annotatedCount}/{annotations.length} Completed
              </Badge>
              <Badge variant={isComplete ? "success" : "secondary"}>
                {currentIndex + 1} of {annotations.length}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Current Comparison */}
      {currentItem && (
        <ComparisonPair
          data={currentItem}
          onPreferenceSelect={handlePreferenceSelect}
        />
      )}

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={skipCurrent}
                disabled={currentIndex === annotations.length - 1}
                className="flex items-center space-x-2"
              >
                <SkipForward className="h-4 w-4" />
                <span>Skip</span>
              </Button>

              {isComplete ? (
                <Button variant="default" className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Complete!</span>
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={goToNext}
                  disabled={currentIndex === annotations.length - 1}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {annotatedCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Annotation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {annotations.filter(a => a.preference === "A").length}
                </div>
                <div className="text-sm text-muted-foreground">Response A Preferred</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {annotations.filter(a => a.preference === "B").length}
                </div>
                <div className="text-sm text-muted-foreground">Response B Preferred</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {annotations.filter(a => a.preference === "tie").length}
                </div>
                <div className="text-sm text-muted-foreground">Ties</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
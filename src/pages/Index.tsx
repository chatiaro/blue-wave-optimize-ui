import { WorkflowDashboard } from "@/components/workflow-dashboard";
import { ModeToggle } from "@/components/mode-toggle";

const Index = () => {
  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
      <WorkflowDashboard />
    </div>
  );
};

export default Index;

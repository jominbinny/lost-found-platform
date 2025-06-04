import { ReportForm } from "@/components/report-form"

export default function ReportFoundPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Report a Found Item</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for picking up a lost item! Fill out the form below with details about what you found to help
          reconnect it with its owner.
        </p>

        <ReportForm type="found" />
      </div>
    </div>
  )
}

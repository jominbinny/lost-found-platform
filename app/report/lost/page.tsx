import { ReportForm } from "@/components/report-form"

export default function ReportLostPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Report a Lost Item</h1>
        <p className="text-muted-foreground mb-8">
          Fill out the form below with details about your lost item. The more information you provide, the better chance
          you have of finding it.
        </p>

        <ReportForm type="lost" />
      </div>
    </div>
  )
}

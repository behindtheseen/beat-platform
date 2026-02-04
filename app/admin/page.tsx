import Link from "next/link"
import { Music, BarChart3, Upload, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Beat */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Upload className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Upload Beat</CardTitle>
            <CardDescription>
              Add new beats to your marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/upload">
              <Button className="w-full">Go to Upload</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Manage Beats */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Music className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Manage Beats</CardTitle>
            <CardDescription>
              Edit or remove existing beats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/beats">
              <Button variant="outline" className="w-full">View All Beats</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <BarChart3 className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Analytics</CardTitle>
            <CardDescription>
              View sales and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full">View Stats</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

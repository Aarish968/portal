import { LogOut, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/base_submod/components/ui/avatar'
import { Button } from '@/base_submod/components/ui/button'
import { Card, CardContent } from '@/base_submod/components/ui/card'
import type { AuthUser } from '@/models/auth/schemas/auth-schema'

export function SettingsForm({ user }: { user: AuthUser }) {
  return (
    <Card className="max-w-md w-full">
      <CardContent className="grid mt-6 gap-6">
        <div className="flex flex-col gap-4">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="bg-primary/10">
              <User className="h-12 w-12 text-primary/60" />
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">DNS-4D3251</p>
          </div>
        </div>

        <div className="grid gap-2 text-sm">
          <div className="grid gap-4">
            <div>
              <div className="text-muted-foreground">Address</div>
              <div>12345 N 17th St.</div>
              <div>Boise, Idaho, 83702</div>
            </div>
            <div>
              <div className="text-muted-foreground">Phone</div>
              <div>1-555-555-5555</div>
            </div>
            <div>
              <div className="text-muted-foreground">Email</div>
              <div>amy.porter@helloporter.com</div>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </CardContent>
    </Card>
  )
}

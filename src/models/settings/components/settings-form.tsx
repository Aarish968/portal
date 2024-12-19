import { LogOut, User } from 'lucide-react'
import { useMsal } from '@azure/msal-react'
import { Avatar, AvatarFallback } from '@/base_submod/components/ui/avatar'
import { Button } from '@/base_submod/components/ui/button'
import { Card, CardContent } from '@/base_submod/components/ui/card'
import type { AuthUser } from '@/models/auth/schemas/auth-schema'

export function SettingsForm({ user }: { user: AuthUser }) {
  const { instance, accounts } = useMsal()

  const handleLogout = () => {
    instance.logout().catch(e => console.error(e))
  }

  return (
    <Card className=":uno: max-w-md w-full">
      <CardContent className=":uno: grid mt-6 gap-6">
        <div className=":uno: flex flex-col gap-4">
          <Avatar className=":uno: h-24 w-24">
            <AvatarFallback className=":uno: bg-primary/10">
              <User className=":uno: h-12 w-12 text-primary/60" />
            </AvatarFallback>
          </Avatar>
          <div className=":uno: grid gap-1">
            <h3 className=":uno: text-lg font-semibold">{user.name}</h3>
            <p className=":uno: text-sm text-muted-foreground">DNS-4D3251</p>
          </div>
        </div>

        <div className=":uno: grid gap-2 text-sm">
          <div className=":uno: grid gap-4">
            <div>
              <div className=":uno: text-muted-foreground">Address</div>
              <div>12345 N 17th St.</div>
              <div>Boise, Idaho, 83702</div>
            </div>
            <div>
              <div className=":uno: text-muted-foreground">Phone</div>
              <div>1-555-555-5555</div>
            </div>
            <div>
              <div className=":uno: text-muted-foreground">Email</div>
              <div>{accounts[0]?.username}</div>
            </div>
          </div>
        </div>

        <div className=":uno: flex justify-start">
          <Button variant="link" size="sm" className=":uno: w-auto" onClick={handleLogout}>
            <LogOut className=":uno: mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

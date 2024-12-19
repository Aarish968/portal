import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Icon } from '@iconify/react'
import { useMemberSearchStore } from '../stores/member-search-store'
import type { MemberSearchFormData } from '../schemas/member-search-schema'
import { MemberSearchFormSchema } from '../schemas/member-search-schema'
import { Button } from '@/base_submod/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/base_submod/components/ui/form'
import { Input } from '@/base_submod/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/base_submod/components/ui/select'

function MemberSearchForm() {
  const form = useForm<MemberSearchFormData>({
    resolver: zodResolver(MemberSearchFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      healthPlan: '',
    },
  })

  const { searchMembers, isLoading } = useMemberSearchStore()

  function onSubmit(values: MemberSearchFormData) {
    searchMembers(values.firstName, values.lastName, values.dateOfBirth, values.healthPlan)
  }

  return (
    <div className=":uno: p-1">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=":uno: space-y-4">
          <div className=":uno: mb-4 flex gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className=":uno: flex-1">
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className=":uno: flex-1">
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className=":uno: mb-4 flex gap-4">
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className=":uno: flex-1">
                  <FormControl>
                    <Input placeholder="Date Of Birth (MM/DD/YYYY)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="healthPlan"
              render={({ field }) => (
                <FormItem className=":uno: flex-1">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Health Plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MH">MH</SelectItem>
                      <SelectItem value="Centene">Centene</SelectItem>
                      <SelectItem value="Paramount">Paramount</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className=":uno: mt-4 flex items-center justify-center gap-2" disabled={isLoading}>
            {isLoading
              ? (
                  'Searching...'
                )
              : (
                  <div className=":uno: flex items-center gap-1">
                    <Icon icon="ph:magnifying-glass" className=":uno: mb-1 size-4 shrink-0" />
                    <span>Find Member</span>
                  </div>
                )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default MemberSearchForm

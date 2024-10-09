import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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

function MemberSearchForm() {
  const form = useForm<MemberSearchFormData>({
    resolver: zodResolver(MemberSearchFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
    },
  })

  const { searchMembers, isLoading } = useMemberSearchStore()

  function onSubmit(values: MemberSearchFormData) {
    searchMembers(values.firstName, values.lastName, values.dateOfBirth)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=":uno: space-y-4">
        <p className=":uno: mb-4 text-sm text-gray-600">Enter the required information below to pull up member details</p>
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
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Date Of Birth" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className=":uno: bg-purple-700 hover:bg-purple-800 mt-4 w-40" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'SEARCH'}
        </Button>
      </form>
    </Form>
  )
}

export default MemberSearchForm

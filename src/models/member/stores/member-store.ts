import { create } from 'zustand'
import type { Member } from '../schemas/member-schema'
import { MemberSchema } from '../schemas/member-schema'

interface MemberStore {
  selectedMember: Member | null
  isLoading: boolean
  error: string | null
  setSelectedMember: (member: Member) => void
  clearSelectedMember: () => void
}

export const useMemberStore = create<MemberStore>(set => ({
  selectedMember: null,
  isLoading: false,
  error: null,

  setSelectedMember: (member: Member) => {
    const parsedMember = MemberSchema.safeParse(member)
    if (parsedMember.success) {
      set({ selectedMember: parsedMember.data, error: null })
    }
    else {
      console.error('Invalid member data:', parsedMember.error.errors)
      set({ error: 'Error: Invalid member data format' })
    }
  },

  clearSelectedMember: () => {
    set({ selectedMember: null, error: null })
  },
}))

import type { HraActivityItem } from '../schemas/hra-activity-schema'

export const fakeHraActivities: HraActivityItem[] = [
  {
    message: 'SUCCESS',
    assessmentID: 'a0EO3000004KNFtMAO',
    assessmentName: 'Access to Care',
    memberFirstName: 'John',
    memberLastName: 'Healthyman',
    memberAddress: {
      zip: '30126',
      street: '805 Clay Road Southwest',
      state: 'GA',
      city: 'Mableton',
    },
    MemberPhone: '2245875431',
    MemberPayer: 'Carefirst',
    IsStarted: true,
    IsCompletedFlag: false,
    CompletedDate: null,
  },
  {
    message: 'SUCCESS',
    assessmentID: 'a0EO3000004KNJ7MAO',
    assessmentName: 'Carefirst Health Risk Assessment 2025',
    memberFirstName: 'Alex',
    memberLastName: 'Lora',
    memberAddress: {
      zip: '20740',
      street: '123 Main Street',
      state: 'Maryland',
      city: 'College Park',
    },
    MemberPhone: null,
    MemberPayer: 'Carefirst',
    IsStarted: true,
    IsCompletedFlag: true,
    CompletedDate: null,
  },
]

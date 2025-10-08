export const routes = {
  dashboard: '/dashboard',
  
  members: {
    list: '/members',
    base: '/members',
    add: '/members/add',
    details: '/members/[id]',
    edit: '/members/[id]/edit',
    view: (id: string) => `/members/${id}`,
  },
  
  savings: {
    list: '/savings',
    add: '/savings/add',
  },
  meetings: {
    schedule: '/meetings/schedule', // Ensure this line exists

    
  },
  
  loans: {
    list: '/loans',
    add: '/loans/add',
  },
  
  ngumbato: {
    base: '/ngumbato',
    contribute: '/ngumbato/contribute',
  },
  
  investments: {
    list: '/investments',
    add: '/investments/add',
  },
  
  withdrawals: {
    list: '/withdrawals',
    add: '/withdrawals/add',
    request: '/withdrawals/request',
    
  },
  
  fines: {
    list: '/fines',
    add: '/fines/add',
  },
  
  reports: {
    overview: '/reports',
  },
  
  content: {
    base: '/content',
  },
  
  podcasts: {
    add: '/podcasts/add',
  },
  
  articles: {
    add: '/articles/add',
  },
  
  settings: '/settings',
};
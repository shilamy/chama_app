export const routes = {
  // Basic routes
  dashboard: '/dashboard',
  settings: '/settings',
  profile: '/profile',
  help: '/help',
  login: '/login',
  register: '/register',
  logout: '/logout',
  notFound: '/404',
  serverError: '/500',
  forbidden: '/403',
  unauthorized: '/401',
  welcome: '/',

  members: {
    list: '/members',
    base: '/members',
    add: '/members/add',
    details: (id: string) => `/members/${id}`,
    edit: (id: string) => `/members/${id}/edit`,
    savings: (id: string) => `/members/${id}/savings`,
    contributions: (id: string) => `/members/${id}/contributions`,
    loans: (id: string) => `/members/${id}/loans`,
    withdrawals: (id: string) => `/members/${id}/withdrawals`,
    fines: (id: string) => `/members/${id}/fines`,
  },

  savings: {
    list: '/savings',
    add: '/savings/add',
    recordContribution: '/savings/record-contribution',
    details: (id: string) => `/savings/${id}`,
    edit: (id: string) => `/savings/${id}/edit`,
    contributions: {
      list: '/savings/contributions',
      add: '/savings/contributions/add',
      details: (id: string) => `/savings/contributions/${id}`,
      edit: (id: string) => `/savings/contributions/${id}/edit`,
    },
  },

 loans: {
  list: '/loans',                          // → Loans overview/dashboard
  add: '/loans/add',                       // → Add new loan application
  details: (id: string) => `/loans/${id}`, // → View specific loan details
  edit: (id: string) => `/loans/${id}/edit`, // → Edit loan details
  
  payments: {
    list: '/loans/payments',               // → Loan repayments overview
    add: '/loans/payments/add',            // → Add new repayment
    details: (id: string) => `/loans/payments/${id}`, // → View repayment details
    edit: (id: string) => `/loans/payments/${id}/edit`, // → Edit repayment
  },
  
  process: {
    list: '/loans/process',                // → Process loans page (YOUR CURRENT PAGE)
    approve: (id: string) => `/loans/process/${id}/approve`, // → Approve specific loan
    reject: (id: string) => `/loans/process/${id}/reject`,   // → Reject specific loan
  },
  
  schedule: {
    list: '/loans/schedule',               // → Loan schedules overview
    add: '/loans/schedule/add',            // → Add new schedule
    details: (id: string) => `/loans/schedule/${id}`, // → View schedule details
    edit: (id: string) => `/loans/schedule/${id}/edit`, // → Edit schedule
  },
},

  meetings: {
    schedule: {
      list: '/meetings/schedule',
      add: '/meetings/schedule/add',
      details: (id: string) => `/meetings/schedule/${id}`,
      edit: (id: string) => `/meetings/schedule/${id}/edit`,
    },
    attendance: {
      list: '/meetings/attendance',
      record: '/meetings/attendance/record',
      details: (id: string) => `/meetings/attendance/${id}`,
    },
  },

  ngumbato: {
    list: '/ngumbato',
    add: '/ngumbato/add',
    details: (id: string) => `/ngumbato/${id}`,
    edit: (id: string) => `/ngumbato/${id}/edit`,
    contributions: (id: string) => `/ngumbato/${id}/contributions`,
    contribute: '/ngumbato/contribute',
  },
  expenses: {
    list: '/expenses',
    add: '/expenses/add',
    details: (id: string) => `/expenses/${id}`,
    edit: (id: string) => `/expenses/${id}/edit`,
  },

  investments: {
    list: '/investments',
    add: '/investments/add',
    details: (id: string) => `/investments/${id}`,
    edit: (id: string) => `/investments/${id}/edit`,
    returns: {
      list: '/investments/returns',
      add: '/investments/returns/add',
      details: (id: string) => `/investments/returns/${id}`,
      edit: (id: string) => `/investments/returns/${id}/edit`,
    },
  },

  withdrawals: {
    list: '/withdrawals',
    add: '/withdrawals/add',
    request: '/withdrawals/request',
    details: (id: string) => `/withdrawals/${id}`,
    edit: (id: string) => `/withdrawals/${id}/edit`,
    approve: (id: string) => `/withdrawals/${id}/approve`,
    // Filtered lists
    history: '/withdrawals/history',
    pending: '/withdrawals/pending',
    processed: '/withdrawals/processed',
    rejected: '/withdrawals/rejected',
    cancelled: '/withdrawals/cancelled',
    // User-specific
    myRequests: {
      list: '/withdrawals/my-requests',
      details: (id: string) => `/withdrawals/my-requests/${id}`,
      edit: (id: string) => `/withdrawals/my-requests/${id}/edit`,
      cancel: (id: string) => `/withdrawals/my-requests/${id}/cancel`,
      // Filtered user lists
      history: '/withdrawals/my-requests/history',
      pending: '/withdrawals/my-requests/pending',
      processed: '/withdrawals/my-requests/processed',
      rejected: '/withdrawals/my-requests/rejected',
      cancelled: '/withdrawals/my-requests/cancelled',
    },
  },

  fines: {
    list: '/fines',
    add: '/fines/add',
    impose: '/fines/impose',
    details: (id: string) => `/fines/${id}`,
    edit: (id: string) => `/fines/${id}/edit`,
    pay: (id: string) => `/fines/pay/${id}`,
    // Filtered lists
    history: '/fines/history',
    unpaid: '/fines/unpaid',
    paid: '/fines/paid',
    // Member-specific
    member: (id: string) => `/fines/member/${id}`,
    // Payments
    payments: {
      list: '/fines/payments',
      add: '/fines/payments/add',
      details: (id: string) => `/fines/payments/${id}`,
      edit: (id: string) => `/fines/payments/${id}/edit`,
    },
    // User-specific
    myFines: {
      list: '/fines/my-fines',
      details: (id: string) => `/fines/my-fines/${id}`,
      pay: (id: string) => `/fines/my-fines/${id}/pay`,
      // Filtered user lists
      unpaid: '/fines/my-fines/unpaid',
      paid: '/fines/my-fines/paid',
      // User payments
      payments: {
        list: '/fines/my-fines/payments',
        add: '/fines/my-fines/payments/add',
        details: (id: string) => `/fines/my-fines/payments/${id}`,
        edit: (id: string) => `/fines/my-fines/payments/${id}/edit`,
      },
    },
  },

  reports: {
    overview: '/reports',
    generate: '/reports/generate',
    // Category reports
    savings: '/reports/savings',
    loans: '/reports/loans',
    members: '/reports/members',
    meetings: '/reports/meetings',
    fines: '/reports/fines',
    withdrawals: '/reports/withdrawals',
    investments: '/reports/investments',
    ngumbato: '/reports/ngumbato',
    custom: '/reports/custom',
    // Report management
    details: (id: string) => `/reports/${id}`,
    download: (id: string) => `/reports/${id}/download`,
    edit: (id: string) => `/reports/${id}/edit`,
    delete: (id: string) => `/reports/${id}/delete`,
    // User reports
    myReports: {
      list: '/reports/my-reports',
      details: (id: string) => `/reports/my-reports/${id}`,
      download: (id: string) => `/reports/my-reports/${id}/download`,
      edit: (id: string) => `/reports/my-reports/${id}/edit`,
      delete: (id: string) => `/reports/my-reports/${id}/delete`,
      // Filtered user lists
      history: '/reports/my-reports/history',
      pending: '/reports/my-reports/pending',
      completed: '/reports/my-reports/completed',
      failed: '/reports/my-reports/failed',
    },
  },

  content: {
    base: '/content',
    blogs: '/content/blogs',
    podcasts: '/content/podcasts',
    articles: '/content/articles',
  },

  podcasts: {
    add: '/podcasts/add',
    details: (id: string) => `/podcasts/${id}`,
    edit: (id: string) => `/podcasts/${id}/edit`,
    episodes: {
      list: (id: string) => `/podcasts/${id}/episodes`,
      add: (id: string) => `/podcasts/${id}/episodes/add`,
      details: (id: string, episodeId: string) => `/podcasts/${id}/episodes/${episodeId}`,
      edit: (id: string, episodeId: string) => `/podcasts/${id}/episodes/${episodeId}/edit`,
      delete: (id: string, episodeId: string) => `/podcasts/${id}/episodes/${episodeId}/delete`,
    },
  },

  articles: {
    list: '/articles',
    add: '/articles/add',
    details: (id: string) => `/articles/${id}`,
    edit: (id: string) => `/articles/${id}/edit`,
    delete: (id: string) => `/articles/${id}/delete`,
    // Categories & organization
    categories: '/articles/categories',
    tags: '/articles/tags',
    authors: '/articles/authors',

  },

    // User articles
    myArticles: {
      list: '/articles/my-articles',
      details: (id: string) => `/articles/my-articles/${id}`,
      edit: (id: string) => `/articles/my-articles/${id}/edit`,
      delete: (id: string) => `/articles/my-articles/${id}/delete`,
      // Filtered user lists
      drafts: '/articles/my-articles/drafts',
      published: '/articles/my-articles/published',
      archived: '/articles/my-articles/archived',
    },
  };
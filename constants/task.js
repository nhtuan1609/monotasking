const PRIORITY = {
  NO_PRIORITY: {
    code: '0',
    name: 'No Priority'
  },
  LOW: {
    code: '1',
    name: 'Low'
  },
  MEDIUM: {
    code: '2',
    name: 'Medium'
  },
  HIGH: {
    code: '3',
    name: 'High'
  },
  URGENT: {
    code: '4',
    name: 'Urgent'
  }
}

const STATUS = {
  BACKLOG: {
    code: '0',
    name: 'Backlog'
  },
  TODO: {
    code: '1',
    name: 'Todo'
  },
  IN_PROGRESS: {
    code: '2',
    name: 'In Progress'
  },
  IN_REVIEW: {
    code: '3',
    name: 'In Review'
  },
  DONE: {
    code: '4',
    name: 'Done'
  },
  CANCELED: {
    code: '5',
    name: 'Canceled'
  }
}

export const TASK = Object.freeze({
  PRIORITY,
  STATUS
})

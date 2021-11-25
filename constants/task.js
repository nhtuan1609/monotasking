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

const ACTIVITY_TYPE = {
  CREATE_TASK: {
    code: '0'
  },
  CHANGE_STATUS: {
    code: '1'
  },
  CHANGE_PRIORITY: {
    code: '3'
  },
  CHANGE_ASSIGNEE: {
    code: '4'
  },
  CHANGE_LABEL: {
    code: '5'
  },
  CHANGE_PROJECT: {
    code: '6'
  },
  CHANGE_DUE_DATE: {
    code: '7'
  },
  CHANGE_NAME: {
    code: '8'
  },
  ADD_COMMENT: {
    code: '9'
  }
}

export const TASK = Object.freeze({
  PRIORITY,
  STATUS,
  ACTIVITY_TYPE
})

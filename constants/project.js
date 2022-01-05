const STATUS = {
  PLANNED: {
    code: '0',
    name: 'Planned'
  },
  IN_PROGRESS: {
    code: '1',
    name: 'In Progress'
  },
  PAUSED: {
    code: '2',
    name: 'Paused'
  },
  COMPLETED: {
    code: '3',
    name: 'Completed'
  },
  CANCELED: {
    code: '4',
    name: 'Canceled'
  }
}

const ACTIVITY_TYPE = {
  CREATE_PROJECT: {
    code: '0'
  },
  CHANGE_STATUS: {
    code: '1'
  },
  CHANGE_ASSIGNEE: {
    code: '2'
  },
  CHANGE_NAME: {
    code: '3'
  }
}

export const PROJECT = Object.freeze({
  STATUS,
  ACTIVITY_TYPE
})

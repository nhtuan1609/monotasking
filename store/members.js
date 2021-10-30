export const state = () => ({
  members: [
    {
      id: '0',
      name: 'Hoang Tuan',
      color: '#585a2b',
      shortName: 'T'
    },
    {
      id: '1',
      name: 'Tu Nguyen',
      color: '#b53be3',
      shortName: 'T'
    },
    {
      id: '2',
      name: 'Thanh Hien',
      color: '#adee93',
      shortName: 'H'
    },
    {
      id: '3',
      name: 'Hot Truong',
      color: '#20b5f4',
      shortName: 'H'
    },
    {
      id: '4',
      name: 'Hoang Tu',
      color: '#895727',
      shortName: 'T'
    },
    {
      id: '5',
      name: 'Thien Vu',
      color: '#19f3ef',
      shortName: 'T'
    }
  ]
})

export const getters = {
  getMembers(state) {
    return state.members
  }
}

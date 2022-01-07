<template>
  <div class="members__container">
    <!-- current workspace -->
    <v-card class="workspace__card">
      <v-card-title>
        <h3>Workspace</h3>
      </v-card-title>
      <v-card-text>
        <h2>NHTDevelopment</h2>
      </v-card-text>
    </v-card>

    <!-- members of workspace -->
    <v-card class="members__card">
      <v-card-title>
        <h3>Members</h3>
        <v-spacer></v-spacer>
        <v-btn icon small>
          <v-icon>mdi-plus-circle-outline</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div
          v-for="(member, index) in members"
          :key="index"
          class="members__item"
          @contextmenu="showContextMenu($event, member)"
        >
          <div class="d-flex">
            <h3 style="flex: 1" class="text-truncate">{{ member.name }}</h3>
            <v-chip small light>
              <span class="font-weight-bold">{{ getRoleName(member.role) }}</span>
            </v-chip>
          </div>
          <div>{{ member.email }}</div>
          <v-divider></v-divider>
        </div>
      </v-card-text>
    </v-card>

    <!-- context menu -->
    <v-menu
      v-model="isShowContextMenu"
      min-width="200"
      :position-x="menuX"
      :position-y="menuY"
      absolute
      transition="scale-transition"
      offset-y
      z-index="9"
    >
      <v-list light>
        <v-list-item dense @click="isShowContextMenu = false">
          <v-list-item-icon class="mr-0">
            <v-icon small>mdi-trash-can</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Delete</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { WORKSPACE } from '~/constants/workspace'

export default {
  name: 'MemberList',
  data() {
    return {
      members: [
        {
          email: 'admin@gmail.com',
          name: 'Greed',
          shortName: 'A',
          color: '#FFC312',
          position: 'Front-end Developer',
          role: '0'
        },
        {
          email: 'member1@gmail.com',
          name: 'Member1',
          shortName: 'M',
          color: '#FA0312',
          position: 'Front-end Developer',
          role: '1'
        },
        {
          email: 'member2@gmail.com',
          name: 'Member2',
          shortName: 'M',
          color: '#99AA12',
          position: 'Front-end Developer',
          role: '1'
        },
        {
          email: 'member3@gmail.com',
          name: 'Member3',
          shortName: 'M',
          color: '#99AABB',
          position: 'Front-end Developer',
          role: '1'
        },
        {
          email: 'member4@gmail.com',
          name: 'Member4',
          shortName: 'M',
          color: '#996612',
          position: 'Front-end Developer',
          role: '1'
        }
      ],
      isShowContextMenu: false,
      menuX: 0,
      menuY: 0,
      selectedMember: {}
    }
  },
  methods: {
    /**
     * get name of role based on id
     * @param {string} roleId - id of role
     * @return {void}
     */
    getRoleName(roleId) {
      return Object.values(WORKSPACE.ROLES).find((role) => role.code === roleId)?.name
    },
    /**
     * show context menu for selected member
     * @param {object} event - right mouse click event
     * @param {object} task - task information which is selected
     * @return {void}
     */
    showContextMenu(event, member) {
      event.preventDefault()
      this.selectedMember = JSON.parse(JSON.stringify(member))
      this.menuX = event.clientX
      this.menuY = event.clientY
      this.isShowContextMenu = true
    }
  }
}
</script>

<style lang="scss" scoped>
.members__container {
  width: 100%;
  height: calc(100% - var(--height-page-title));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .workspace__card {
    width: 600px;
    box-shadow: none;
    background-color: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(2px);
    margin-bottom: 16px;
  }

  .members__card {
    width: 600px;
    box-shadow: none;
    background-color: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(2px);

    .members__item {
      padding: 8px 16px;
      border-radius: 4px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.2);
        cursor: pointer;
      }
    }
  }
}
</style>

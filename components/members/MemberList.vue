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
        <v-btn icon small @click="isShowAddNewMemberDialog = true">
          <v-icon>mdi-plus-circle-outline</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div
          v-for="(member, index) in memberDetails"
          :key="index"
          :class="[
            'members__item',
            { 'is-selecting': member.email === selectedMember.email && isShowContextMenu },
            { 'is-not-selecting': member.email !== selectedMember.email && isShowContextMenu }
          ]"
          @contextmenu="showContextMenu($event, member)"
        >
          <div class="d-flex">
            <h3 style="flex: 1" class="text-truncate">{{ member.name }}</h3>
            <v-chip v-if="member.role" small light :color="member.role === WORKSPACE.ROLES.ADMIN.code ? 'primary' : ''">
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

    <!-- add new member dialog -->
    <v-dialog :value="isShowAddNewMemberDialog" persistent width="400">
      <v-card light class="pa-0">
        <v-card-title class="primary white--text py-2 px-4">Add new member to workspace</v-card-title>
        <v-card-text class="pa-4">
          <v-form ref="form">
            <h4>Email</h4>
            <v-text-field
              v-model="newMember.email"
              outlined
              dense
              :rules="[$rules.required, $rules.email, memberExists]"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn text outlined plain @click="closeDialog">Cancel</v-btn>
          <v-btn elevation="0" color="primary" @click="addNewMember">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { WORKSPACE } from '~/constants/workspace'

export default {
  name: 'MemberList',
  data() {
    return {
      isShowContextMenu: false,
      menuX: 0,
      menuY: 0,
      selectedMember: {},
      isShowAddNewMemberDialog: false,
      newMember: {}
    }
  },
  computed: {
    WORKSPACE() {
      return WORKSPACE
    },
    members() {
      return this.$store.getters['workspaces/getCurrentWorkspace']?.members ?? []
    },
    memberExists() {
      return (value) => {
        return !this.members.includes(value) || 'That user has been in workspace.'
      }
    },
    memberDetails() {
      return this.$store.getters['members/getMemberDetails']
    }
  },
  watch: {
    members() {
      if (this.members?.length > 0) {
        this.$store.dispatch('members/setMemberDetailsRef', { members: this.members })
      }
    }
  },
  created() {
    this.$store.dispatch('workspaces/setCurrentWorkspaceRef')
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
    },
    /**
     * emit event to close dialog
     * @return {void}
     */
    closeDialog() {
      this.newMember = {}
      this.$refs.form.resetValidation()
      this.isShowAddNewMemberDialog = false
    },
    /**
     * add new project
     * @return {void}
     */
    addNewMember() {
      if (!this.$refs.form.validate()) return

      this.$store.dispatch('workspaces/addNewMember', { email: this.newMember.email })
      this.closeDialog()
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
      &.is-selecting {
        background-color: rgba(0, 0, 0, 0.2);
      }
      &.is-not-selecting {
        background-color: transparent;
      }
    }
  }
}
</style>

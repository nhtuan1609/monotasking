<template>
  <v-card light tile elevation="0">
    <v-card-title>
      Checklist
      <v-spacer></v-spacer>
      <!-- view mode -->
      <template v-if="!isEditMode">
        <v-btn v-if="!isChecklistEmpty" icon @click="changeToEditMode">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </template>

      <!-- edit mode -->
      <template v-else>
        <v-btn icon @click="updateChecklist">
          <v-icon>mdi-content-save-edit-outline</v-icon>
        </v-btn>
        <v-btn icon @click="cancelEditMode">
          <v-icon>mdi-close-box-outline</v-icon>
        </v-btn>
      </template>
    </v-card-title>

    <v-card-text>
      <div class="checklist pa-4">
        <!-- view mode -->
        <template v-if="!isEditMode">
          <v-btn v-if="isChecklistEmpty" text outlined width="100%" @click="changeToEditMode">
            <v-icon small left>mdi-plus</v-icon>
            Add check item
          </v-btn>
          <template v-else>
            <v-treeview
              ref="treeView"
              key="mode-view"
              class="checklist__tree--view"
              selected-color="primary"
              item-disabled="locked"
              dense
              selectable
              open-all
              hoverable
              transition
              :items="checklist"
              :value="checkedIds"
            >
              <template #label="{ item }">
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">
                      {{ item.name }}
                    </span>
                  </template>
                  <span>{{ item.name }}</span>
                </v-tooltip>
              </template>
              <template #append="{ item }">
                <v-btn v-if="item.point" text outlined small>{{ item.point }}P</v-btn>
              </template>
            </v-treeview>
          </template>
        </template>

        <!-- edit mode -->
        <template v-else>
          <v-text-field
            v-model="newCheckItemName"
            placeholder="Add check item..."
            outlined
            dense
            hide-details
            autofocus
            @keydown.enter="addCheckItem"
          >
            <template #prepend-inner>
              <v-checkbox class="mt-0 mb-3" hide-details readonly></v-checkbox>
            </template>
          </v-text-field>

          <v-form ref="form">
            <v-treeview
              v-if="editedChecklist.items.length"
              ref="treeEdit"
              key="mode-edit"
              v-model="editedChecklist.checkedIds"
              class="checklist__tree--edit mt-4"
              selected-color="primary"
              selectable
              open-all
              hoverable
              transition
              :items="editedChecklist.items"
            >
              <template #label="{ item }">
                <v-text-field v-model="item.name" outlined dense hide-details :rules="[$rules.required]">
                  <template #append>
                    <v-menu v-if="item.point" light transition="slide-x-transition" left offset-x>
                      <template #activator="{ on, attrs }">
                        <v-btn text outlined small v-bind="attrs" v-on="on">{{ item.point }}P</v-btn>
                      </template>
                      <v-list dense>
                        <v-list-item
                          v-for="(point, listIndex) in [1, 2, 3, 4, 5]"
                          :key="listIndex"
                          @click="changeCheckItemPoint(item, point)"
                        >
                          <v-list-item-title>{{ point }} {{ point === 1 ? 'point' : 'points' }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </template>
                </v-text-field>
              </template>
              <template #append="{ item }">
                <v-btn icon small @click="addChildCheckItem(item)">
                  <v-icon>mdi-plus-circle-outline</v-icon>
                </v-btn>
                <v-btn icon small @click="deleteChildCheckItem(editedChecklist.items, item.id)">
                  <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
              </template>
            </v-treeview>
          </v-form>
        </template>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { TASK } from '~/constants/task'

export default {
  name: 'ProgressSummary',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      newCheckItemName: '',
      isEditMode: false,
      editedChecklist: {}
    }
  },
  computed: {
    isChecklistEmpty() {
      return !this.task.checklist?.items?.length
    },
    checklist() {
      return this.task.checklist?.items ?? []
    },
    checkedIds() {
      return this.task.checklist?.checkedIds ?? []
    }
  },
  methods: {
    /**
     * add new item for checklist
     * @return {void}
     */
    addCheckItem() {
      const validatedName = this.newCheckItemName.trim()
      if (validatedName) {
        this.editedChecklist.items.push({
          id: this.editedChecklist._autoNumber++,
          name: validatedName,
          point: 1,
          locked: true // using to lock checkbox in view mode
        })
        this.newCheckItemName = ''
      }
    },
    /**
     * change priority of selected task
     * @param {object} item - check item object
     * @param {number} point - point of item using to calculate progress percentage
     * @return {void}
     */
    changeCheckItemPoint(item, point) {
      item.point = point
    },
    /**
     * change checklist to edit mode
     * @return {void}
     */
    changeToEditMode() {
      this.editedChecklist = {
        _autoNumber: 0,
        checkedIds: [],
        items: [],
        progress: 0
      }
      this.editedChecklist._autoNumber = this.task.checklist?._autoNumber ?? 0
      this.editedChecklist.checkedIds = this.task.checklist?.checkedIds ? [...this.task.checklist.checkedIds] : []
      this.editedChecklist.items = this.task.checklist?.items
        ? JSON.parse(JSON.stringify(this.task.checklist?.items))
        : []

      this.isEditMode = true
    },
    /**
     * change checklist to view mode
     * @return {void}
     */
    cancelEditMode() {
      this.isEditMode = false
    },
    /**
     * update checklist for task
     * @return {void}
     */
    async updateChecklist() {
      if (!this.$refs.form.validate()) return

      // reset _autoNumber if checklist is empty
      if (!this.editedChecklist.items.length) {
        this.editedChecklist._autoNumber = 0
      }

      // calculate progress percentage of checklist
      this.editedChecklist.progress = this.calculateProgress(this.editedChecklist)

      // update checklist for task to firestore
      if (
        JSON.stringify(this.task.checklist, Object.keys(this.task.checklist).sort()) !==
        JSON.stringify(this.editedChecklist, Object.keys(this.editedChecklist).sort())
      ) {
        await this.$store.dispatch('tasks/updateTask', {
          id: this.task.id,
          data: { checklist: this.editedChecklist },
          activityType: TASK.ACTIVITY_TYPE.UPDATE_CHECKLIST
        })
      }

      // change to view mode after updating
      this.isEditMode = false
    },
    /**
     * add child check item for parent check item
     * @param {object} item - child check item object
     * @return {void}
     */
    addChildCheckItem(item) {
      if (!item.children) {
        this.$set(item, 'children', [])
      }
      item.children.push({
        id: this.editedChecklist._autoNumber++,
        name: 'New item',
        locked: true
      })
      this.$refs.treeEdit.updateAll(true)
    },
    /**
     * delete child check item for parent check item
     * @param {array} items - list of check items in same level
     * @param {number} id - id of check item which will be deleted
     * @return {void}
     */
    deleteChildCheckItem(items, id) {
      if (!items) return
      items.forEach((item, index) => {
        if (item.id === id) {
          items.splice(index, 1)
        } else {
          this.deleteChildCheckItem(item.children, id)
        }
      })
    },
    /**
     * check all items whether are checked or not
     * @param {array} items - list of check items in same level
     * @param {array} checkedIds - checked ids of checklist
     * @return {void}
     */
    isCheckedAll(items, checkedIds) {
      return items.every((item) => {
        if (!item.children?.length) return checkedIds.includes(item.id)
        return this.isCheckedAll(item.children, checkedIds)
      })
    },
    /**
     * calculate progress percentage of checklist based on check point
     * @param {array} checklist.items - list of check items in same level
     * @param {array} checklist.checkedIds - checked ids of checklist
     * @return {number}
     */
    calculateProgress(checklist) {
      if (!checklist.items?.length) return 0
      const totalPoints = checklist.items.reduce((sum, item) => sum + item.point, 0)
      const checkedPoints = checklist.items.reduce((sum, item) => {
        if (
          checklist.checkedIds.includes(item.id) ||
          (item.children?.length && this.isCheckedAll(item.children, checklist.checkedIds))
        ) {
          return sum + item.point
        }
        return sum
      }, 0)
      return Math.floor((100 * checkedPoints) / totalPoints)
    }
  }
}
</script>

<style lang="scss" scoped>
.checklist {
  border: 1px solid var(--color-border);
}

.checklist__tree--view ::v-deep {
  .v-treeview-node__checkbox.v-icon--disabled {
    color: var(--color-checkbox) !important;
    &.mdi-checkbox-marked,
    &.mdi-minus-box {
      color: var(--color-primary) !important;
    }
  }
  .v-treeview-node__label {
    color: var(--color-text);
  }
}

.checklist__tree--edit ::v-deep {
  .v-input__append-inner {
    margin-top: 6px !important;
  }
}
</style>

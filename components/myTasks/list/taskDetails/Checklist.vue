<template>
  <v-card light tile elevation="0">
    <v-card-title>
      Checklist
      <v-spacer></v-spacer>
      <!-- view mode -->
      <template v-if="!isEditMode">
        <v-btn v-if="task.checklist && task.checklist.length" icon @click="changeToEditMode">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </template>

      <!-- edit mode -->
      <template v-else>
        <v-btn class="mr-2" icon @click="updateChecklist">
          <v-icon>mdi-content-save</v-icon>
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
          <v-btn v-if="!task.checklist || !task.checklist.length" text outlined width="100%" @click="changeToEditMode">
            <v-icon small left>mdi-plus</v-icon>
            Add check item
          </v-btn>
          <template v-else>
            <div v-for="(checkItem, index) in task.checklist" :key="index" class="d-flex align-center">
              <v-btn class="mr-2" text outlined small>{{ checkItem.point }}P</v-btn>
              <v-checkbox v-model="checkItem.isChecked" class="mt-0 pt-0" hide-details readonly>
                <template #label>
                  <div style="word-break: break-word">{{ checkItem.name }}</div>
                </template>
              </v-checkbox>
            </div>
          </template>
        </template>

        <!-- edit mode -->
        <template v-else>
          <v-text-field
            v-model="newCheckItemName"
            class="mb-4"
            placeholder="Add check item..."
            outlined
            dense
            hide-details
            @keydown.enter="addCheckItem"
          >
            <template #prepend-inner>
              <v-checkbox class="mt-0 mb-3" hide-details readonly></v-checkbox>
            </template>
          </v-text-field>

          <div v-for="(checkItem, index) in editedChecklist" :key="index" class="d-flex align-center">
            <v-menu light transition="slide-x-transition" right offset-x>
              <template #activator="{ on, attrs }">
                <v-btn class="mr-2" text outlined small v-bind="attrs" v-on="on">{{ checkItem.point }}P</v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(point, listIndex) in [1, 2, 3, 4, 5]"
                  :key="listIndex"
                  @click="changePoint(index, point)"
                >
                  <v-list-item-title>{{ point }} {{ point === 1 ? 'point' : 'points' }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-checkbox v-model="checkItem.isChecked" class="mt-0 pt-0" hide-details>
              <template #label>
                <div style="word-break: break-word">{{ checkItem.name }}</div>
                <v-btn icon small @click="deleteCheckItem(index)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
            </v-checkbox>
          </div>
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
      editedChecklist: [],
      newCheckItemName: '',
      isEditMode: false
    }
  },
  computed: {
    progress() {
      if (!this.task.checklist?.length) return 0
      const totalPoints = this.task.checklist.reduce((sum, checkItem) => sum + checkItem.point, 0)
      const checkedPoints = this.task.checklist.reduce(
        (sum, checkItem) => (checkItem.isChecked ? sum + checkItem.point : sum),
        0
      )
      return Math.floor((100 * checkedPoints) / totalPoints)
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
        this.editedChecklist.push({ name: validatedName, isChecked: false, point: 1 })
        this.newCheckItemName = ''
      }
    },
    /**
     * delete check item of checklist
     * @param {number} index - index of check item
     * @return {void}
     */
    deleteCheckItem(index) {
      this.editedChecklist.splice(index, 1)
    },
    /**
     * change priority of selected task
     * @param {number} index - index of check item
     * @param {object} point - point of item using to calculate progress percentage
     * @return {void}
     */
    changePoint(index, point) {
      this.editedChecklist[index].point = point
    },
    /**
     * change checklist to edit mode
     * @return {void}
     */
    changeToEditMode() {
      this.editedChecklist = []
      if (this.task?.checklist) {
        this.editedChecklist = this.task.checklist.map((item) => {
          return { ...item }
        })
      }

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
    updateChecklist() {
      this.$store.dispatch('tasks/updateTask', {
        id: this.task.id,
        data: { checklist: this.editedChecklist },
        activityType: TASK.ACTIVITY_TYPE.UPDATE_CHECKLIST
      })

      this.isEditMode = false
    }
  }
}
</script>

<style lang="scss" scoped>
.checklist {
  border: 1px solid var(--color-border);
}
</style>

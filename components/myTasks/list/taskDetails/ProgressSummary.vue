<template>
  <v-card light tile elevation="0">
    <v-card-title>Progress summary</v-card-title>
    <v-card-text>
      <!-- progress slider -->
      <div class="progress__value my-4">{{ progress }}%</div>
      <v-slider
        v-model="progress"
        class="progress__slider"
        readonly
        hide-details
        track-color="var(--v-_base-darken1)"
        step="5"
      ></v-slider>

      <!-- checklist -->
      <div class="checklist mt-4 pa-4">
        <div class="d-flex align-center">
          <v-text-field
            v-model="newCheckItemName"
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
        </div>

        <div v-for="(checkItem, index) in checkList" :key="index" class="d-flex align-center">
          <v-menu light transition="slide-x-transition" right offset-x>
            <template #activator="{ on, attrs }">
              <div class="mt-5 mr-2">
                <v-chip v-bind="attrs" v-on="on">{{ checkItem.point }}P</v-chip>
              </div>
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
          <v-checkbox v-model="checkItem.isChecked" hide-details>
            <template #label>
              <div style="word-break: break-word">{{ checkItem.name }}</div>
            </template>
          </v-checkbox>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ProgressSummary',
  data() {
    return {
      checkList: [],
      newCheckItemName: ''
    }
  },
  computed: {
    progress() {
      if (!this.checkList.length) return 0
      const totalPoints = this.checkList.reduce((sum, checkItem) => sum + checkItem.point, 0)
      const checkedPoints = this.checkList.reduce(
        (sum, checkItem) => (checkItem.isChecked ? sum + checkItem.point : sum),
        0
      )
      return Math.floor((100 * checkedPoints) / totalPoints)
    }
  },
  methods: {
    /**
     * produce add new item for checklist
     * @return {void}
     */
    addCheckItem() {
      const validatedName = this.newCheckItemName.trim()
      if (validatedName) {
        this.checkList.push({ name: validatedName, isChecked: false, point: 1 })
        this.newCheckItemName = ''
      }
    },
    /**
     * produce change priority of selected task
     * @param {object} index - index of check item
     * @param {object} point - point of item using to calculate progress percentage
     * @return {void}
     */
    changePoint(index, point) {
      this.checkList[index].point = point
    }
  }
}
</script>

<style lang="scss" scoped>
.progress__value {
  color: var(--color-primary);
  font-size: 40px;
  font-weight: bold;
  text-align: center;
}

.progress__slider ::v-deep {
  .v-slider__track-container {
    height: 24px;
    border-radius: 24px;
  }
  .v-slider__track-background {
    border-top-right-radius: 24px;
    border-bottom-right-radius: 24px;
  }
  .v-slider__track-fill {
    border-top-left-radius: 24px;
    border-bottom-left-radius: 24px;
  }
  .v-slider__thumb {
    width: 24px;
    height: 24px;
    left: -12px;
    &::before {
      width: 20px;
      height: 20px;
      left: 2px;
      top: 2px;
      opacity: 1;
      transform: scale(1) !important;
      background-color: var(--color-background) !important;
    }
  }
  .v-slider__thumb-container:hover .v-slider__thumb:before {
    transform: scale(1) !important;
  }
  .v-slider__thumb-container:focus .v-slider__thumb:before {
    transform: scale(1) !important;
  }
}

.checklist {
  border: 1px solid var(--color-border);
}
</style>

<template>
  <v-layout fill-height>
    <v-row class="my-0">
      <v-col cols="12" md="6">
        <div class="left-title">
          <div class="main-title">The easiest way to manage your tasks.</div>
          <div class="divider"></div>
          <div class="sub-title">
            Why use Monotasking? Because only Monotasking's Work Graph data model gives you everything you need to stay
            in sync, hit deadlines, and reach your goals.
          </div>
        </div>
        <div class="use-button">
          <v-btn color="primary" large min-width="300" @click="$router.push('/myTasks/list')">Use for free</v-btn>
        </div>
      </v-col>
      <v-col cols="12" md="6" style="position: relative" class="d-flex flex-column justify-center">
        <div class="background">
          <div class="warpper-chip">
            <v-chip
              v-for="(task, index) in tasks"
              :key="index"
              :class="`chip-task position-${index}`"
              :color="task.color"
              label
            >
              <v-checkbox on-icon="mdi-check-circle" off-icon="mdi-check-circle-outline" color="white"></v-checkbox>
              <span>{{ task.content }}</span>
            </v-chip>
          </div>
          <h1 class="right-title">Work on big ideas, without the busywork.</h1>
        </div>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      tasks: [
        {
          content: 'Write campaign brief',
          color: '#ff9900'
        },
        {
          content: 'Develop messaging framework',
          color: '#669900'
        },
        {
          content: 'Hold kickoff meeting',
          color: '#009999'
        },
        {
          content: 'Finalize launch plan',
          color: '#666699'
        },
        {
          content: 'Create marketing materials',
          color: '#cc0099'
        },
        {
          content: 'Review campaign assets',
          color: '#996633'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.background {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(2px);
}

.left-title {
  z-index: 1;
  background: transparent;
  padding: 100px 60px;
  .main-title {
    margin-bottom: 40px;
    font-size: 60px;
    font-weight: bold;
    color: var(--color-white);
    text-shadow: 2px 2px black;
  }
  .sub-title {
    margin-top: 10px;
    font-size: 26px;
    color: var(--color-white);
    text-shadow: 2px 2px black;
  }
  .divider {
    width: 100%;
    border-top: 2px solid white;
    opacity: 0.6;
  }
}

.use-button {
  padding: 0 60px 100px 60px;
}

.warpper-chip {
  margin-top: 40px;
  margin-bottom: 40px;
}

.chip-task {
  display: flex;
  align-items: center;
  min-width: 300px;
  width: fit-content;
  height: 40px;
  &.position-0 {
    margin-left: 10%;
  }
  &.position-1 {
    margin-top: 20px;
    margin-left: auto;
    margin-right: 5%;
  }
  &.position-2 {
    margin-top: 30px;
    margin-left: 20%;
  }
  &.position-3 {
    margin-top: 20px;
    margin-left: auto;
    margin-right: 7%;
  }
  &.position-4 {
    margin-top: 40px;
    margin-left: 15%;
  }
  &.position-5 {
    margin-top: 30px;
    margin-left: auto;
    margin-right: 5%;
  }
}

.right-title {
  margin-bottom: 40px;
  font-size: 30px;
  background: transparent;
  text-align: center;
  color: var(--color-white);
  text-shadow: 2px 2px black;
}
</style>

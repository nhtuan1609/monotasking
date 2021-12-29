<template>
  <v-layout fill-height class="justify-center align-center">
    <div class="form">
      <div class="form__title">Create a new workspace</div>
      <div class="form__description">
        Workspaces are shre environments where team can work on project, cycles and tasks.
      </div>

      <div v-if="isShowErrorMessage" class="form__error-message">
        Error: Something went wrong. Workspace creation failed.
      </div>

      <v-form ref="form">
        <span class="white--text">Workspace name</span>
        <v-text-field
          v-model="name"
          type="text"
          outlined
          filled
          color="white"
          :rules="[$rules.required, workspaceNameExists]"
          @keyup.enter="register"
        >
          <template #message="{ message }">
            <div v-if="message" class="form__error-message small">{{ message }}</div>
          </template>
        </v-text-field>

        <span class="white--text">Workspace short name</span>
        <v-text-field
          v-model="shortName"
          type="text"
          outlined
          filled
          color="white"
          :rules="[$rules.required, $rules.maxLength(4)]"
          @keyup.enter="register"
        >
          <template #message="{ message }">
            <div v-if="message" class="form__error-message small">{{ message }}</div>
          </template>
        </v-text-field>
      </v-form>

      <div class="form__button">
        <v-btn min-width="400px" height="48px" elevation="0" color="primary" @click="createWorkspace"
          >Create workspace</v-btn
        >
      </div>
    </div>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      shortName: '',
      isShowErrorMessage: false
    }
  },
  computed: {
    user() {
      return this.$store.getters['profile/getUser']
    },
    workspaces() {
      return this.$store.getters['workspaces/getWorkspaces']
    },
    workspaceNameExists() {
      return (value) => {
        return !this.workspaces.some((item) => item.name === value) || 'That workspace name is taken. Try another.'
      }
    }
  },
  watch: {
    name() {
      this.isShowErrorMessage = false
    },
    shortName() {
      this.isShowErrorMessage = false
    }
  },
  created() {
    this.$store.dispatch('workspaces/setWorkspacesRef')
  },
  methods: {
    createWorkspace() {
      if (!this.$refs.form.validate()) return

      const workspace = {
        name: this.name,
        shortName: this.shortName,
        user: this.user
      }
      this.$store.dispatch('workspaces/createWorkspace', workspace).then((isSuccess) => {
        if (isSuccess) {
          this.$showSuccessNotification('Create successfully')
          this.$router.push('/myTasks/list')
        } else {
          this.$showErrorNotification('Register failed')
          this.isShowErrorMessage = true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 600px;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
  padding: 20px 40px;
  border-radius: 4px;

  .form__title {
    font-size: 30px;
    font-weight: bold;
    color: var(--color-white);
    text-align: center;
    margin: 20px 0;
  }

  .form__description {
    font-size: 18px;
    color: var(--color-text);
    text-align: center;
    margin: 20px 0;
  }

  .form__error-message {
    margin: 20px 0;
    font-size: 16px;
    font-weight: bold;
    color: var(--color-error);
    background-color: var(--color-error-background);
    padding: 10px;
    text-align: left;
    border-radius: 4px;

    &.small {
      margin: 0;
      font-size: 14px;
      padding: 10px;
      margin-bottom: 8px;
    }
  }

  .form__button {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
}
</style>

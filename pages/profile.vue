<template>
  <v-layout fill-height>
    <v-flex>
      <page-title title="Profile">
        <template #rightArea>
          <v-btn text height="100%" @click="$router.push('/')">
            <v-icon left>mdi-arrow-left-circle</v-icon>
            <span>Go back</span>
          </v-btn>
        </template>
      </page-title>

      <v-row class="pa-4">
        <!-- Personal information -->
        <v-col cols="12" md="4">
          <v-card light>
            <v-card-title
              >Personal information
              <v-spacer></v-spacer>
              <v-btn v-if="!isEditing" class="mr-2" icon @click="editProfile">
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text>
              <!-- avatar -->
              <div class="d-flex flex-column align-center my-16">
                <v-avatar class="mr-2" size="160" :color="user.color">
                  <span class="white--text" style="font-size: 60px; text-transform: uppercase">{{
                    user.shortName
                  }}</span>
                </v-avatar>
                <span class="mt-4" style="font-size: 32px; font-weight: bold">{{ user.name }}</span>
                <span class="mt-4" style="font-size: 18px">{{ user.position }}</span>
              </div>

              <!-- view mode -->
              <v-row v-if="!isEditing" class="mb-1">
                <v-col cols="12" md="4" class="profile__title">Full name</v-col>
                <v-col cols="12" md="8" class="profile__value">{{ user.name }}</v-col>
                <v-col cols="12" class="pt-0"><v-divider></v-divider></v-col>

                <v-col cols="12" md="4" class="profile__title">Email</v-col>
                <v-col cols="12" md="8" class="profile__value">{{ user.email }}</v-col>
                <v-col cols="12" class="pt-0"><v-divider></v-divider></v-col>

                <v-col cols="12" md="4" class="profile__title">Phone</v-col>
                <v-col cols="12" md="8" class="profile__value">{{ user.phone }}</v-col>
                <v-col cols="12" class="pt-0"><v-divider></v-divider></v-col>

                <v-col cols="12" md="4" class="profile__title">Address</v-col>
                <v-col cols="12" md="8" class="profile__value">{{ user.address }}</v-col>
              </v-row>

              <!-- edit mode -->
              <v-row v-else class="mb-1">
                <v-col cols="12" class="profile__title">Full name</v-col>
                <v-col cols="12" class="profile__value">
                  <v-text-field v-model="editedUser.name" outlined dense :rules="[$rules.required]"></v-text-field>
                </v-col>

                <v-col cols="12" class="profile__title">Email</v-col>
                <v-col cols="12" class="profile__value">
                  <v-text-field
                    v-model="editedUser.email"
                    outlined
                    dense
                    disabled
                    :rules="[$rules.required, $rules.email]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="profile__title">Phone</v-col>
                <v-col cols="12" class="profile__value">
                  <v-text-field v-model="editedUser.phone" outlined dense></v-text-field>
                </v-col>

                <v-col cols="12" class="profile__title">Address</v-col>
                <v-col cols="12" class="profile__value">
                  <v-text-field v-model="editedUser.address" outlined dense></v-text-field>
                </v-col>

                <v-col cols="12" class="profile__title">Position</v-col>
                <v-col cols="12" class="profile__value">
                  <v-text-field v-model="editedUser.position" outlined dense></v-text-field>
                </v-col>

                <v-col cols="12" class="d-flex justify-end">
                  <v-btn text outlined @click="isEditing = false">Cancel</v-btn>
                  <v-btn class="ml-3" elevation="0" color="primary" @click="updateProfile">Save</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Projects -->
        <v-col cols="12" md="8">
          <v-card light>
            <v-card-title>Projects</v-card-title>

            <v-card-text>
              <project-list></project-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-flex>
  </v-layout>
</template>

<script>
import { TASK } from '~/constants/task'
import PageTitle from '~/components/common/PageTitle.vue'
import ProjectList from '~/components/projects/ProjectList.vue'

export default {
  components: { PageTitle, ProjectList },
  data() {
    return {
      isEditing: false,
      editedUser: {}
    }
  },
  head: {
    title: 'Profile'
  },
  computed: {
    TASK() {
      return TASK
    },
    user() {
      return this.$store.getters['profile/getUser']
    }
  },
  methods: {
    /**
     * start to edit user's profile
     * @return {void}
     */
    editProfile() {
      this.editedUser = { ...this.user }
      this.isEditing = true
    },
    /**
     * update user's profile and change to view mode
     * @return {void}
     */
    updateProfile() {
      this.$store.dispatch('profile/updateProfile', {
        data: this.editedUser
      })
      this.isEditing = false
    }
  }
}
</script>

<style lang="scss" scoped>
.profile__title {
  font-size: 16px;
  font-weight: bold;
  padding-top: 4px;
  padding-bottom: 4px;
}
.profile__value {
  font-size: 16px;
  padding-top: 4px;
  padding-bottom: 4px;
}

.project {
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }

  .project__overall {
    .project__name {
      font-size: 24px;
      font-weight: bold;
    }
    .project__description {
      font-size: 16px;
      margin-top: 12px;
    }
  }

  .project__percentage {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .project__details {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px 0;
    &-item {
      min-width: 180px;
    }
  }
}
</style>

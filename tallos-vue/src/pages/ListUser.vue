<template>
  <div v-if="canCreate" class="mb-5">
    <a @click.prevent="goToCreateUser" class="text-blue-500 cursor-pointer"
      >Create User</a
    >
  </div>
  <div class="mx-auto w-3/4 my-5" v-if="canRead">
    <h2 class="text-2xl font-medium">Listando usuários</h2>

    <div class="rounded-md overflow-hidden mt-5">
      <div
        v-for="user in users"
        :key="user.username"
        class="flex flex-row justify-between items-center border p-3"
      >
        {{ user.username }}

        <div class="flex gap-5 text-gray-500">
          <DButton
            @click.prevent="$router.push(`/edit/${user.username}`)"
            v-if="canEdit"
          >
            <DIcon name="fa-pencil-alt" />
          </DButton>

          <DButton
            @click.prevent="$router.push(`/edit/${user.username}/permissions`)"
            v-if="canUpdatePermissions"
          >
            <DIcon name="fa-lock-open" />
          </DButton>

          <DButton
            color="red"
            :name="'delete-' + user.username"	 
            @click.prevent="confirmAndDeleteUser(user.username)"
            v-if="canDelete"
          >
            <DIcon name="fa-trash" />
          </DButton>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <p>You don't have read permissions.</p>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  async beforeRouteEnter(_to, _, next) {
    next((vm: any) => {
      vm.fetchUsers();
    });
  },

  computed: {
    ...mapState(["users"]),
    ...mapGetters(["currentUser"]),

    canRead() {
      // console.log(this.currentUser);

      return (
        this.currentUser && this.currentUser.permissions.includes("readUser")
      );
    },

    canEdit() {
      return (
        this.currentUser && this.currentUser.permissions.includes("updateUser")
      );
    },

    canUpdatePermissions() {
      return (
        this.currentUser &&
        this.currentUser.permissions.includes("changePermissions")
      );
    },

    canDelete() {
      return (
        this.currentUser && this.currentUser.permissions.includes("deleteUser")
      );
    },

    canCreate() {
      return (
        this.currentUser && this.currentUser.permissions.includes("createUser")
      );
    },
  },

  methods: {
    ...mapActions(["fetchUsers", "deleteUser"]),

    goToCreateUser() {
      this.$router.push("/create");
    },

    async confirmAndDeleteUser(username: string) {
      if (!confirm("Deseja mesmo apagar " + username + "?")) {
        return;
      }
      this.deleteUser(username);
    },
  },
};
</script>
<!-- export enum EPermissions {
  CHANGE_PERMISSIONS = "changePermissions",
  CREATE_USER = "createUser",
  READ_USER = "readUser",
  UPDATE_USER = "updateUser",
  DELETE_USER = "deleteUser",
} -->

import { createStore } from "vuex";
import UserService from "../services/UserService";
import { IAuthUser, IUser } from "../types/User";
import socket from "../services/socket";

export const useUsersStore = createStore({
  state() {
    return {
      users: [] as IUser[],
      currentUser: null as IUser | null, // or any default value you wish to
      underEditUser: null as IUser | null,
    };
  },

  getters: {
    currentUser: (state) => {
      return state.currentUser; // or some logic to fetch the current user from the state
    },
    underEditUser: (state) => {
      return state.underEditUser;
    },
    permissions: (state) => {
      return state.underEditUser ? state.underEditUser.permissions : [];
    },
  },

  mutations: {
    setUnderEditUser(state, user: IUser) {
      state.underEditUser = user;
    },

    setCurrentUser(state, user: IUser) {
      state.currentUser = user;
    },

    updateUser(state, updatedUser: IUser) {
      if (
        state.currentUser &&
        state.currentUser.username === updatedUser.username
      ) {
        state.currentUser = updatedUser;
      }
    },

    setUsers(state, users: IUser[]) {
      state.users = users;
    },

    addUser(state, user: IUser) {
      state.users.push(user);
    },

    removeUserByUsername(state, username: string) {
      console.log("removeUserByUsername");
      const userIndex = state.users.findIndex(
        (user) => user.username === username
      );
      state.users.splice(userIndex, 1);
    },
    
    updateUnderEditUser(state, updatedUser: IUser) {
      if (
        state.underEditUser &&
        state.underEditUser.username === updatedUser.username
      ) {
        state.underEditUser = updatedUser;
      }
    },
  },

  actions: {
    async updateUserPermissions({ commit, dispatch }, payload) {
      try {
        const { username, permissions } = payload;

        // Calling the UserService method to update user permissions
        const response = await UserService.updateUserPermissions(
          username,
          permissions
        );

        if (response && response.success) {
          // Use the updateUser mutation to update the user state
          commit("updateUser", response.user);

          // Return the response to let components know the update was successful
          return response;
        } else {
          throw new Error("Failed to update permissions");
        }
      } catch (error) {
        // Handle errors, e.g., show a notification or log it
        console.error("Error in updateUserPermissions action:", error);
        // Dispatching to some error handling action or handling it directly here
        dispatch("handleError", error);
      }
    },

    async userLogin(context, loginData) {
      try {
        const response = await UserService.login(loginData);

        // Assuming you want to save the token in localStorage
        localStorage.setItem("token", response.token);

        // Set the user in the state
        context.commit("setCurrentUser", response.user);
      } catch (error: any) {
        console.error("Failed to login:", error.message);
        throw error;
      }
    },

    async userRegister(context, registerData) {
      try {
        const response = await UserService.register(registerData);

        // Assuming you want to save the token in localStorage
        localStorage.setItem("token", response.token);

        // Set the user in the state
        context.commit("setCurrentUser", response.user);
      } catch (error: any) {
        console.error("Failed to register:", error.message);
        throw error;
      }
    },
    async fetchUserUnderEdit(context, username: string) {
      const response = await UserService.getUser(username); // assuming you have a method to get a single user
      console.log("fetchUserUnderEdit", response.user);

      context.commit("setUnderEditUser", response.user);
    },

    async setCurrentUserFromLogin(context, loginData) {
      const response = await UserService.login(loginData);
      context.commit("setCurrentUser", response.user);
    },

    async fetchUsers(context) {
      const response = await UserService.getUsers();
      context.commit("setUsers", response.users);
    },

    async deleteUser(context, username: string) {
      console.log("deleteUser");
      await UserService.deleteUser(username);
      context.commit("removeUserByUsername", username);
    },

    async addUser(context, user: IAuthUser) {
      await UserService.createUser(user);
      context.commit("addUser", user);
    },

    async updateUsr(context, user: IAuthUser) {
      await UserService.updateUser(user.username, user);
      context.commit("addUser", user);
    },
  },
  plugins: [setupListenersPlugin],
});

function setupListenersPlugin(store) {
  socket.on("userDeleted", (username: string) => {
    store.commit("removeUserByUsername", username);
  });

  socket.on("userCreated", (user: IUser) => {
    store.commit("addUser", user);
  });

  socket.on("userUpdated", (user: IUser) => {
    // Update the user in the list of users
    store.commit("updateUser", user);
    // If the updated user matches the current user under edit, update it
    if (
      store.state.underEditUser &&
      store.state.underEditUser.username === user.username
    ) {
      store.commit("updateUnderEditUser", user);
    }
  });
}

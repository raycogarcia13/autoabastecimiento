import jwt from 'jsonwebtoken'

export const state = () => ({
    authUser: null,
    user: {}
})

export const mutations = {
    SET_USER(state, user) {
        state.authUser = user
    }
}

export const actions = {
    // nuxtServerInit is called by Nuxt.js before server-rendering every page
    nuxtServerInit({ commit }, { req }) {
        let tkn = this.$auth.getToken('local');
        if (tkn) {
            let em = this;
            tkn = tkn.replace(/^Bearer\s/, '');
            jwt.verify(tkn, process.env.JWT_SECRET, function(err, data) {
                em.$axios.setHeader('Authorization', tkn);
                em.$auth.ctx.app.$axios.setHeader('Authorization', tkn)
                commit('SET_USER', data)
            });
        } else
            this.$auth.logout();
    },
    async login({ commit }, { username, password }) {
        try {
            const { data } = await this.$axios.post('/api/login', { username: username, password })
            commit('SET_USER', data.data)
            this.$auth.setToken('local', 'Bearer ' + data.token);
            this.$axios.setHeader('Authorization', 'Bearer ' + data.token);
            this.$auth.ctx.app.$axios.setHeader('Authorization', 'Bearer ' + data.token);
            this.$auth.setUser(data.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                throw new Error('Bad credentials')
            }
            throw error
        }
        return null;
    },

    async logOut({ commit }) {
        this.$auth.logout();
        commit('SET_USER', null)
    }

    // async logout({ commit }) {}

}
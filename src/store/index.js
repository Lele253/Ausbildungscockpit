import {createStore} from 'vuex'


const state = {
    user: false,
    azubis: [],
    ausbilder: [],

    abteilungen: [
        'IT',
        'Personal',
        'Vertrieb',
        'Marketing',
        'Produktion',
        'Finanzen',
        'Entwicklung',
        'Design',
        'Qualitätskontrolle',
        'Logistik'
    ],

    berichte: [],

    vorlagenDialog: false,

    color: 'rgba(206,203,203,0.62)'

}
export default createStore({

    state,
    getters: {
        user: (state) => {
            return state.user
        },
        azubis: (state) => {
            return state.azubis
        },
        berichte: (state) => {
            return state.berichte
        },
        ausbilder: (state) => {
            return state.ausbilder
        },
        abteilungen: (state) => {
            return state.abteilungen
        },
    },
    actions: {
        user(context, user) {
            context.commit('user', user)
        },
        azubis(context, azubis) {
            context.commit('azubis', azubis)
        },
    },
    mutations: {
        user(state, user) {
            state.user = user;
        },
        password(state, password) {
            state.password = password;
        }
    },
    modules: {}
})
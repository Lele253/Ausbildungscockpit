<template>
  <div :style="{ backgroundColor: $store.state.color }" class="header">
    <v-row style="width: 100%">
      <v-col cols="2">
        <v-img :src="require('../assets/QuinScape_Logo.png')" class="ml-5" cover max-width="250"/>
      </v-col>
      <v-col cols="8">
        <h1 class="text-center" style="font-family: inherit; font-size: 40px">
          Ausbildungscockpit
        </h1>
      </v-col>
      <v-col class="d-flex justify-end" cols="2">


        <!--        Ausbilder Dialog Informationen-->

        <v-dialog v-if="user.status !== 'Admin'" height="auto" width="700">
          <template v-slot:activator="{ props }">
            <v-btn
                v-bind="props"
                @click=" this.name = user.name">
              {{ user.name }}
            </v-btn>
          </template>
          <template v-slot:default="{ isActive }">
            <v-card class="card" style="background-color: rgb(206,203,203)">
              <v-card-title>
                <h2 class="text-center">
                  {{ name }}
                </h2>
              </v-card-title>
              <v-card-text>
                <div class="card-body">
                  <v-row style="height: 100%; width: 100%">
                    <v-col cols="6">
                      <v-text-field v-model="name" disabled="true" label="Name" variant="outlined"/>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field v-model="user.email" disabled="true" label="Email" variant="outlined"/>
                    </v-col>
                    <v-col v-if="user.status === 'Ausbilder'" cols="6">
                      <v-text-field v-model="user.abteilung" disabled="true" label="Abteilung" variant="outlined"/>
                    </v-col>
                    <v-col v-if="user.status === 'Azubi'" cols="6">
                      <v-container fluid>
                        <v-select v-model="nAusbilder"
                                  :items="ausbilderArray"
                                  chips
                                  disabled
                                  item-title="name"
                                  item-value="id"
                                  label="Ausbilder"
                                  multiple
                                  persistent-hint
                                  variant="outlined"
                        >
                        </v-select>
                      </v-container>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field v-model="user.status" disabled="true" label="Status" readonly
                                    variant="outlined"/>
                    </v-col>
                    <v-col v-if="user.status === 'Azubi'" cols="6">
                      <v-text-field v-model="user.ausbildungsbeginn" disabled="true"
                                    label="Ausbildungsbeginn"
                                    readonly type="date"
                                    variant="outlined"/>
                    </v-col>
                    <v-col v-if="user.status === 'Azubi'" cols="6">
                      <v-text-field v-model="user.ausbildungsende" disabled="true"
                                    label="Ausbildungsende"
                                    readonly type="date"
                                    variant="outlined"/>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
              <v-card-actions class="d-flex justify-center">
                <v-btn @click="isActive.value = false">Schließen</v-btn>
                <v-btn @click="passwordDialog = true, oldPassword = null, newPasswordRepeat = null, newPassword = null">
                  Passwort ändern
                </v-btn>
                <v-btn v-if="user.status === 'Azubi'" @click="$store.state.vorlagenDialog=true, isActive.value = false">
                  Vorlage Bearbeiten
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>

        <!--        Password Dialog-->

        <v-dialog v-model="passwordDialog" height="auto" scrollable="false" width="700">
          <v-card class="card" style="background-color: rgb(206,203,203); height: 500px">
            <v-card-title class="text-center">
              Password ändern
            </v-card-title>
            <v-card-item>
              <v-row class="justify-center" style="width: 100%; height: 100%">

                <v-col cols="10">
                  <v-text-field v-model="oldPassword" label="Altes Passwort"/>
                </v-col>

                <v-col cols="10">
                  <v-text-field v-model="newPassword" label="Neues Passwort"/>
                </v-col>

                <v-col cols="10">
                  <v-text-field v-model="newPasswordRepeat" label="Neues Passwort wiederholen"/>
                </v-col>

              </v-row>
            </v-card-item>
            <v-card-text v-if="passwordError !== null">
            </v-card-text>
            <v-card-actions class="d-flex justify-center">
              <v-btn v-if="!loadIcon" @click="passwordDialog = false">
                Schließen
              </v-btn>
              <v-btn v-if="!loadIcon" @click="updatePassword">
                Speichern
              </v-btn>
              <Icon v-else icon="svg-spinners:90-ring-with-bg" style="font-size: 40px;"/>
            </v-card-actions>
          </v-card>
        </v-dialog>


        <v-btn class="mx-2" @click="logout">
          Ausloggen
        </v-btn>
      </v-col>
    </v-row>

  </div>

  <!--  Snackbar-->

  <div class="d-flex justify-center" style="width: 100vw">

    <v-snackbar
        v-model="snackbar"
        :color="snackbarColor"
        class="mr-8"
        location="top"
        style="margin-top: 103px"
        timeout="3000">
      {{ snackbarContent }}
    </v-snackbar>

  </div>


</template>

<script>
import {mapGetters} from "vuex";
import axios from "axios";
import {Icon} from '@iconify/vue';

export default {
  name: "HeaderComponent",
  data: () => ({
    name: '',
    loadIcon: false,

    snackbar: false,
    snackbarContent: '',
    snackbarColor: '',

    oldPassword: null,
    newPassword: null,
    newPasswordRepeat: null,

    passwordError: null,

    dialog: true,
    passwordDialog: false,

    betrieblicheTätigkeiten: null,
    sonstigeUnterweisungen: null,
    schulischeInhalte: null,

    ausbilderArray: [],
    nAusbilder: null
  }),
  components: {
    Icon
  },
  computed: {
    ...mapGetters(['user']),
  },
  mounted() {
    this.setAusbilderArray()
    this.firstLogin()
  },
  methods: {
    async activateSnackbar(content, color) {
      this.snackbar = false
      this.snackbarContent = content
      this.snackbarColor = color
      this.snackbar = true
    },
    firstLogin() {
      if (this.user.firstLogin) {
        this.passwordDialog = true
      }
    },
    async setAusbilderArray() {
      this.ausbilderArray = this.user.ausbilder
      this.nAusbilder = this.ausbilderArray

    },
    logout() {
      localStorage.removeItem('token');
      this.$store.dispatch('user', null);
      location.reload();
    },
    async updatePassword() {
      this.loadIcon = true
      try {
        this.passwordError = null
        this.newPassword = this.newPassword.trim()
        this.newPasswordRepeat = this.newPasswordRepeat.trim()
        this.oldPassword = this.oldPassword.trim()
      } catch (e) {
        console.log(e)
      }

      if (this.newPassword !== this.newPasswordRepeat) {
        this.passwordError = "Ihre angegebenen Passwörter stimmen nicht überein."
        return
      }

      try {
        const formdata = new FormData()
        formdata.append('oldPassword', this.oldPassword)
        formdata.append('newPassword', this.newPassword)

        await axios.post('/update/password', formdata)
        this.passwordDialog = false
        this.oldPassword = null
        this.newPassword = null
        this.newPasswordRepeat = null
        await this.activateSnackbar("Das Passwort wurde erfolgreich geändert.", "green")
      } catch (e) {
        this.passwordError = "Ihr angegebenes Password ist falsch."
        await this.activateSnackbar("Das Passwort konnte leider nicht geändert werden.", "red")
      }
      this.loadIcon = false

    }
  }
}
</script>

<style scoped>

.header {
  backdrop-filter: blur(8px);
  box-shadow: 0px 5px 10px #2c2a2a;
  height: 100px;
}

p {
  font-size: 25px;
}

.card {
  border-radius: 15px !important;
  box-shadow: 10px 10px 20px black;
}

.v-btn {
  background-color: mediumblue;
  color: white;
}

.v-row {
  height: 120px;
  width: 100%;
}

.v-col {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
}

h1 {
  color: black;
}
</style>
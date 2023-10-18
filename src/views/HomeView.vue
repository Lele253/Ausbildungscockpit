<template>

  <!--  Handy Hinweis-->

  <div v-if="mobile">
    <v-row justify="center">
      <v-dialog
          v-model="mobile"
          class="dialogBackground"
          persistent
          width="500">
        <v-card class="cardRight">
          <v-card-item>
            <v-alert class="text-center text-black mt-2 mb-5" style="border-radius: 20px" type="warning">
              Die von Ihnen benutze Bildschirmgröße wird nicht unterstützt. Bitte nutzen Sie die Desktop-Ansicht
            </v-alert>
          </v-card-item>
        </v-card>
      </v-dialog>
    </v-row>
  </div>

  <!--    Anmelde Dialog-->

  <div v-else-if="!user">
    <v-row justify="center">
      <v-dialog
          v-model="anmeldeDialog"
          class="dialogBackground"
          persistent
          width="500">
        <v-form @submit.prevent="login">
          <v-card class="cardRight">
            <v-card-title class="text-center">
              <span class="text-h5 text-white">
              Ausbildungscockpit
              </span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row class="d-flex justify-center" style="width: 100%">
                  <v-col
                      cols="12">
                    <v-text-field v-model="email"
                                  class="text-white"
                                  color="white"
                                  label="Email"
                                  required
                                  variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12">
                    <v-text-field v-model="password"
                                  class="text-white"
                                  color="white"
                                  label="Passwort"
                                  persistent-hint
                                  required
                                  type="password"
                                  variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <div class="mt-n3 pb-8">
                <v-alert v-if="error === 'AxiosError: Request failed with status code 401'"
                         class="text-center text-black mx-5" type="warning">
                  Benutzername oder Passwort ist falsch.
                </v-alert>

                <v-alert v-else-if="error !== 'AxiosError: Request failed with status code 401' && error != null"
                         class="text-center text-black mx-5" type="error">
                  Einloggen ist momentan nicht möglich. Bitte wenden Sie sich an den Administrator.
                </v-alert>

                <v-alert v-else-if="error !== null" class="text-center text-black mx-5" type="error">
                  Einloggen ist momentan nicht möglich. Weitere Information entnehmen Sie bitte der Konsole und wenden
                  Sie sich an den Administrator.
                </v-alert>
              </div>
            </v-card-text>
            <v-card-actions class="d-flex justify-center mt-n8">
              <Icon v-if="loadIcon" icon="svg-spinners:90-ring-with-bg" style="font-size: 40px;"/>
              <v-btn
                  v-else
                  class="mb-5"
                  color="white"
                  style="background-color: #2F53A7"
                  type="submit">
                Einloggen
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-row>
  </div>

  <!--  Components-->

  <div v-else>
    <HeaderComponent style="width: 100vw"/>
    <AdminComponent v-if="user.status === 'Admin'"/>
    <AusbilderComponent v-if="user.status === 'Ausbilder'"/>
    <AzubiComponent v-if="user.status === 'Azubi'"/>
  </div>

  <!--  Vorlage Bearbeiten Dialog-->

  <v-dialog v-model="$store.state.vorlagenDialog" height="auto" width="1200">
    <v-card class="card">
      <v-card-title>
        <h2 class="text-center">
          Berichtübersicht
        </h2>
      </v-card-title>
      <v-card-text>
        <v-row style="height: 100%; width: 100%">
          <v-col cols="3">
            <v-text-field disabled label="Jahr" type="number" variant="outlined"/>
          </v-col>
          <v-col cols="3">
            <v-text-field disabled label="Woche" type="number" variant="outlined"/>
          </v-col>
          <v-col cols="3">
            <v-text-field disabled label="Von" variant="outlined"/>
          </v-col>
          <v-col cols="3">
            <v-text-field disabled label="Bis" variant="outlined"/>
          </v-col>
          <v-col cols="6">
            <v-textarea v-model="betrieblicheTätigkeiten" :disabled="readOnly" auto-grow counter
                        label="Betriebliche Tätigkeiten"
                        variant="outlined"/>
          </v-col>
          <v-col cols="6">
            <v-textarea v-model="sonstigeUnterweisungen" :disabled="readOnly" auto-grow counter
                        label="Sonstige Unterweisungen"
                        variant="outlined"/>
          </v-col>
          <v-col cols="6">
            <v-textarea v-model="schulischeInhalte" :disabled="readOnly" auto-grow counter label="Schulische Inhalte"
                        variant="outlined"/>
          </v-col>
          <v-col cols="6">
            <v-textarea auto-grow disabled label="Kommentar" readonly variant="outlined"/>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <v-btn v-if="!loadIcon" style="color: white" @click="$store.state.vorlagenDialog = false; readOnly=true">
          Schließen
        </v-btn>
        <v-btn v-if="readOnly && !loadIcon" style="color: white" @click="readOnly=false">Bearbeiten</v-btn>
        <v-btn v-if="!readOnly && !loadIcon" style="color: white" @click="updateBerichtVorlage">Speichern</v-btn>
        <Icon v-if="loadIcon" icon="svg-spinners:90-ring-with-bg" style="font-size: 40px;"/>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--  SnackBar-->

  <div class="d-flex justify-center" style="width: 100vw">

    <v-snackbar
        v-model="snackbar"
        :color="snackbarColor"
        class="mr-8"
        location="top"
        style="margin-top: 120px"
        timeout="3000">
      {{ snackbarContent }}
    </v-snackbar>

  </div>

</template>

<script>


import {mapGetters} from "vuex";
import AdminComponent from "@/components/AdminComponent";
import AusbilderComponent from "@/components/AusbilderComponent";
import AzubiComponent from "@/components/AzubiComponent";
import HeaderComponent from "@/components/HeaderComponent";
import {Icon} from '@iconify/vue';
import axios from "axios";

export default {
  name: 'HomeView',
  data: () => ({
    email: null,
    password: '',
    error: null,

    loadIcon: false,

    snackbar: false,
    snackbarContent: '',
    snackbarColor: '',

    readOnly: true,
    betrieblicheTätigkeiten: '',
    sonstigeUnterweisungen: '',
    schulischeInhalte: '',

    anmeldeDialog: false,
  }),
  components: {
    AdminComponent, AusbilderComponent, AzubiComponent, HeaderComponent, Icon
  },
  computed: {
    ...mapGetters(['user']),
    mobile: () => {
      return window.innerWidth < 1300
    },
  },
  mounted() {
    this.getUser()
  },
  methods: {
    async activateSnackbar(content, color) {
      this.snackbar = false
      this.snackbarContent = content
      this.snackbarColor = color
      this.snackbar = true
    },
    async login() {
      this.loadIcon = true
      try {
        this.error = null
        this.email = this.email.trim()
        this.password = this.password.trim()
        const response = await axios.post('/login',
            {
              email: this.email,
              password: this.password
            });
        await localStorage.setItem('token', response.data)
        location.reload()
      } catch (e) {
        this.error = e.toString()
        console.log(e.toString())
      }
      this.loadIcon = false
    },
    async getUser() {
      try {
        const user = await axios.get('/user')
        this.$store.dispatch('user', user.data)

        this.betrieblicheTätigkeiten = this.user.betrieblicheTätigkeiten
        this.sonstigeUnterweisungen = this.user.sonstigeUnterweisungen
        this.schulischeInhalte = this.user.schulischeInhalte

        this.anmeldeDialog = false
      } catch (e) {
        this.anmeldeDialog = true
      }
    },
    async updateBerichtVorlage() {
      this.loadIcon = true
      try {
        await axios.put('/azubi/', {
          betrieblicheTätigkeiten: this.betrieblicheTätigkeiten,
          schulischeInhalte: this.schulischeInhalte,
          sonstigeUnterweisungen: this.sonstigeUnterweisungen,
        })
        this.readOnly = true
        await this.activateSnackbar("Wochenberichtvorlage wurde erfolgreich gespeichert", "green")
      } catch (e) {
        this.loadIcon = false
        console.log(e)
        await this.activateSnackbar("Wochenberichtvorlage konnte nicht gespeichert werden", "red")
      }
      this.loadIcon = false
    }
  },

}
</script>
<style>
.cardRight {
  background-color: rgba(246, 243, 243, 0.27);
  border-top: 1px solid rgba(255, 255, 255, 0.75);
  border-left: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: 30px !important;
  backdrop-filter: blur(4px);
  box-shadow: 5px 5px 10px #2c2a2a;
}

.dialogBackground {
  background-image: url("../assets/backgroundLogin.jpg");
  background-size: cover;
}

.card {
  background-color: rgb(206, 203, 203) !important;
  border-radius: 15px !important;
  box-shadow: 10px 10px 20px black;
}


.v-btn {
  background-color: mediumblue;
  color: white;
}

</style>



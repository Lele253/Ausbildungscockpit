<template>
  <div class="d-flex justify-center align-center" style="height: 90vh">
    <v-card :style="{ backgroundColor: $store.state.color }" class="cardRight" style="max-height: 700px">
      <v-card-title class="text-center mt-5">
        <h1>Verwaltung</h1>
      </v-card-title>
      <v-card-item>

        <!--        Tabs-->

        <v-tabs
            v-model="tab"
            center-active
            class="justify-center d-flex mt-5"
            style="width: 100%;">
          <v-tab style="width: 24%; background-color: mediumblue; color: white; border-radius: 10px 0px 0px 0px"
                 value="one">Azubi erstellen
          </v-tab>
          <v-tab style="width: 24%; background-color: mediumblue; color: white;  border-radius: 0px 10px 0px 0px"
                 value="two">Azubi verwalten
          </v-tab>

          <div style="width: 8%"></div>

          <v-tab style="width: 24%; background-color: mediumblue; color: white; border-radius: 10px 0px 0px 0px"
                 value="three">Ausbilder erstellen
          </v-tab>
          <v-tab style="width: 24%; background-color: mediumblue; color: white;  border-radius: 0px 10px 0px 0px"
                 value="four">
            Ausbilder verwalten
          </v-tab>
        </v-tabs>
      </v-card-item>
      <v-card-item>
        <v-window v-model="tab">

          <!--          Azubi Erstellen-->

          <v-window-item value="one">
            <v-row class="justify-center mt-5">
              <v-col cols="5">
                <v-text-field v-model="name" label="Name" variant="outlined"/>
              </v-col>
              <v-col cols="5">
                <v-text-field v-model="schule" label="Schule" variant="outlined"/>
              </v-col>
              <v-col cols="5">
                <v-text-field v-model="ausbildungsbeginn" label="Ausbildungsbeginn" type="date" variant="outlined"/>
              </v-col>
              <v-col cols="5">
                <v-text-field v-model="ausbildungsende" label="Ausbildungsende" type="date" variant="outlined"/>
              </v-col>
              <v-col cols="5">
                <v-text-field v-model="berufsbezeichnung" label="Berufsbezeichnung" variant="outlined"/>
              </v-col>
              <v-col cols="5">
                <v-container fluid>
                  <v-select v-model="nAusbilder"
                            :items="ausbilderArray"

                            chips
                            class="mt-n4"
                            item-title="name"
                            item-value="id"
                            label="Ausbilder"
                            multiple
                            variant="outlined">
                  </v-select>
                </v-container>
              </v-col>
              <v-col cols="10">
                <v-text-field v-model="email" label="Email" type="email" variant="outlined"/>
              </v-col>
              <v-col class="text-center" cols="10">
                <v-btn v-if="!loadIcon" class="button text-center" @click="azubiSpeichern">
                  Speichern
                </v-btn>
                <Icon v-else icon="svg-spinners:90-ring-with-bg" style="font-size: 40px;"/>
              </v-col>
            </v-row>
          </v-window-item>

          <!--          Azubi verwalten-->

          <v-window-item value="two">
            <div class="justify-center d-flex">
              <v-card style="background-color: transparent; box-shadow: 0px 0px 0px black">
                <v-table :height="tableHeight" class="mt-2" fixed-header
                         style="background-color: transparent">
                  <tbody>
                  <tr
                      v-for="person in azubis"
                      :key="person"
                      class="tabelleneintrag">
                    <td @click="azubiInformation(person)">{{ person.name }}</td>
                    <td @click="azubiInformation(person)">{{ person.berufsbezeichnung }}</td>
                    <td @click="azubiInformation(person)">{{ person.email }}</td>
                    <td class="d-flex justify-center align-center"
                        @click="confirmDialog = true, selectedPerson = person">
                      <Icon icon="line-md:close-circle" style="font-size: 40px; cursor:pointer; color: #982121"/>
                    </td>
                  </tr>
                  </tbody>
                </v-table>
              </v-card>
            </div>
          </v-window-item>

          <!--          Ausbilder Erstellen-->

          <v-window-item value="three">
            <v-row class="justify-center mt-5">
              <v-col cols="5">
                <v-text-field v-model="nameAusbilder" label="Name" variant="outlined"/>
              </v-col>
              <v-col cols="5">
                <v-select v-model="abteilung" :items="abteilungen" label="Abteilung" variant="outlined"/>
              </v-col>
              <v-col cols="10">
                <v-text-field v-model="emailAusbilder" label="Email" type="email" variant="outlined"/>
              </v-col>

              <v-col class="text-center" cols="10">
                <v-btn v-if="!loadIcon" class="button text-center" @click="ausbilderSpeichern">
                  Speichern
                </v-btn>
                <Icon v-else icon="svg-spinners:90-ring-with-bg" style="font-size: 40px;"/>
              </v-col>
            </v-row>
          </v-window-item>

          <!--          Ausbilder verwalten-->

          <v-window-item value="four">
            <div class="justify-center d-flex">
              <v-card style="background-color: transparent; box-shadow: 0px 0px 0px black">
                <v-table :height="tableHeight" class="mt-2" fixed-header
                         style="background-color: transparent">
                  <tbody>
                  <tr
                      v-for="person in $store.state.ausbilder"
                      :key="person"
                      class="tabelleneintrag">
                    <td>{{ person.name }}</td>
                    <td>{{ person.abteilung }}</td>
                    <td>{{ person.email }}</td>
                    <td class="d-flex justify-center align-center"
                        @click="confirmDialogAusbilder = true, selectedAusbilder = person">
                      <Icon icon="line-md:close-circle" style="font-size: 40px; cursor:pointer; color: #982121"/>
                    </td>
                  </tr>
                  </tbody>
                </v-table>
              </v-card>
            </div>
          </v-window-item>

        </v-window>
      </v-card-item>
    </v-card>
  </div>

  <!--    Confirm Dialog Azubi löschen-->

  <v-dialog
      v-model="confirmDialog"
      width="auto"
  >
    <v-card class="card" style="border: 20px">
      <v-card-text>
        <h1 class="text-center">
          Möchten Sie {{ selectedPerson.name }} wirklich löschen?
        </h1>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <v-btn v-if="!loadIcon" class="button" @click="azubiLöschen(selectedPerson)">Löschen</v-btn>
        <v-btn v-if="!loadIcon" class="button" @click="confirmDialog = false">Abbrechen</v-btn>
        <Icon v-else icon="svg-spinners:90-ring-with-bg" style="font-size: 40px;"/>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--    Confirm Dialog Ausbilder löschen-->

  <v-dialog
      v-model="confirmDialogAusbilder"
      width="auto"
  >
    <v-card class="card" style="border: 20px">
      <v-card-text>
        <h1 class="text-center">
          Möchten Sie {{ selectedAusbilder.name }} wirklich löschen?
        </h1>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <v-btn v-if="!loadIcon" class="button" @click="ausbilderLöschen(selectedAusbilder)">Löschen</v-btn>
        <v-btn v-if="!loadIcon" class="button" @click="confirmDialogAusbilder = false">Abbrechen</v-btn>
        <Icon v-else icon="svg-spinners:90-ring-with-bg" style="font-size: 40px;"/>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--  Azubi Dialog Informationen-->

  <v-dialog
      v-model="azubiDialog"
      width="1200">
    <div class="justify-center d-flex" style="width: 100%">
      <v-card class="card">
        <v-card-title>
          <h2 class="text-center">
            {{ azubi.name }}
          </h2>
        </v-card-title>
        <v-card-text class="d-flex  align-center justify-center">
          <div class="card-body">
            <v-row class="mx-0 my-0">
              <v-col cols="6">
                <v-text-field v-model="nameInformation" label="Name" variant="outlined"/>
              </v-col>
              <v-col cols="6">
                <v-select
                    v-model="ausbilderInformation"
                    :items="ausbilderNames"
                    chips
                    label="Ausbilder"
                    multiple
                    variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="9">
                <v-text-field v-model="berufsbezeichnungInformation" label="Berufsbezeichnung"
                              variant="outlined"/>
              </v-col>
              <v-col cols="3">
                <v-text-field v-model="beginnInformation" label="Ausbildungsbeginn" type="date"
                              variant="outlined"/>
              </v-col>
              <v-col cols="9">
                <v-text-field v-model="schuleInformation" label="Schule" variant="outlined"/>
              </v-col>
              <v-col cols="3">
                <v-text-field v-model="endeInformation" label="Ausbildungsende" type="date"
                              variant="outlined"/>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn v-if="!loadIcon" class="text-white" @click="azubiDialog = false">Schließen</v-btn>
          <v-btn v-if="!loadIcon" class="text-white" @click="updateAzubi(azubi)">Speichern</v-btn>
          <Icon v-else icon="svg-spinners:90-ring-with-bg" style="font-size: 40px;"/>
        </v-card-actions>
      </v-card>
    </div>
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
import {Icon} from '@iconify/vue';
import axios from "axios";

export default {
  name: "AdminComponent",
  data: () => ({
    snackbar: false,
    snackbarContent: '',
    snackbarColor: '',
    tab: 'one',

    loadIcon: false,

    confirmDialog: false,
    confirmDialogAusbilder: false,

    azubiDialog: false,

    selectedPerson: null,
    selectedAusbilder: null,

    name: null,
    ausbildungsbeginn: null,
    ausbildungsende: null,
    schule: null,
    berufsbezeichnung: null,
    nAusbilder: [],
    email: null,
    passwort: null,

    nameInformation: null,
    schuleInformation: null,
    berufsbezeichnungInformation: null,
    beginnInformation: null,
    endeInformation: null,
    ausbilderInformation: [],

    emailAusbilder: null,

    abteilung: [],
    nameAusbilder: null,

    azubi: null,
    jahr: null,
    woche: null,
    von: null,
    bis: null,
    betrieblicheTätigkeiten: null,
    sonstigeUnterweisungen: null,
    schulischeInhalte: null,

    ausbilderArray: [],
  }),
  components: {
    Icon
  },
  mounted() {
    this.setAusbilderArray()
    this.getAzubis()
    this.getAusbilder()
  },
  computed: {
    ...mapGetters(['azubis']),
    ...mapGetters(['ausbilder']),
    ...mapGetters(['berichte']),
    ...mapGetters(['abteilungen']),
    ausbilderNames: function () {
      const array = []
      this.ausbilderArray.forEach(e => {
        array.push(e.name)
      })
      return array
    },
    tableHeight() {
      const screenHeight = window.innerHeight;
      if (screenHeight <= 800) {
        return 300;
      }
      if (screenHeight <= 900) {
        return 400;
      }

      if (screenHeight <= 950) {
        return 450;
      }

      if (screenHeight <= 1000) {
        return 500;
      }

      if (screenHeight <= 1100) {
        return 450;
      }

      if (screenHeight <= 1200) {
        return 500;
      }

      if (screenHeight <= 1300) {
        return 500;
      }

      if (screenHeight <= 1400) {
        return 500;
      }
      return 400
    },
  },
  methods: {
    async activateSnackbar(content, color) {
      this.snackbar = false
      this.snackbarContent = content
      this.snackbarColor = color
      this.snackbar = true
    },


    async updateAzubi(person) {
      this.loadIcon = true
      const neueAusbilder = [];
      this.ausbilderInformation.forEach(ausbilder => {
        this.ausbilderArray.forEach(ausbilderInArray => {
          if (ausbilder === ausbilderInArray.name) {
            neueAusbilder.push(ausbilderInArray)
          }
        })
      })

      try {
        await axios.put('/azubi/ausbilder', {
          id: person.id,
          name: this.nameInformation,
          berufsbezeichnung: this.berufsbezeichnungInformation,
          ausbildungsbeginn: this.beginnInformation,
          ausbildungsende: this.endeInformation,
          schule: this.schuleInformation,
          ausbilder: neueAusbilder
        })

        this.readOnly = true
        this.azubiDialog = false
        this.ausbilderInformation = []
        await this.getAzubis()
        await this.activateSnackbar("Azubi wurde erfolgreich bearbeitet", "green")
      } catch (e) {
        await this.activateSnackbar("Beim bearbeiten ist etwas schiefgelaufen. Versuchen Sie es bitte später erneut.", "red")
        console.log(e)
      }
      this.loadIcon = false
    },

    async azubiInformation(person) {
      this.ausbilderInformation = []

      try {
        await person.ausbilder.forEach(ausbilder => {
          this.ausbilderInformation.push(ausbilder.name)
        });
      } catch (e) {
        console.log(e)
      }
      this.nameInformation = person.name;
      this.berufsbezeichnungInformation = person.berufsbezeichnung;

      this.beginnInformation = person.ausbildungsbeginn
      this.endeInformation = person.ausbildungsende

      this.schuleInformation = person.schule;


      this.azubi = person;
      this.azubiDialog = true;
    },
    async getAzubis() {
      try {
        const response = await axios.get('/azubi')
        this.$store.state.azubis = response.data
      } catch (e) {
        console.log(e)
      }
    },
    async getAusbilder() {
      try {
        const response = await axios.get('/ausbilder')
        this.$store.state.ausbilder = response.data
      } catch (e) {
        console.log(e)
      }
    },
    async setAusbilderArray() {
      try {
        const response = await axios.get('/ausbilder')
        this.ausbilderArray = response.data

      } catch (e) {
        console.log(e)
      }
    },

    async azubiSpeichern() {

      try {
        this.loadIcon = true
        await axios.post('/regist/azubi', {
          name: this.name,
          status: 'Azubi',
          berufsbezeichnung: this.berufsbezeichnung,
          schule: this.schule,
          ausbildungsbeginn: this.ausbildungsbeginn,
          ausbildungsende: this.ausbildungsende,
          ausbilder: this.nAusbilder,
          email: this.email,
          password: this.passwort,
        })

        this.leeren()
        await this.setAusbilderArray()
        await this.getAzubis()
        await this.activateSnackbar("Azubi wurde erfolgreich erstellt", "green")
      } catch (e) {
        await this.activateSnackbar("Beim erstellen ist etwas schiefgelaufen. Versuchen Sie es bitte später erneut.", "red")
        console.log(e)
      }
      this.loadIcon = false
    },
    async ausbilderSpeichern() {
      this.loadIcon = true
      try {
        await axios.post('/regist/ausbilder', {
          name: this.nameAusbilder,
          abteilung: this.abteilung,
          email: this.emailAusbilder,
          password: this.passwortAusbilder,
          status: 'Ausbilder'
        })
        await this.setAusbilderArray()
        await this.getAusbilder()
        this.leeren()
        await this.activateSnackbar("Ausbilder wurde erfolgreich erstellt", "green")
      } catch (e) {
        console.log(e)
        await this.activateSnackbar("Beim erstellen ist etwas schiefgelaufen. Versuchen Sie es bitte später erneut.", "red")
      }
      this.loadIcon = false
    },
    leeren() {
      this.name = null;
      this.berufsbezeichnung = null;
      this.schule = null;
      this.ausbildungsbeginn = null;
      this.ausbildungsende = null;
      this.nAusbilder = null
      this.email = null;
      this.passwort = null;

      this.abteilung = null;
      this.nameAusbilder = null;
      this.emailAusbilder = null;
      this.passwortAusbilder = null;

      this.azubi = null;
      this.jahr = null
      this.woche = null
      this.von = null;
      this.bis = null;
      this.betrieblicheTätigkeiten = null;
      this.sonstigeUnterweisungen = null;
      this.schulischeInhalte = null;
    },
    async azubiLöschen(azubi) {
      this.loadIcon = true
      try {
        await axios.delete('/delete/azubi/' + azubi.id)
        await this.getAzubis()
        this.confirmDialog = false
        await this.setAusbilderArray()
        await this.activateSnackbar("Azubi wurde erfolgreich gelöscht.", "green")
      } catch (e) {
        await this.activateSnackbar("Beim löschen ist etwas schiefgelaufen. Versuchen Sie es bitte später erneut.", "red")
        console.log(e)
      }
      this.loadIcon = false
    },
    async ausbilderLöschen(ausbilder) {
      this.loadIcon = true
      try {
        await axios.delete('/ausbilder/' + ausbilder.id)
        await this.getAusbilder()
        this.confirmDialogAusbilder = false
        await this.setAusbilderArray()
        await this.activateSnackbar("Ausbilder wurde erfolgreich gelöscht.", "green")
      } catch (e) {
        await this.activateSnackbar("Beim löschen ist etwas schiefgelaufen. Versuchen Sie es bitte später erneut.", "red")
        console.log(e)
      }
      this.loadIcon = false
    },
  }
}

</script>

<style scoped>

.tabelleneintrag:hover {
  background-color: rgba(128, 128, 128, 0.29);
}

.v-card {
  background-color: rgba(250, 247, 247, 0.35);
  height: 80%;
  width: 80%;
  max-width: 1500px;
  border-radius: 20px;
}

.cardRight {
  border-top: 3px solid rgba(255, 255, 255, 0.75);
  border-left: 3px solid rgba(255, 255, 255, 0.75);
  border-radius: 30px;
  backdrop-filter: blur(8px);
  box-shadow: 5px 5px 10px #2c2a2a;
  /*height: 500px;*/
  height: 90%;
  width: 95%;
}


.card {
  background-color: rgb(206, 203, 203) !important;
  border-radius: 15px !important;
  box-shadow: 10px 10px 20px black;
}

.button {
  background-color: mediumblue;
  color: white;
}

.v-row {
  height: 100%;
  width: 100%;
  margin-left: 0%;
  margin-right: 0%;
}

</style>
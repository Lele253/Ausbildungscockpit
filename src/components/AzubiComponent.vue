<template>
  <div class="align-center justify-center d-flex" style="height: 100vh; padding-bottom: 120px">
    <v-row class="py-3 d-flex align-center justify-center" style="max-width: 2500px">

      <!--To Do Berichte-->

      <v-col class=" align-center d-flex justify-center" cols="6" style="height: 100%">
        <v-card :style="{ backgroundColor: $store.state.color }" class="cardRight">
          <v-card-title>
            <h1 class="text-center mt-3">
              To do
            </h1>
          </v-card-title>
          <v-card-item>
            <v-table :height="tableHeight" class="mt-2" fixed-header>
              <thead>
              <tr>
                <th class="text-left"
                    style="background-color: mediumblue; color: white; border-radius: 10px 0px 0px 0px">
                  Datum
                </th>
                <th class="text-center"
                    style="background-color: mediumblue; color: white">
                  Jahr
                </th>
                <th class="text-center"
                    style="background-color: mediumblue; color: white; border-radius: 0px 10px 0px 0px">
                  Woche
                </th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="bericht in unfertigeBerichte"
                  :key="bericht"
                  class="tabelleneintrag"
                  @click="öffneDialog(bericht), this.sollFreigegeben = false">
                <td>{{ bericht.von }} - {{ bericht.bis }}</td>
                <td class="text-center">{{ bericht.jahr }}</td>
                <td class="text-center">{{ bericht.woche }}</td>
                <td v-if="bericht.freigegeben" class="text-center" style="color: green;font-size: 30px">
                  <Icon icon="typcn:tick"/>
                </td>
              </tr>
              </tbody>
            </v-table>
          </v-card-item>
        </v-card>
      </v-col>

      <!--      Fertige Berichte-->

      <v-col class=" align-center d-flex justify-center" cols="6" style="height: 100%">
        <v-card :style="{ backgroundColor: $store.state.color }" class="cardRight">
          <v-card-title>
            <h1 class="text-center mt-3">
              Fertige Berichte
            </h1>
          </v-card-title>
          <v-card-item>
            <v-table :height="tableHeight" class="mt-2" fixed-header>
              <thead>
              <tr>
                <th class="text-left"
                    style="background-color: mediumblue; color: white; border-radius: 10px 0px 0px 0px">
                  Datum
                </th>
                <th class="text-center"
                    style="background-color: mediumblue; color: white">
                  Jahr
                </th>
                <th class="text-center"
                    style="background-color: mediumblue; color: white">
                  Woche
                </th>
                <th class="text-center"
                    style="background-color: mediumblue; color: white">
                  Freigegeben
                </th>
                <th class="text-center"
                    style="background-color: mediumblue; color: white; border-radius: 0px 10px 0px 0px">
                  Kontrolliert
                </th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="bericht in fertigeBerichte"
                  :key="bericht"
                  class="tabelleneintrag"
                  @click="öffneDialog(bericht), this.sollFreigegeben = true">
                <td>{{ bericht.von }} - {{ bericht.bis }}</td>
                <td class="text-center">{{ bericht.jahr }}</td>
                <td class="text-center">{{ bericht.woche }}</td>
                <td v-if="bericht.freigegeben" class="text-center" style="color: green;font-size: 30px">
                  <Icon icon="typcn:tick"/>
                </td>
                <td v-if="!bericht.freigegeben" class="text-center" style="color: red;font-size: 30px">
                  <Icon icon="typcn:times"/>
                </td>
                <td v-if="bericht.kontrolliert" class="text-center" style="color: green;font-size: 30px">
                  <Icon icon="typcn:tick"/>
                </td>
                <td v-if="!bericht.kontrolliert" class="text-center" style="color: red;font-size: 30px">
                  <Icon icon="typcn:times"/>
                </td>
              </tr>
              </tbody>
            </v-table>
          </v-card-item>
        </v-card>
      </v-col>

    </v-row>

    <!--   Bericht Dialog Informationen-->

    <v-dialog v-model="dialog" height="auto" width="1200">
      <v-card class="card">
        <v-card-title>
          <h2 class="text-center">
            Berichtsübersicht
          </h2>
        </v-card-title>
        <v-card-text>
          <v-row style="height: 100%; width: 100%">
            <v-col cols="3">
              <v-text-field v-model="jahr" disabled label="Jahr" variant="outlined"/>
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="woche" disabled label="Woche" variant="outlined"/>
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="von" disabled label="Von" variant="outlined"/>
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="bis" disabled label="Bis" variant="outlined"/>
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
              <v-textarea v-model="kommentar" auto-grow disabled="true" label="Kommentar" readonly
                          variant="outlined"/>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn v-if="!loadIcon" @click="dialog = false, readOnly=true">Schließen</v-btn>
          <v-btn v-if="!loadIcon && readOnly && !selectedBericht.kontrolliert" @click="readOnly=false">Bearbeiten
          </v-btn>
          <v-btn v-if="!loadIcon && !readOnly" @click="updateBericht(false)">Speichern</v-btn>
          <v-btn v-if="!loadIcon && !selectedBericht.freigegeben" @click="updateBericht(true)">Freigeben</v-btn>
          <v-btn v-if="!loadIcon && readOnly" @click="generatePDF">PDF downloaden</v-btn>
          <Icon v-if="loadIcon" icon="svg-spinners:90-ring-with-bg" style="font-size: 40px;"/>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>

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
import {Icon} from "@iconify/vue";
import axios from "axios";
import jsPDF from "jspdf";

export default {
  name: "AzubiComponent",
  data: () => ({
    jahr: '',
    woche: '',
    von: null,
    bis: null,
    betrieblicheTätigkeiten: '',
    sonstigeUnterweisungen: '',
    schulischeInhalte: '',
    kommentar: '',
    freigegeben: Boolean,
    kontrolliert: Boolean,

    snackbar: false,
    snackbarContent: '',
    snackbarColor: '',

    sollFreigegeben: false,

    dialog: false,
    selectedBericht: {},
    readOnly: true,

    loadIcon: false,
  }),
  mounted() {
    this.setBerichte()
  },
  methods: {
    async activateSnackbar(content, color) {
      this.snackbar = false
      this.snackbarContent = content
      this.snackbarColor = color
      this.snackbar = true
    },
    generatePDF() {
      const pdf = new jsPDF();

      pdf.setFont("helvetica");

      // Datum
      const currentDate = new Date().toLocaleDateString("de-DE");
      pdf.setFontSize(10);
      pdf.setFont("normal");
      pdf.text(`Dortmund, den ${currentDate}`, 150, 15);

      // Überschrift 1
      pdf.setFontSize(18);
      pdf.setFont("bold");
      pdf.text("Wochenbericht QuinScape GmbH", 20, 15);

      // Parameter für Überschrift 1
      pdf.setFontSize(15);
      pdf.setFont("normal");
      pdf.text(`Name: ${this.user.name}`, 20, 25);

      // Parameter für von und bis
      pdf.setFontSize(12);
      pdf.text(`Von: ${this.von}`, 20, 40);
      pdf.text(`Bis: ${this.bis}`, 60, 40);

      // Parameter für Jahr und Woche
      pdf.setFontSize(12);
      pdf.text(`Jahr: ${this.jahr}`, 20, 47);
      pdf.text(`Woche: ${this.woche}`, 60, 47);

      // Freigegeben und Kontrolliert
      pdf.setFontSize(12);
      pdf.setFont("bold");
      pdf.text("Freigegeben:", 20, 54);
      pdf.text("Kontrolliert:", 60, 54);

      // Haken oder nicht (Freigegeben)
      pdf.setFontSize(12);
      pdf.setFont("normal");
      pdf.text(this.freigegeben ? "X" : "-", 45, 54);

      // Haken oder nicht (Kontrolliert)
      pdf.setFontSize(12);
      pdf.setFont("normal");
      pdf.text(this.kontrolliert ? "X" : "-", 85, 54);

      // Betriebliche Tätigkeiten
      pdf.setFontSize(14);
      pdf.setFont("bold");
      pdf.text("Betriebliche Tätigkeiten", 20, 75);

      // Parameter für Betriebliche Tätigkeiten
      pdf.setFontSize(12);
      pdf.setFont("normal");
      // Bereich für Text
      let textBounds = {x: 20, y: 83, width: 150, height: 100};
      // Text mit automatischen Zeilenumbrüchen
      this.drawBoundedText(pdf, this.betrieblicheTätigkeiten, textBounds);

      // Sonstige Unterweisungen
      pdf.setFontSize(14);
      pdf.setFont("bold");
      pdf.text("Sonstige Unterweisungen", 20, 135);

      // Parameter für Sonstige Unterweisungen
      pdf.setFontSize(12);
      pdf.setFont("normal");
      // Bereich für Text
      textBounds = {x: 20, y: 143, width: 150, height: 100};
      // Text mit automatischen Zeilenumbrüchen
      this.drawBoundedText(pdf, this.sonstigeUnterweisungen, textBounds);

      // Schulische Inhalte
      pdf.setFontSize(14);
      pdf.setFont("bold");
      pdf.text("Schulische Inhalte", 20, 195);

      // Parameter für Schulische Inhalte
      pdf.setFontSize(12);
      pdf.setFont("normal");
      // Bereich für Text
      textBounds = {x: 20, y: 203, width: 150, height: 100};
      // Text mit automatischen Zeilenumbrüchen
      this.drawBoundedText(pdf, this.schulischeInhalte, textBounds);

      // Unterschrift Auszubildender
      pdf.setFontSize(12);
      pdf.setFont("normal");
      pdf.text(`Unterschrift ${this.user.name}`, 20, 275);
      pdf.line(20, 270, 90, 270);  // Auszubildender Linie

      // Unterschrift Ausbilder
      pdf.setFontSize(12);
      pdf.setFont("normal");
      pdf.text("Unterschrift Ausbilder", 120, 275);
      pdf.line(120, 270, 190, 270);  // Ausbilder Linie


      pdf.save(`Wochenbericht QuinScape GmbH vom ${this.von} - ${this.bis} von ${this.user.name}.pdf`);

    },
    drawBoundedText(pdf, text, bounds) {
      const lines = pdf.splitTextToSize(text, bounds.width);
      pdf.text(lines, bounds.x, bounds.y);
    },
    async setBerichte() {
      await this.getUser()
      this.$store.state.berichte = this.user.berichte
    },
    async getUser() {
      try {
        const user = await axios.get('/user')
        await this.$store.dispatch('user', user.data)
      } catch (error) {
        console.log(error)
      }
    },
    öffneDialog(bericht) {
      this.dialog = true
      this.selectedBericht = bericht

      this.jahr = bericht.jahr
      this.woche = bericht.woche
      this.von = bericht.von
      this.bis = bericht.bis
      this.betrieblicheTätigkeiten = bericht.betrieblicheTätigkeiten
      this.sonstigeUnterweisungen = bericht.sonstigeUnterweisungen
      this.schulischeInhalte = bericht.schulischeInhalte
      this.kommentar = bericht.kommentar
      this.freigegeben = bericht.freigegeben
      this.kontrolliert = bericht.kontrolliert
    },
    async updateBericht(freigegeben) {
      this.readOnly = false
      this.loadIcon = true

      try {
        if (this.selectedBericht.freigegeben) {
          freigegeben = true
        }
        await axios.put('/berichte/azubi', {
          id: this.selectedBericht.id,
          betrieblicheTätigkeiten: this.betrieblicheTätigkeiten,
          sonstigeUnterweisungen: this.sonstigeUnterweisungen,
          schulischeInhalte: this.schulischeInhalte,
          freigegeben: freigegeben,
        })

        await this.setBerichte()
        this.dialog = false
        this.readOnly = true
        await this.activateSnackbar(freigegeben ? "Wochenbericht wurde erfolgreich freigegeben." : "Wochenbericht wurde erfolgreich gespeichert.", "green")
      } catch (e) {
        console.log(e)
        await this.activateSnackbar(freigegeben ? "Wochenbericht konnte nicht freigegeben werden." : "Wochenbericht konnte nicht gespeichert.", "red")
      }
      this.loadIcon = false

    },
  },
  components: {
    Icon
  },
  computed: {
    ...mapGetters(['berichte']),
    ...mapGetters(['user']),
    tableHeight() {
      const screenHeight = window.innerHeight;
      if (screenHeight <= 800) {
        return 450;
      }
      if (screenHeight <= 900) {
        return 550;
      }

      if (screenHeight <= 950) {
        return 550;
      }

      if (screenHeight <= 1000) {
        return 600;
      }

      if (screenHeight <= 1100) {
        return 675;
      }

      if (screenHeight <= 1200) {
        return 750;
      }

      if (screenHeight <= 1300) {
        return 850;
      }

      if (screenHeight <= 1400) {
        return 1000;
      }
      return 400
    },
    fertigeBerichte() {
      const result = [];

      this.berichte.forEach(bericht => {
        if (bericht.freigegeben) {
          result.push(bericht);
        }
      });

      const sortierteUnfertigeBerichte = result.sort((a, b) => {
        const datumA = new Date(a.von.split('.').reverse().join('-'));
        const datumB = new Date(b.von.split('.').reverse().join('-'));

        return datumB - datumA;
      });

      return sortierteUnfertigeBerichte;
    },
    unfertigeBerichte() {
      const result = [];

      this.berichte.forEach(bericht => {
        if (!bericht.freigegeben) {
          result.push(bericht);
        }
      });

      const sortierteUnfertigeBerichte = result.sort((a, b) => {
        const datumA = new Date(a.von.split('.').reverse().join('-'));
        const datumB = new Date(b.von.split('.').reverse().join('-'));

        return datumB - datumA;
      });

      return sortierteUnfertigeBerichte;
    },
  },
}

</script>

<style scoped>
.card {
  background-color: rgb(206, 203, 203) !important;
  border-radius: 15px !important;
  box-shadow: 10px 10px 20px black;
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


.v-btn {
  background-color: mediumblue;
  color: white;
}

.v-row {
  height: 100%;
  width: 100%;
  margin-left: 0%;
  margin-right: 0%;
}

.tabelleneintrag {
  cursor: pointer;
}

.tabelleneintrag:hover {
  background-color: rgba(128, 128, 128, 0.29);
}

.tabelleneintrag:active {
  background-color: rgba(128, 128, 128, 0.7);
}


.v-table {
  background-color: transparent;
}

.th {
  background-color: mediumblue;
  color: white;
  border-radius: 5px 5px
}

</style>
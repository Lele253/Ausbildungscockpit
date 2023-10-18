<template>

  <div class="align-center justify-center d-flex" style="height: 100vh; padding-bottom: 120px">

    <v-row class="py-3 d-flex align-center justify-center" style="max-width: 2000px">

      <!--      Nachweise zur Kontrolle-->

      <v-col class=" align-center d-flex justify-center" cols="6" style="height: 100%">
        <v-card :style="{ backgroundColor: $store.state.color }" class="cardRight">
          <v-card-title>
            <h1 class="text-center mt-3">
              Nachweise zur Kontrolle
            </h1>
          </v-card-title>
          <v-card-item>
            <v-table :height="tableHeight" class="mt-2" fixed-header>
              <thead>
              <tr>
                <th class="text-left"
                    style="background-color: mediumblue; color: white; color: white; border-radius: 10px 0px 0px 0px">
                  Name
                </th>
                <th class="text-left"
                    style="background-color: mediumblue; color: white;">
                  Datum
                </th>
                <th class="text-center"
                    style="background-color: mediumblue; color: white;">
                  Jahr
                </th>
                <th class="text-center"
                    style="background-color: mediumblue; color: white;; border-radius: 0px 10px 0px 0px">
                  Woche
                </th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="bericht in korrigierendeBerichte"
                  :key="bericht"
                  class="tabelleneintrag">
                <td @click="einzelBerichtInformation(bericht)">{{ bericht.name }}</td>
                <td @click="einzelBerichtInformation(bericht)">{{ bericht.von }} - {{ bericht.bis }}</td>
                <td class="text-center" @click="einzelBerichtInformation(bericht)">{{ bericht.jahr }}</td>
                <td class="text-center" @click="einzelBerichtInformation(bericht)">{{ bericht.woche }}</td>
              </tr>
              </tbody>
            </v-table>
          </v-card-item>
        </v-card>
      </v-col>

      <!--      Ausbildungsverhältnisse-->

      <v-col class=" align-center d-flex justify-center" cols="6" style="height: 100%">
        <v-card :style="{ backgroundColor: $store.state.color }" class="cardRight">
          <v-card-title>
            <h1 class="text-center mt-3">
              Ausbildungsverhältnisse
            </h1>
          </v-card-title>
          <v-card-item>
            <v-table :height="tableHeight" class="mt-2" fixed-header>
              <thead>
              <tr>
                <th class="text-left"
                    style="background-color: mediumblue; color: white;border-radius: 10px 0px 0px 0px">
                  Name
                </th>
                <th class="text-left"
                    style="background-color: mediumblue; color: white;">
                  Berufsbezeichnung
                </th>
                <th class="text-left"
                    style="background-color: mediumblue; color: white;">
                  Schule
                </th>
                <th class="text-center"
                    style="background-color: mediumblue; color: white; border-radius: 0px 10px 0px 0px">
                  Berichte
                </th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="person in user.azubis"
                  :key="person"
                  class="tabelleneintrag">
                <td @click="azubiInformation(person)">{{ person.name }}</td>
                <td @click="azubiInformation(person)">{{ person.berufsbezeichnung }}</td>
                <td @click="azubiInformation(person)">{{ person.schule }}</td>
                <td class="d-flex justify-center align-center" @click="azubiBerichte(person)">
                  <Icon icon="line-md:document-list-twotone" style="font-size: 40px"/>
                </td>
              </tr>
              </tbody>
            </v-table>
          </v-card-item>
        </v-card>
      </v-col>

    </v-row>

    <!--Azubi Dialog Informationen-->

    <v-dialog
        v-model="azubiDialog"
        width="700">
      <v-card class="card">
        <v-card-title>
          <h2 class="text-center">
            {{ azubi.name }}
          </h2>
        </v-card-title>
        <v-card-text>
          <div class="card-body">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="azubiName" disabled="true" label="Name" variant="outlined"/>
              </v-col>
              <v-col cols="9">
                <v-text-field v-model="azubiBerufsbezeichnung" disabled="true" label="Berufsbezeichnung"
                              variant="outlined"/>
              </v-col>
              <v-col cols="3">
                <v-text-field v-model="azubiAusbildungsbeginn" disabled="true" label="Ausbildungsbeginn"
                              type="date"
                              variant="outlined"/>
              </v-col>
              <v-col cols="9">
                <v-text-field v-model="azubiSchule" disabled="true" label="Schule" variant="outlined"/>
              </v-col>
              <v-col cols="3">
                <v-text-field v-model="azubiAusbildungsende" disabled="true" label="Ausbildungsende"
                              type="date" variant="outlined"/>
              </v-col>
            </v-row>


          </div>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn @click="azubiDialog = false, readOnly=true">Schließen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Berichte Dialog Informationen-->

    <v-dialog
        v-model="berichteDialog"
        width="700">
      <v-card class="card">
        <v-card-title>
          <h2 class="text-center">
            {{ azubi.name }}
          </h2>
        </v-card-title>
        <v-card-text>
          <div>
            <v-table class="mt-2" fixed-header height="400">
              <thead>
              <tr>
                <th class="text-left"
                    style="background-color: rgba(38,104,204,0.6); backdrop-filter: blur(8px); color: white; border-radius: 10px 0px 0px 0px">
                  Datum
                </th>
                <th class="text-left"
                    style="background-color: rgba(38,104,204,0.6); backdrop-filter: blur(8px); color: white">
                  Jahr
                </th>
                <th class="text-left"
                    style="background-color: rgba(38,104,204,0.6); backdrop-filter: blur(8px); color: white">
                  Woche
                </th>
                <th class="text-left"
                    style="background-color: rgba(38,104,204,0.6); backdrop-filter: blur(8px); color: white">
                  Freigegeben
                </th>
                <th class="text-left"
                    style="background-color: rgba(38,104,204,0.6); backdrop-filter: blur(8px); color: white; border-radius: 0px 10px 0px 0px">
                  Kontrolliert
                </th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="bericht in personenBerichte"
                  :key="bericht"
                  class="tabelleneintrag"
                  @click="einzelBerichtInformation(bericht)">
                <td>{{ bericht.von }} - {{ bericht.bis }}</td>
                <td>{{ bericht.jahr }}</td>
                <td>{{ bericht.woche }}</td>
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
          </div>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn @click="berichteDialog = false">schließen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Einzel Bericht Dialog Informationen-->

    <v-dialog v-model="einzelBerichtDialog" height="auto" width="1200">
      <v-card class="card">
        <v-card-title>
          <h2 class="text-center">
            Berichtsübersicht von {{ selectedBericht.name }}
          </h2>
        </v-card-title>
        <v-card-text>
          <v-row style="height: 100%; width: 100%">
            <v-col cols="3">
              <v-text-field v-model="jahr" disabled label="Jahr" type="number" variant="outlined"/>
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="woche" disabled label="Woche" type="number" variant="outlined"/>
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="von" disabled label="Von" variant="outlined"/>
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="bis" disabled label="Bis" variant="outlined"/>
            </v-col>
            <v-col cols="6">
              <v-textarea v-model="betrieblicheTätigkeiten" auto-grow counter disabled label="Betriebliche Tätigkeiten"
                          variant="outlined"/>
            </v-col>
            <v-col cols="6">
              <v-textarea v-model="sonstigeUnterweisungen" auto-grow counter disabled label="Sonstige Unterweisungen"
                          variant="outlined"/>
            </v-col>
            <v-col cols="6">
              <v-textarea v-model="schulischeInhalte" auto-grow counter disabled label="Schulische Inhalte"
                          variant="outlined"/>
            </v-col>
            <v-col cols="6">
              <v-textarea v-model="kommentar" :disabled="readOnly" auto-grow label="Kommentar" variant="outlined"/>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn v-if="!loadIcon" @click="einzelBerichtDialog = false, readOnly=true">Schließen</v-btn>
          <v-btn v-if="!loadIcon && !readOnly && !selectedBericht.kontrolliert && selectedBericht.freigegeben"
                 @click="updateBericht(false, false)">Zurückweisen
          </v-btn>
          <v-btn v-if="!loadIcon && readOnly && !selectedBericht.kontrolliert && selectedBericht.freigegeben"
                 @click="readOnly = false">Kommentieren
          </v-btn>
          <v-btn v-if="!loadIcon && readOnly && !selectedBericht.kontrolliert && selectedBericht.freigegeben"
                 @click="updateBericht(true, true)">Akzeptieren
          </v-btn>
          <v-btn v-if="!loadIcon" @click="generatePDF">
            PDF downloaden
          </v-btn>
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

import {Icon} from '@iconify/vue';
import {mapGetters} from "vuex";
import axios from "axios";
import jsPDF from "jspdf";

export default {
  name: "AusbilderComponent",
  data: () => ({

    azubiDialog: false,
    berichteDialog: false,
    einzelBerichtDialog: false,
    azubi: {},
    bericht: {},

    snackbar: false,
    snackbarContent: '',
    snackbarColor: '',

    loadIcon: false,

    azubiName: null,
    azubiBerufsbezeichnung: null,
    azubiAusbildungsbeginn: null,
    azubiSchule: null,
    azubiAusbildungsende: null,


    jahr: '',
    woche: '',
    von: null,
    bis: null,
    betrieblicheTätigkeiten: '',
    sonstigeUnterweisungen: '',
    schulischeInhalte: '',
    kommentar: null,
    freigegeben: Boolean,
    kontrolliert: Boolean,

    dialog: false,
    selectedBericht: {},
    readOnly: true,

    vorname: '',
    nachname: '',
    berufsbezeichnung: '',
    schule: '',
    ausbildungsbeginn: '',
    ausbildungsende: '',
    nAusbilder: '',

  }),
  computed: {
    ...mapGetters(['berichte']),
    ...mapGetters(['azubis']),
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
    personenBerichte() {
      const passendeBerichte = [];
      try {
        this.user.azubis.forEach(e => e.berichte.forEach(bericht => {
          if (bericht.name === this.azubi.name) {
            passendeBerichte.push(bericht);
          }
        }));
      } catch (e) {
        console.log(e)
      }
      return passendeBerichte;
    },
    korrigierendeBerichte() {
      const korrigierendeBerichte = [];

      try {
        this.user.azubis.forEach(e => e.berichte.forEach(bericht => {
          if (bericht.freigegeben && !bericht.kontrolliert) {
            korrigierendeBerichte.push(bericht);
          }
        }));
      } catch (e) {
        console.log(e)
      }

      const sort = korrigierendeBerichte.sort((a, b) => {
        const datumA = new Date(a.von.split('.').reverse().join('-'));
        const datumB = new Date(b.von.split('.').reverse().join('-'));

        return datumB - datumA;
      });

      return sort
    }
  },
  components: {
    Icon
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
      pdf.text(`Name: ${this.azubiName}`, 20, 25);

      // Parameter für von und bis
      pdf.setFontSize(12);
      pdf.text(`Von: ${this.von}`, 20, 40);
      pdf.text(`Bis: ${this.bis}`, 60, 40);

      // Parameter für Jahr und Woche
      pdf.setFontSize(12);
      pdf.text(`Ausbildungsjahr: ${this.jahr}`, 20, 47);
      pdf.text(`Ausbildungswoche: ${this.woche}`, 60, 47);

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
      pdf.setFontSize(15);
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
      pdf.setFontSize(15);
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
      pdf.setFontSize(15)
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
      pdf.text(`Unterschrift ${this.azubiName}`, 20, 275);
      pdf.line(20, 270, 90, 270);  // Auszubildender Linie

      // Unterschrift Ausbilder
      pdf.setFontSize(12);
      pdf.setFont("normal");
      pdf.text("Unterschrift Ausbilder", 120, 275);
      pdf.line(120, 270, 190, 270);  // Ausbilder Linie


      pdf.save(`Wochenbericht QuinScape GmbH vom ${this.von} - ${this.bis} von ${this.azubiName}.pdf`);

    },
    drawBoundedText(pdf, text, bounds) {
      const lines = pdf.splitTextToSize(text, bounds.width);
      pdf.text(lines, bounds.x, bounds.y);
    },
    async getUser() {
      try {
        const user = await axios.get('/user')
        await this.$store.dispatch('user', user.data)
        if (this.$store.state.user !== null) {
          this.dialog = false
        }
      } catch (error) {
        console.log(error)
      }

    },
    async updateBericht(kontrolliert, freigegeben) {
      this.readOnly = true
      this.loadIcon = true

      try {
        await axios.put('/berichte/ausbilder', {
          id: this.selectedBericht.id,
          kontrolliert: kontrolliert,
          freigegeben: freigegeben,
          kommentar: this.kommentar
        })
        await this.getUser()
        this.einzelBerichtDialog = false

        if (kontrolliert) await this.activateSnackbar("Wochenbericht wurde erfolgreich akzeptiert", "green")
        if (!freigegeben) await this.activateSnackbar("Wochenbericht wurde erfolgreich zurückgewiesen", "green")
      } catch (e) {
        console.log(e)
        if (kontrolliert) await this.activateSnackbar("Wochenbericht konnte nicht akzeptiert werden", "red")
        if (!freigegeben) await this.activateSnackbar("Wochenbericht konnte nicht zurückgewiesen werden", "red")
      }
      this.loadIcon = false
    },
    azubiInformation(person) {
      this.azubiName = person.name;
      this.azubiBerufsbezeichnung = person.berufsbezeichnung;
      this.azubiAusbildungsbeginn = person.ausbildungsbeginn;
      this.azubiSchule = person.schule;
      this.azubiAusbildungsende = person.ausbildungsende;

      this.azubi = person
      this.azubiDialog = true
    },
    einzelBerichtInformation(bericht) {
      this.einzelBerichtDialog = true
      this.readOnly = true
      this.selectedBericht = bericht

      this.azubiName = bericht.name
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
    azubiBerichte(person) {
      this.azubi = person
      this.berichteDialog = true
    },
  }
}
</script>

<style scoped>
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
  backdrop-filter: blur(8px);
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

.card {
  border-radius: 15px !important;
  box-shadow: 10px 10px 20px black;
}

.v-table {
  background-color: transparent;
}

.th {
  background-color: mediumblue;
  backdrop-filter: blur(8px);
  color: white;
  border-radius: 5px 5px
}

</style>
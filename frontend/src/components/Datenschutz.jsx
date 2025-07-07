import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Datenschutz = () => {
  return (
    <div className="app">
      <Header />
      <main className="content" style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1>Datenschutzerklärung für TaskHero</h1>

        <h2>1. Allgemeine Hinweise</h2>
        <p>
          Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen.
          Wir behandeln Ihre personenbezogenen Daten vertraulich und
          entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser
          Datenschutzerklärung.
        </p>
        <p>
          <strong>Verantwortlicher für die Datenverarbeitung auf dieser Website:</strong><br />
          TaskHero<br />
          [Dein Unternehmen oder Betreibername]<br />
          [Adresse]<br />
          [Telefonnummer]<br />
          [E-Mail-Adresse]
        </p>

        <h2>2. Erhebung und Speicherung personenbezogener Daten sowie Art und Zweck ihrer Verwendung</h2>
        <h3>a) Beim Besuch der Website</h3>
        <p>
          Beim Aufrufen unserer Website werden durch den auf Ihrem Endgerät zum
          Einsatz kommenden Browser automatisch Informationen an den Server
          unserer Website gesendet. Diese Informationen werden temporär in
          einem sogenannten Logfile gespeichert:
        </p>
        <ul>
          <li>IP-Adresse des anfragenden Rechners</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>Name und URL der abgerufenen Datei</li>
          <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
          <li>Verwendeter Browser und ggf. Betriebssystem</li>
          <li>Name Ihres Access-Providers</li>
        </ul>
        <p>
          Die genannten Daten werden verarbeitet zu folgenden Zwecken:
        </p>
        <ul>
          <li>Reibungsloser Verbindungsaufbau</li>
          <li>Komfortable Nutzung der Website</li>
          <li>Systemsicherheit und -stabilität</li>
          <li>Weitere administrative Zwecke</li>
        </ul>
        <p>Rechtsgrundlage: Art. 6 Abs. 1 S. 1 lit. f DSGVO.</p>

        <h3>b) Bei Nutzung unseres Kontaktformulars</h3>
        <p>
          Wenn Sie ein Kontaktformular nutzen, speichern wir die von Ihnen
          eingegebenen Daten zur Bearbeitung Ihrer Anfrage und für
          Anschlussfragen.
        </p>

        <h2>3. Weitergabe von Daten</h2>
        <p>Wir geben Ihre Daten nur weiter, wenn:</p>
        <ul>
          <li>Sie ausdrücklich eingewilligt haben (Art. 6 Abs. 1 S. 1 lit. a DSGVO)</li>
          <li>Es für einen Vertrag notwendig ist (Art. 6 Abs. 1 S. 1 lit. b DSGVO)</li>
          <li>Es gesetzlich vorgeschrieben ist (Art. 6 Abs. 1 S. 1 lit. c DSGVO)</li>
          <li>Es unserem berechtigten Interesse dient (Art. 6 Abs. 1 S. 1 lit. f DSGVO)</li>
        </ul>

        <h2>4. Cookies</h2>
        <p>
          Unsere Website verwendet Cookies. Sie können in Ihrem Browser
          Cookies ablehnen oder beschränken. Dies kann jedoch die
          Funktionalität der Website beeinträchtigen.
        </p>

        <h2>5. Analyse-Tools und Tools von Drittanbietern</h2>
        <p>
          (Platzhalter – hier solltest du konkret aufführen, ob und welche Tools wie Google Analytics, Matomo, Hotjar etc. verwendet werden)
        </p>

        <h2>6. Ihre Rechte als betroffene Person</h2>
        <ul>
          <li>Art. 15 DSGVO – Auskunft</li>
          <li>Art. 16 DSGVO – Berichtigung</li>
          <li>Art. 17 DSGVO – Löschung</li>
          <li>Art. 18 DSGVO – Einschränkung der Verarbeitung</li>
          <li>Art. 20 DSGVO – Datenübertragbarkeit</li>
          <li>Art. 77 DSGVO – Beschwerderecht</li>
        </ul>

        <h2>7. Widerspruchsrecht</h2>
        <p>
          Wenn Ihre Daten auf Grundlage von berechtigten Interessen verarbeitet
          werden (Art. 6 Abs. 1 lit. f DSGVO), haben Sie das Recht, Widerspruch
          einzulegen (Art. 21 DSGVO).
        </p>

        <h2>8. Datensicherheit</h2>
        <p>
          Wir nutzen SSL-Verschlüsselung zur sicheren Übertragung Ihrer Daten.
        </p>

        <h2>9. Aktualität und Änderung dieser Datenschutzerklärung</h2>
        <p>
          Diese Datenschutzerklärung hat den Stand Juli 2025. Änderungen können
          durch gesetzliche Vorgaben oder Weiterentwicklung der Website
          notwendig werden.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Datenschutz;

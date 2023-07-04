# Relazione progetto finale Programmazione Web e Mobile

## Descrizione

Il progetto consiste in un'applicazione web per la gestione di playlist musicali. L'applicazione è composta da un frontend e un backend, entrambi scritti in TypeScript. Il frontend è stato sviluppato con React, mentre il backend è stato sviluppato con Express. Il database utilizzato è MongoDB.

Realizzato da **Larosa David (04881A)**

## Installazione :wrench:

Link codice sorgente: https://github.com/daxdiv/progetto-pwm

- Clonare la repository:
  ```bash
  git clone https://github.com/daxdiv/progetto-pwm.git
  ```
- Installare le dependencies del frontend:
  ```bash
  cd client
  npm install
  ```
- Installare le dependencies del backend:
  ```bash
    cd server
    npm install
  ```
- Creare un file `.env` nella cartella `server` copiando il contenuto del file `.env.example` e inserendo le proprie variabili d'ambiente:

  ```bash
  cd server
  cp .env.example .env
  ```

- Creare un file `.env` nella cartella `client` copiando il contenuto del file `.env.example`:
  ```bash
    cd client
    cp .env.example .env
  ```
- Eseguire:
  ```bash
    cd server
    npm run dev
  ```
  - Se si devono effettuare modifiche al backend è necessario eseguire il comando `npm run watch` in un terminale e `npm run dev` in un altro terminale.
- Eseguire:
  ```bash
    cd client
    npm run dev
  ```

Il sito sarà disponibile all'indirizzo http://localhost:5173.
La documentazione delle API sarà disponibile all'indirizzo http://localhost:3001/api-docs dopo aver avviato il server.

## Struttura :file_folder:

- `client`: frontend realizzato con [React](https://react.dev) e [Typescript](https://www.typescriptlang.org)
  - `src`: codice sorgente
    - `components`: componenti React
      - `components/ui`: componenti UI (button, input, ...)
    - `hooks`: custom hooks
    - `styles`: fogli di stile, con [TailwindCSS](https://tailwindcss.com)
    - `types`: definizione
    - `utils`: funzioni di utilità
    - `App.tsx`: componente principale
    - `index.tsx`: punto di ingresso
    - `BrowsePlaylists.tsx`: pagina di visualizzazione delle playlist pubbliche
    - `EditPlaylist.tsx`: pagina di modifica di una playlist
    - `Profile.tsx`: pagina di visualizzazione del profilo
    - `Protected.tsx`: componente per bloccare accessi non autorizzati
    - `SignIn.tsx`: pagina di login (pagina principale)
    - `SignUp.tsx`: pagina di registrazione
    - Richieste HTTP: fetch API
- `server`: backend in [Typescript](https://www.typescriptlang.org) e [Express](https://expressjs.com)
  - `src`: codice sorgente
    - `middlewares`: middleware
    - `models`: modelli per il database MongoDB
    - `routers`: router per le richieste HTTP (auth, playlist, user)
    - `index.ts`
- Database: [MongoDB](https://www.mongodb.com)

- Utilities:
  - [react-query](https://tanstack.com/query/v3/): per avere una gestione più semplice delle richieste HTTP con stato di caricamento, errore e dati _(frontend)_
  - Librerie per componenti già pronti come icone di caricamento e select asincrone _(frontend)_
  - [eslint](https://eslint.org) _(frontend/backend)_
  - comunicazione database: [Mongoose](https://mongoosejs.com) _(backend)_
  - Hashing password: [bcrypt](https://www.npmjs.com/package/bcrypt) _(backend)_

## Organizzazione del codice :file_folder:

#### Frontend

Il frontend è organizzato su più pagine, definite come componenti React tutte nella cartella `client/src`.
Il routing delle medesime è gestito da [react-router-dom](https://reactrouter.com/web/guides/quick-start).
Ogni pagina è composta a sua volta da componenti React più piccoli, che possono essere riutilizzati in altre pagine (i.e. Button, Input, ...).

#### Backend

Le API del backend sono definite in più routers, nella cartella `server/src`. Ogni router gestisce un endpoint diverso in `server/src/controllers`. I routers si occupano di gestire le richieste HTTP, e di comunicare con il database. I modelli per il database sono definiti nella cartella `server/src/models`.
Sono inoltre definiti alcuni middleware nella cartella `server/src/middlewares`, che vengono principalmente per verificare gli id ricevuti nelle richieste HTTP.
La documentazione delle API è disponibile all'indirizzo http://localhost:3001/api-docs una volta avviato il server.

## Funzionalità :gear:

#### Autenticazione :closed_lock_with_key:

L'autenticazione avviene in modo classico con email e password, l'email all'interno del database è univoca per evitarne duplicati, lo stesso per l'username in fase di registrazione. La password viene salvata all'interno del database in modo sicuro, utilizzando la funzione di hashing di del pacchetto [bcrypt](https://www.npmjs.com/package/bcrypt).
Il tutto inviando una richiesta POST all'endpoint `/auth/sign-in`, in caso di credenziali corrette i dati dell'utente vengono salvati in localStorage per semplicità, in una situazione reale sarebbe necessario utilizzare dei [JWT](https://jwt.io/introduction).

- Per alcune richieste viene inoltre verificata la validità del/degli id forniti, tramite il middleware `checkIds` definito in `server/src/middlewares/index.ts`.

- Alcune pagine godono di un accesso protetto, ossia solo se l'utente è autenticato può accedervi. Per fare ciò è stato definito un componente `Protected` che si occupa di verificare se l'utente è autenticato, e in caso contrario lo reindirizza alla pagina di login.
  Questo componente sfrutta un custom hook (`useAuth`) per verificare se l'utente è autenticato, e in caso contrario effettuare il redirect.

```typescript
import { useNavigate } from "react-router-dom";

type Auth = {
  _id: string;
  username: string;
  email: string;
  password: string;
  preferredGenres: string[];
  description: string;
  savedPlaylists: string[];
};

/**
 * Hook che restituisce i dati dell'utente loggato, se non loggato reindirizza alla pagina di login
 */
export default function useAuth() {
  const navigate = useNavigate();
  const userDataString = localStorage.getItem("user");

  if (!userDataString) {
    navigate("/?error=Devi prima effettuare il login");
    return;
  }

  return JSON.parse(userDataString) as Auth;
}
```

#### Ottenimento e refresh del token di Spotify :arrows_counterclockwise:

Il token è ottenuto tramite una richiesta POST all'endpoint `/auth/access-token`, che a sua volta effettua una richiesta a Spotify per ottenere il token. Il token viene salvato in localStorage.
Questa chiamata, sfruttando le opzioni di `react-query`, viene effettuata ogni 55 minuti, in modo da evitare che il token scada (dura 1 ora).
Per l'ottenimento del token è necessario specificare due variabili d'ambiente, `SPOTIFY_CLIENT_ID` e `SPOTIFY_CLIENT_SECRET`, che vengono utilizzate per l'autenticazione con Spotify.

#### Correttezza delle richieste :heavy_check_mark:

La verifica della correttezza delle richieste viene fatta sia lato frontend che lato backend, per evitare che l'utente possa inviare richieste errate, come ad esempio un'email non nel formato corretto, o un id non valido.

#### Altro :bulb:

Durante l'ottenimento delle info di una canzone, quasi mai vengono restituiti i generi musicali che la "compongono".
Per ovviare questo problema, viene effettuata una richiesta a Spotify per ottenere i generi musicali dell'artista, e vengono restituiti.
I generi musicali che compongono una canzone vengono ottenuti in base a quelli del/degli artisti che la compongono.

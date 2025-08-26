## `Setup instruction (Linux only)`


### `Step 1: Install curl 💾 :`
```
sudo apt-get install curl
```

### `Step 2: Install Node.js 💾 :`
```
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
```
Restart bash
```
nvm install 22.9.0
```
```
nvm alias default 22.9.0
```

Ensure installed version using `node -v` command

### `Step 3: Install Yarn 💾 :`
```
npm install -g yarn
```
```
yarn set version 4.5.0
```

Ensure installed version using `yarn -v` command

### `Step 4: Install Oh-My-Zsh 💻 :`
```
sudo apt install zsh
```
```
sudo chsh -s $(which zsh)
```
```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Close and reopen a new terminal, it will start using oh-my-zsh

### `Step 5: Install Zsh useful plugins (optionnal) 💡 :`
```
git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:-${ZSH:-~/.oh-my-zsh}/custom}/plugins/zsh-completions
```
```
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```
```
git clone https://github.com/zsh-users/zsh-syntax-highlighting ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

Then :

```
cd
```
```
nano .zshrc
```

Scroll down and replace "plugins=(git)" by :

```
plugins=(
  git
  last-working-dir
  zsh-completions
  zsh-autosuggestions
  zsh-syntax-highlighting
)
```

Save file (ctrl + S) and exit (ctrl + X)
Close and reopen a new terminal

### `Step 6: Install Ruby 💎 :`
```
gpg --keyserver keyserver.ubuntu.com --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
```
```
\curl -sSL https://get.rvm.io | bash
```

Close and reopen terminal

```
rvm install 3.3.5
```

Ensure installed version using ```ruby -v``` command


### `Step 7: Install Postgresql 🐘 :`
```
sudo apt install postgresql
```

Start postgres services :
```
sudo service postgresql start
```

Create main user :
```
sudo -u postgres createuser --interactive
```
(Enter your UNIX (linux session) username and then type `y` to be superuser).
(Forgot your UNIX username ? type `echo $USER` from the terminal to see it).

Stop postgresql service for a while :
```
sudo service postgresql stop
```

### `Step 8: Install future Rails requirement 💎 :`
```
sudo apt install libpq-dev
```

### `Step 9: CLONE RENTECAISSE GIT REPOSITORY 😎 :`
Make sure to clone the repo from the terminal root (type `cd` before continue to ensure it).
```
git clone https://github.com/Vaan17/rentecaisse.git
```

Move into the project folder :
```
cd rentecaisse
```

### `Step 10: Install all installed packages and gems 📚 :`
```
yarn install
```
```
bundle install
```
### `Step 11 : Restart postgressql service 📚 :`
```
sudo service postgresql start
```


### `Step 12: Create Rails local database 💾 :`
```
rails db:create
```

### `Step 13: Launch all services 🌠 :`

Compiler :
```
yarn vite
```

== Open a new terminal ==

Server :
```
rails s
```

== Open a new terminal ==

IDE (if already set up, else, it will ask you to choose your IDE from an installed one) :
(RECOMMENED IDE : 1. Visual Studio Code - 2. Cursor - 3. others... )
```
code .
```

### `Final Step: Open the app ✨ :`

Current URL : http://localhost:5173/ (Check terminal running compiler to see it).

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

### `Others things :`
`npm run build`: Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `Commandes utiles pour la base de données 🗃️ :`

Voici les commandes disponibles pour gérer la base de données :

```bash
rails db:drop
```
Cette commande permet de :
- Supprimer complètement la base de données existante

```bash
rails db:create
```
Cette commande permet de :
- Créer une nouvelle base de données vide

```bash
rails db:migrate
```
Cette commande permet de :
- Exécuter toutes les migrations pour créer la structure de la base de données

```bash
rails db:seed
```
Cette commande permet de :
- Charger les données de test depuis le fichier `seeds.rb`

```bash
rails db:reset
```
Cette commande combine toutes les commandes précédentes :
- Supprime la base de données
- Recrée la base de données
- Exécute les migrations
- Charge les données de test
- Parfait pour repartir d'une base propre

⚠️ **Note importante** : Avant d'exécuter ces commandes, assurez-vous que :
- Le serveur Rails n'est pas en cours d'exécution
- DBeaver ou tout autre client SQL est fermé
- PostgreSQL est bien démarré (`sudo service postgresql start`)

test test2
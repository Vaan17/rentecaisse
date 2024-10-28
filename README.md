## `Setup instruction (Linux only)`

### `Step 1: Install Node.js 💾 :`
```
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
```
```
nvm install 22.9.0
```
```
nvm alias default 22.9.0
```

Ensure installed version using `node -v` command

### `Step 2: Install Yarn 💾 :`
```
npm install -g yarn
```
```
yarn set version 4.5.0
```

Ensure installed version using `yarn -v` command

### `Step 3: Install Oh-My-Zsh 💻 :`
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

### `Step 4: Install Zsh useful plugins (optionnal) 💡 :`
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

### `Step 5: Install Ruby 💎 :`
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

### `Step 6: Install Postgresql 🐘 :`
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

### `Step 7: Install future Rails requirement 💎 :`
```
sudo apt install libpq-dev
```

### `Step 8: CLONE RENTECAISSE GIT REPOSITORY 😎 :`
Make sure to clone the repo from the terminal root (type `cd` before continue to ensure it).
```
git clone https://github.com/Vaan17/rentecaisse.git
```

Move into the project folder :
```
cd rentecaisse
```

### `Step 8: Install all installed packages and gems 📚 :`
```
yarn install
```
```
bundle install
```

### `Step 9: Create Rails local database 💾 :`
```
rails db:create
```

### `Step 10: Launch all services 🌠 :`
Postgresql :
```
sudo service postgresql start
```

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
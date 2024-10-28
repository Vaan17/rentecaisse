### `Setup instruction (Linux only)`

### `Step 1: Install Yarn :`
```npm install -g yarn```

Ensure installed version using `yarn -v` command

### `Step 2: Install Oh-My-Zsh :`
```sudo apt install zsh```
```sudo chsh -s $(which zsh)```
```sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"```

Close and reopen a new terminal, it will start using oh-my-zsh

### `Step 3: Install Zsh useful plugins (optionnal) :`
```git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:-${ZSH:-~/.oh-my-zsh}/custom}/plugins/zsh-completions```
```git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions```
```git clone https://github.com/zsh-users/zsh-syntax-highlighting ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting```

```cd```
```nano .zshrc```

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

### `Step 4: Install Node.js :`
```curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash```
```nvm install 22.9.0```
```nvm alias default 22.9.0```

Ensure installed version using `node -v` command

### `Step 5: Install Ruby :`
```gpg --keyserver keyserver.ubuntu.com --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB```
```\curl -sSL https://get.rvm.io | bash```

Close and reopen terminal

```rvm install 3.3.5```

Ensure installed version using `ruby -v` command

### `Step 6: Install Postgresql :`
```sudo apt install postgresql```

Start local database :
```sudo service postgresql start```

```sudo -u postgres createuser --interactive```
(Enter your UNIX (linux session) username and then type `y` to be superuser).

### `Step 7: Install Rails :`
```gem install rails```

### `Step 8: Prepare and install backend structure :`
```sudo apt install libpq-dev```
```rails new backend --api -d postgresql```

Move backend/ files into project root folder, except : [ .git, .gitignore, README.md, public/ ]
Merge Rails .gitignore file content into your project .gitignore file. Then, delete backend/ folder.

```rails db:create```

### `Step 9: Install TypeScript :`
```yarn add typescript @types/node @types/react @types/react-dom @types/jest```

### `Step 10: Install Redux :`
```yarn add redux react-redux```

### `Others things`
`npm run build`: Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
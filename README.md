### `Setup instruction (Linux only)`

### `Step1: Install Yarn :`
>_ npm install -g yarn

ensure installed version using `yarn -v` command

### `Step2: Install Oh-My-Zsh :`
>_ sudo apt install zsh
>_ sudo chsh -s $(which zsh)
>_ sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

close and reopen a new terminal, it will start using oh-my-zsh

### `Step3: Install Zsh useful plugins (optionnal) :`
>_ git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:-${ZSH:-~/.oh-my-zsh}/custom}/plugins/zsh-completions
>_ git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
>_ git clone https://github.com/zsh-users/zsh-syntax-highlighting ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

>_ cd
>_ nano .zshrc

Scroll down and replace "plugins=(git)" by :
plugins=(
  git
  last-working-dir
  zsh-completions
  zsh-autosuggestions
  zsh-syntax-highlighting
)

save file (ctrl + S) and exit (ctrl + X)
close and reopen a new terminal

### `Step4: Install Node.js :`
>_ curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
>_ nvm install 22.9.0
>_ nvm alias default 22.9.0

ensure installed version using `node -v` command

### `Step5: Install Ruby :`
>_ gpg --keyserver keyserver.ubuntu.com --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
>_ \curl -sSL https://get.rvm.io | bash

close and reopen terminal

>_ rvm install 3.3.5

ensure installed version using `ruby -v` command

### `Step6: Install Postgresql :`
>_ sudo apt install postgresql

start local database :
>_ sudo service postgresql start

>_ sudo -u postgres createuser --interactive

enter your username (ex: melvinaime) and then type `y` to be superuser

>_ sudo -u postgres createdb bdd_rentecaisse

### `Step7: Install Rails :`
>_ gem install rails

### `Step8: Prepare backend structure installation :`
>_ sudo apt install libpq-dev

### `Others things`
`npm run build`: Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
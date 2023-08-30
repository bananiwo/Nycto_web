jak uruchomić:
1. ściągnąć i zainstalować node.js ze strony https://nodejs.org/en
2. w konsoli wejść do głównego folderu projektu, wpisać 'npm install' (pobiorą się dependencje wypisane w package.json)
3. w webstormie otworzyć nowy projekt -> główny folder -> wejść do pliku app.ejs -> run (shift + f10), alternatywnie bez webstorma - w konsoli (cmd) wejść do folderu głównego projektu (cd) i wpisać 'node app'
4. w przeglądarce (u mnie chrome) wpisać localhost:3000
*. żeby nie musieć uruchamiać projektu od nowa przy każdej zmianie, można zrobić automatyczne odświeżanie za pomocą nodemon: instalacja w konsoli 'npm install -g nodemon', wtedy automatyczne odświeżanie kodu: wejść w konsoli do folderu głównego projektu -> 'nodemon app'
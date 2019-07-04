## Startup Booster Gitboard

This project is a Dashboard application that shows metrics abour a specific repository, all you need to do is search for the owner and repository name and hit enter!

## Getting Started

### Installation

After cloning or downloading this repository, navigate to the folder and run:

```
npm install
```

On the same folder, create a .env file with no name that will hold your OAuth access token, if you are using Linux the command should be:

```
cat .env
```

In this .env file, you need to write your access token, this token will be used as a header on the GitHub api requests made by the app. If you don't know how to generate your personal access token, there is a very simple tutorial [here](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line).

After doing that, the file should look like this:

```
REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_TOKEN_HERE
```

Thats it! All you gotta do now is run ``` npm start``` and open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Folders and Files

```sh
├── public
│   └── favicon.ico
│   └── index.html
│   └── manifest.json
├── src
│   └── assets
│   │   └── images
│   │   │   └── liferay_icon.PNG
│   └── components
│   │   └── average-merge-time
│   │   └── loader
│   │   └── month-summary
│   │   └── repo-search
│   │   └── sidenav
│   │   └── time-text-card
│   └── domain
│   │   └── pull-request-data.js
│   └── pages
│   │   └── dashboard
│   │   └── not-found
│   └── utils
│   │   └── date-time-utils.js
│   │   └── request-helper.js
│   └── index.css
│   └── index.js
├── .env
├── .gitignore
├── LICENSE
├── package-lock.json
├── package.json
└── README.md
```

## What I used?

- [React](https://reactjs.org/)
- [Bootstrap](https://getbootstrap.com/)
- **Plugins**
	- [moment.js](https://momentjs.com/)
	- [axios](https://github.com/axios/axios)
	- [React-Toastify](https://github.com/fkhadra/react-toastify)
	- [chart.js](https://www.chartjs.org/)

## License

[MIT License](https://github.com/Masterfoni/startup-booster-gitboard/blob/master/LICENSE)
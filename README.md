<p align="center">
  <a href="https://dikenang.netlify.app" target="_blank"><img src="https://i.imgur.com/irBDntm.png" width="600" alt="Dikenang Logo" /></a>
</p>
 <h4 align="center">Dikenang is a private social media that focused on sharing memories to the linked relationship partners</h4>
 <p align="center">(Early Development in Progress)</p>
<p align="center">
  <a href="https://github.com/resqiar/dikenang-server" target="_blank">
    <img src="https://img.shields.io/github/languages/top/resqiar/dikenang-server?style=for-the-badge" alt="dikenang - top language" />
  </a>
  <a href="https://github.com/resqiar/dikenang-server" target="_blank">
    <img src="https://img.shields.io/github/license/resqiar/dikenang-server?style=for-the-badge" alt="dikenang - license" />
  </a>
  <a href="https://github.com/resqiar/dikenang-server" target="_blank">
    <img src="https://img.shields.io/github/last-commit/resqiar/dikenang-server?style=for-the-badge" alt="dikenang - last commit" />
  </a>
  <a href="https://www.buymeacoffee.com/resqiar" target="_blank">
    <img src="https://img.shields.io/badge/-Buy%20Me%20a%20Coffee-yellow?style=for-the-badge" alt="donate - buymeacoffee" />
  </a>
</p>

## What is dikenang?

Dikenang is actually my private project with my girlfriend, moved to a public repository lately. Dikenang is a private social media to shares memories together with the user's linked partnership. Dikenang is like Facebook, Instagram, Quora, or whatever social media that exist, it should do its job to post a picture, video, conversation sound, story, etc, but with extra features that should protect its privacy and uniqueness. see [dikenang.netlify.app](https://dikenang.netlify.app) for experimental preview.

### How to preview (old/deprecated) dikenang webpage

This website is used as an **experimental** and **idea preview** purpose only. This website doesn't even use this repository. Dikweb's future works will replace the website.

1. Open `https://dikenang.netlify.app` on your browser
2. On the login section enter this credentials
    ```
    email: testing@example.com
    password: password
    ```
    > You could signup/register actually, but it needs to be verified before going to index page, which is never.
3. Enjoy the preview and make some Post.

## How is this Repo structured?

|     Codebase     |     Description     | Availability |
| :--------------: | :-----------------: | :----------: |
| [dikser](dikser) | NestJS API Back-end |      ✔️      |
| [dikweb](dikweb) |  NextJS Front-end  |      ✔️      |
| [dikmob](dikmob) | ReactNative Mobile  |      ❌      |

## Easy Running Using Docker

Easy installation without bothering .env file, installing a database, packages, etc, simply install docker and run the following commands; dikser will start on [localhost:3000](http://localhost:3000) and dikweb on [localhost:3001](http://localhost:3001)

_Prerequisites: installed docker & docker-compose in your system_

1. Make sure you are in the root folder, **if you are in packages directory**, run this following command:

```bash
# navigate back to root folder
$ cd ..
```

2. Start docker-compose

```bash
# start container process
$ docker-compose up
```

> If you want to run with your own config, see <a href="https://github.com/resqiar/dikenang/blob/main/docker-compose.yml">docker-compose.yml</a>

3. Application is now running

```bash
# server playground
$ xdg-open http://localhost:3000/graphql

# client web app
$ xdg-open http://localhost:3001
```

## How to run manually on each package?
Please refer to package documentations, navigate to `/dikser`, `/dikweb`, or `/dikmob` and check their own docs.

## Stay in touch

-   Author - [Resqiar](https://github.com/resqiar)
-   Website - [https://dikenang.netlify.app](https://dikenang.netlify.app)
-   Instagram - [@resqiar\_](https://instagram.com/resqiar_)

## License

Dikenang is [MIT licensed](LICENSE).

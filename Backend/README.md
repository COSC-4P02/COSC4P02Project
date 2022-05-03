# Chatbot Ai Backend

## Run by NPM

```bash
npm install
npm run serve
```

## Run Tests

```bash
npm run lint
npm run test
open http://localhost:3000/test
```

For development information, check out our documentation - [Development](https://docs.chatbot-ai.ga/use/dev.html)

---

## Directory Tree

```
└── Backend/
    ├── components/ # Server Components
    ├── data/       # Configs and Databases
    │               #  - https://docs.chatbot-ai.ga/dev/config.html
    ├── plugin/     # Plugins used by the Server
    │               #  - https://docs.chatbot-ai.ga/code/open-source.html
    ├── test/       # Unit Testing
    └── train-data/ # Training Data from Crawler
                    #  - https://docs.chatbot-ai.ga/dev/train-data.html
```

---

## Chatbot Api

For api information, check out our documentation - [Chatbot Api](https://docs.chatbot-ai.ga/api/chat.html)

---

## Deploy to Server

For deployment information, check out our documentation - [Deploy](https://docs.chatbot-ai.ga/use/deploy.html)

---

## Continuous Integration and Continuous Deployment

After commit into this repo, CircleCi will run unit testing automatically, and Github Workflow will build and push the Docker Image to Docker Hub, our server is always listening the update for the docker image, if the digest is changed for the latest version, server will automatically pull the image and rebuilt the container.

For CI/CD information, check out our documentation - [CI/CD](https://docs.chatbot-ai.ga/dev/CI-CD.html)

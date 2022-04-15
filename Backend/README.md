# Chatbot Ai Backend

### Run by NPM

```bash
npm install
npm run serve
```

### Run by Docker

> Build Docker

```bash
docker build . -t krunk/chatbot-ai-backend
```

> Build with Multiple Architectures

```bash
docker buildx create --name krunkbuilder
docker buildx ls
docker buildx use krunkbuilder
```

```bash
docker buildx build . -t krunk/chatbot-ai-backend --platform=linux/arm64,linux/amd64 --push
```

> Run Docker

```bash
docker pull krunk/chatbot-ai-backend
docker run -d --name chatbot-ai-backend -p 8001:8001 -p 3000:3000 -v $(pwd)/chatbot-ai-backend/data:/usr/src/app/data krunk/chatbot-ai-backend
```

### Run Tests

```bash
npm run lint
npm run test
open https://localhost:3000/test
```

## Directory Tree

```
└── Backend/
    ├── components  # Server Components
    ├── data        # Configs and Databases
    ├── plugin      # Plugins used by the Server
    ├── test        # Unit Testing
    └── train-data  # Training Data from Crawler
```

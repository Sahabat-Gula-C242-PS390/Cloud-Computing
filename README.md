<p align="center">
	<img width="500" alt="Sahabat Gula logo" src="assets/sahabat-gula.png">
</p>

# Sahabat Gula API

Sahabat Gula API is created for Sahabat Gula application for Capstone Project from Bangkit 2024.

This repository store the Sahabat Gula API code. The API handles most application features, such as registration, login, email verification, user customization, food prediction, nutrition tracking, articles, and much more! This API is powered by Hapi, and Bun while the infrastructure is powered by Google Cloud.

![bruno](assets/thumbnail-1.png) <br /><br />

## Status

This project is under development, but we will do our best to keep things stable.

## Usage

You can use our latest commercial API deployment in
[sahabat-gula-388071001917.asia-southeast2.run.app](https://sahabat-gula-388071001917.asia-southeast2.run.app).

## Install

### Prerequisites

Before running, make sure you have:

1. [Bun](https://bun.sh) installed.
2. Google Cloud Platform (GCP) project with Firestore enabled.
3. GCP Service Account key file.

You need to also create an environmnet by exporting or creating an `.env` file with the following variables:

```env
GCP_PROJECT_ID="your-project-id"
GCP_SA_KEY="path/to/your/service-account-key.json"
PREDICT_URL="https://url-to-your-predict-app"
```

### Running Directly

You need to install all the dependencies first:

```bash
bun install
```

To start the API, you can run

```bash
bun start
```

While that is usually sufficient, you can also bundle the code to reduce startup and improve running performance by doing:

```bash
bun run build && bun run start:prod
```

### Web Server Setup

We also provide an automatic web server setup using a shell script. This can be used if you want to host the code on an HTTP port. To start the automated setup, run the script:

```bash
./setup.sh
```

### Docker

You can also run an API in Docker container. We provide a `Dockerfile` to automatically install the necessary libraries. Make sure to run the code on the root of Git project.

```bash
docker build -t sahabat-gula .
```

Then, run the newly created Docker container. Because the Docker do not copy the `.env`, you need to give the environment using `-e`.

```bash
docker run -p 3000:3000 \
  -e "GCP_PROJECT_ID=your-project-id" \
  -e "GCP_SA_KEY_BASE64=$(base64 sa-key.json)" \
  -e "PREDICT_URL=https://url-to-your-predict-app" \
  sahabat-gula
```

## Test

The code is tested using Bun native test library. To run the test, you can do:

```
bun test
```

More test will be created later on.

## Contribution

You can contribute to this project by forking the repository then do a pull request.

pipeline {
    agent any

    environment {
        IMAGE_NAME    = 'bakai'
        CONTAINER_NAME = 'bakai'
        // Port nur intern – Traefik routet nach außen
        INTERNAL_PORT = '80'
        NETWORK       = 'traefik-net'
    }

    stages {

        stage('Checkout') {
            steps {
                // Jenkins checkt automatisch den konfigurierten GitHub-Repo aus
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build \
                        -t ${IMAGE_NAME}:${BUILD_NUMBER} \
                        -t ${IMAGE_NAME}:latest \
                        -f Dockerfile .
                """
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm   ${CONTAINER_NAME} || true
                """
            }
        }

        stage('Deploy New Container') {
            steps {
                sh """
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --network ${NETWORK} \
                        --restart unless-stopped \
                        --label "traefik.enable=true" \
                        --label "traefik.http.routers.angular.rule=Host(\`app.b3-home.space\`)" \
                        --label "traefik.http.routers.angular.entrypoints=websecure" \
                        --label "traefik.http.routers.angular.tls=true" \
                        --label "traefik.http.services.angular.loadbalancer.server.port=${INTERNAL_PORT}" \
                        ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Cleanup Old Images') {
            steps {
                sh "docker image prune -f --filter label=image=${IMAGE_NAME}"
            }
        }
    }

    post {
        success { echo "✅ Angular App erfolgreich deployed!" }
        failure { echo "❌ Build fehlgeschlagen – bitte Logs prüfen." }
    }
}

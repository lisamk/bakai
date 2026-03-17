pipeline {
    agent any

    environment {
        IMAGE_NAME     = 'angular-app'
        CONTAINER_NAME = 'angular-app'
        NETWORK        = 'traefik-net'
    }

    stages {

        stage('Checkout') {
            steps {
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

        stage('Deploy') {
            steps {
                sh """
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --network ${NETWORK} \
                        --restart unless-stopped \
                        --label "traefik.enable=true" \
                        --label "traefik.http.routers.angular.rule=Host(\`bakai.b3-home.space\`)" \
                        --label "traefik.http.routers.angular.entrypoints=websecure" \
                        --label "traefik.http.routers.angular.tls=true" \
                        --label "traefik.http.services.angular.loadbalancer.server.port=80" \
                        ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Cleanup') {
            steps {
                sh "docker image prune -f"
            }
        }
    }

    post {
        success { echo "✅ Angular App deployed auf bakai.b3-home.space" }
        failure { echo "❌ Build fehlgeschlagen – bitte Logs prüfen." }
    }
}

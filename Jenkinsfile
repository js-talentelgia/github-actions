pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS= credentials('jagseersingh')     
        DOCKER_IMAGE_NAME = 'jagseersingh/food-delivery-app:latest'
        SERVER_REMOTE_HOST = '3.144.240.118'
        SERVER_REMOTE_USER = 'ubuntu'
        SSH_KEY = credentials('food-delivery-app')
    }  
    stages {
        stage('Build the docker image') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE_NAME} .'
            }
        }
        stage('Login to Docker Hub') {         
            steps{                            
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'                 
                echo 'Login Completed'                
            }           
        }
        stage('Push Image to Docker Hub') {         
            steps{                            
                sh 'docker push ${DOCKER_IMAGE_NAME}'                 
                echo 'Push Image Completed'       
            }           
        }
        stage('Build app') {
            steps {
                script {
                    sh '''#!/bin/bash
                    ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" $SERVER_REMOTE_USER@$SERVER_REMOTE_HOST "\
                    if [ ! -d "food-delivery" ]; then
                            # Clone the repository if it doesn't exist
                            git clone https://github.com/js-talentelgia/food-delivery.git
                    else
                        # Pull the latest changes if the repository already exists
                        cd food-delivery && git pull origin main && docker compose down && docker compose up -d
                    fi"
                    '''
                }
            }
        }
    }
    post{
        // only triggered when blue or green sign
        success {
            slackSend color: 'good', message: "Build SUCCESS: ${currentBuild.fullDisplayName} [${env.BUILD_NUMBER}] (<${env.BUILD_URL}|Open>)"
        }
        // triggered when red sign
        failure {
            slackSend color: 'danger', message: "Build FAILURE: ${currentBuild.fullDisplayName} [${env.BUILD_NUMBER}] (<${env.BUILD_URL}|Open>)"
        }
        // trigger every-works
        always {
            sh 'docker logout'
        }      
    } 
}

pipeline {
    agent any

    environment {
        REGISTRY = "vrajnandak"
        IMAGE_NAME = "vrajnandak/cinesense-frontend-image"
        TAG = "latest"
	DOCKERHUB_CREDENTIALS = "dockerhub-cinesense"
	ANSIBLE_VENV="/var/lib/jenkins/.ansible-venv"
	KUBECONFIG_PATH="/var/lib/jenkins/.kube/config"
    }

    stages {

	stage('Check Tools') {
	    steps {
	        echo 'Checking Docker version...'
		sh '''
		    docker --version
		'''
	    }
	}


        stage('Install + Test + Build (inside Node container)') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '-u root:root'   // ensures permissions
                }
            }
            steps {
                sh 'npm install'
                sh 'npm run type-check || true'
                sh 'npm test || true'
                sh 'npm run build'
            }
        }
        stage('Docker Build') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME}:${TAG} ."
                }
            }
        }

        stage('Docker Push') {
            steps {
 		script {
		    docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS) {
		        sh "docker push $IMAGE_NAME:$TAG"
		    }
		}
            }
        }

	stage('Setup Ansible') {
	    steps {
		echo "Setting up Python virtual environment for Ansible..."
		sh '''
		    python3 -m venv ${ANSIBLE_VENV}
		    . ${ANSIBLE_VENV}/bin/activate
                    pip install --upgrade pip
                    pip install ansible kubernetes openshift
                    ansible-galaxy collection install community.kubernetes
		'''
	    }
	}

	stage('Deploy via Ansible') {
	    steps {
		withCredentials([string(credentialsId: 'ansible-frontendvault-pass', variable: 'VAULT_PASS')]) {
		    script {
			echo "Deploying frontend via Ansible..."
			
			// Write vault password to a temp file and use it
			sh '''
				set -e
				echo "Activating Ansible virtualenv..."
				. ${ANSIBLE_VENV}/bin/activate

				which ansible
				which ansible-playbook
				ansible --version

				VAULT_FILE=$(mktemp)
				echo "$VAULT_PASS" > $VAULT_FILE

				ansible-playbook \
				  -i ansible/inventory.ini \
				  ansible/site.yml \
				  --vault-password-file $VAULT_FILE

				rm -f $VAULT_FILE
			'''
		    }
		}
	    }
	}

    }

    post {
        success {
            echo "Pipeline completed: ${IMAGE_NAME}:${TAG}"
        }
        failure {
            echo 'Pipeline failed'
        }
    }
}


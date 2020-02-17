on: 
  push:
    branches:
      - dev

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Setting up SSH
      uses: appleboy/ssh-action@master
      env:
        USERNAME: ${{ secrets.USERNAME }}
        PASSWORD: ${{ secrets.PASSWORD }}
        HOST: ${{ secrets.HOST }}
        SCRIPT: ~/deploy-to-test-server.sh

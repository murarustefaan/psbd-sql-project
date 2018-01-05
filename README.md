# College project for Database Systems and Design

## Requirements:
- Python 2.7
- Microsoft Visual Studio 2013 (It will install the 2013 C++ redistributables and the C++ compiler)
- If you want to create a Oracle database instance in Docker container, you will also need to install Docker@latest.

## Installation instructions:
Depending on where the database is located (local or remote), it will be necessary to install Oracle Instant Client to be able to connect to it.

- Install Python 2.7 (and make sure it is added to Path)
- Install Visual Studio 2013 (Community Edition)
- Run the following commands in the folder where the project is cloned:

  `npm install instantclient`

  `set PATH=%cd%\instantclient;%PATH%`

  `npm install`

Also, the server gets the username, password and connection string for the database from environment variables, so be sure to have the following set:

  `PSBD_ORA_USER`, `PSBD_ORA_PASS`, `PSBD_ORA_CONN_STRING`
  
  and for the server to start on localhost,

  `PSBD_SERVER_PORT`.

If the install succeeds but the application fails silently, make sure that you have the Oracle Instant Client location set in PATH. Also, make sure that the Visual Studio 2013 installation is included in PATH.

The oracledb package *WILL NOT WORK* with NodeJS 9!

## Creating a Oracle Docker Container
Get the latest Docker images from the official Oracle repository:
`https://github.com/oracle/docker-images/tree/master/OracleDatabase`

Follow the steps:
- Extract the OracleDatabase downloaded image files to {image_files} directory
- Download from the oracle software center a zip file containing Oracle Database 12c Release 2 for Linux and save it in the {image_files} folder.
- Build the docker image using
  `docker build --force-rm=true --no-cache=true --shm-size=2g -t oracle12.2 -f Dockerfile.se2 .`
  This will build the docker file for Oracle Standard Edition 2 into a image with name oracle12.2. Be patient as the build will take a while, aprox. 15m.
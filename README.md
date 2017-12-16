#College project for Database Systems and Design

Requirements:
- Python 2.7
- Microsoft Visual Studio 2013 (It will install the 2013 C++ redistributables and the C++ compiler)

Installation instructions:
Obs. Depending on where the database is located (local or remote), it will be necessary to install Oracle Instant Client to be able to connect to it.

- Install Python 2.7 (and make sure it is added to Path)
- Install Visual Studio 2013 (Community Edition)
- Run the following commands in the folder where the project is cloned:
  `npm install -g --production windows-build-tools`
  `npm install instantclient`
  `set PATH=%cd%\instantclient;%PATH%`
  `set OCI_LIB_DIR=%cd%\instantclient\sdk\lib\msvc`
  `set OCI_INC_DIR=%cd%\instantclient\sdk\include`
  `npm install` (The previous steps are required to make sure the Oracle driver's installation succeeds)

If the build fails with a error that contains `Could not find include file "stddef.h"`, you need to set the npm Visual Studio version by running
  `npm config -g set msvs_version 2013`. Also, make sure that the Visual Studio 2013 installation is included in PATH.

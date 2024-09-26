# Numdev Project

![NumDev Logo](./ressources/images/P5_banner-numdev.png)

## Overview

The goal of this project is to complete the testing phase for a yoga studio application called NumDev. Becoming responsible for finishing the testing process, encompassing Front-End, Back-End, and end-to-end functionalities. Thorough testing is essential to ensure a minimum code coverage of 80%, with at least 30% originating from integration tests. Once accomplished, the project requires submission of coverage reports and code on GitHub, alongside a README outlining how to launch the application. Preparation for a presentation to the manager is also expected.

## Table of contents

- [Numdev Project](#numdev-project)
  - [Overview](#overview)
  - [Table of contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Configuration](#configuration)
  - [Installation procedure](#installation-procedure)
    - [Front-End](#front-end)
    - [Back-End](#back-end)
  - [Code coverage reports](#code-coverage-reports)
    - [Front-End](#front-end-1)
    - [Back-End](#back-end-1)
  - [Miscellaneous](#miscellaneous)

## Prerequisites

Before you begin, ensure that the following software is installed on your system:

- **Java Development Kit (JDK):** Follow the instructions below to install the JDK

- **Apache Maven:** Install [Maven](https://maven.apache.org/) for building and managing the project's dependencies.

- **MySQL:** Install and set up MySQL as the database for the NumDev Back-End. You can follow the installation steps [here](https://openclassrooms.com/fr/courses/6971126-implementez-vos-bases-de-donnees-relationnelles-avec-sql/7152681-installez-le-sgbd-mysql).

- **Node.js:** Install [Node.js LTS](https://nodejs.org/en) to install the Front-End dependencies

## Configuration

1. **Java Development Kit (JDK):** Install Java version 8 (JavaSE-1.8) by downloading it from the official [Oracle website](https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html). You will need to create an Oracle account to access older versions like Java 8.

After installing, make sure that the `JAVA_HOME` environment variable is set correctly on your system, and the `java` command is available in your terminal. You can verify your installation by running:

```bash
java -version


2. **MySQL Database:**

Follow these steps to configure MySQL Workbench for your Java application:

1. Open MySQL Workbench.

2. Connect to your MySQL Server instance.

3. Instead of manually creating the database and tables, you can import the pre-configured SQL script provided in the project. The script is located at `ressources/sql/script.sql`.

To import the script:
- Go to **File** > **Run SQL Script** in MySQL Workbench.
- Select the file `script.sql` from the path `ressources/sql/script.sql`.
- Click **Start** to execute the script, which will create the database, tables, and insert initial data.

This script will:
- Create the `yoga` database.
- Add the required tables (`TEACHERS`, `SESSIONS`, `USERS`, `PARTICIPATE`).
- Populate the tables with initial data, including teacher and user records.

Alternatively, you can run the following command in the terminal:

```bash
mysql -u root -p yoga < C:/path-to-your-project/ressources/sql/script.sql
Replace C:/path-to-your-project with the correct path to the project folder on your machine.
```

## Installation procedure

**Cloning the project:**
To clone this repository from GitHub, run the following command: `git clone https://github.com/nolloV/Cengiz`.

### Front-End

1. Install the dependencies:

To start the Angular Front-End project, follow these steps:

- Navigate to the Front-End directory in your terminal:

```shell
cd front
```

- Install project dependencies using npm:

```shell
npm install
```

2. Starting the server

- After the dependencies are installed, you can start the development server by running:

```shell
npm run start
```

This command will compile the Angular application and start a development server.
You can then access the application in your browser at `http://localhost:4200`.

### Back-End

1. Configure the application in the `application.properties` file

Once you have cloned the repository, you'll need to add the `application.properties` file on the `src/main/resources/` folder containing these properties:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/yoga?allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password="your password"

spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5InnoDBDialect
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
spring.jpa.show-sql=true
oc.app.jwtSecret=openclassrooms
oc.app.jwtExpirationMs=86400000
```

2. Install the project dependencies using the following command: `mvn clean install`

3. Run the application using your IDE or by running `mvn spring-boot:run` in the project directory.

4. To generate the code coverage of the back-end, run the following command: `mvn clean test`

## Code coverage reports

### Front-End

Get Test Code Coverage for Front-End (Angular):

- To run test and get code coverage for the Angular Front-End, you can use the Jest command:

```shell
jest -t --coverage
```

- To get the Cypress E2E tests coverage, use the following command:

```shell
npm run e2e:coverage
```

Upon completion, the terminal displays the tests outcome (pass/fail), accompanied by a comprehensive table showing the code coverage %

### Back-End

Get Test Code Coverage for Back-End (Spring Boot):

- Run the following command in the terminal to execute tests and generate a coverage report using JaCoCo for the Spring Boot backend:

```shell
mvn clean test
```

Following successful execution, locate and open in your browser the `index.html` file for the coverage report under the `target/site/jacoco` directory in the project.

## Miscellaneous

<details>
  <summary>
📚 API documentation
  </summary>
  <table>
  <thead>
    <tr>
       <th>Endpoint</th>
       <th>Method</th>
       <th>Description</th>
    </tr>
  </thead>
  <tbody>
  <tr>
        <td>/api/auth/login</td>
        <td>POST</td>
        <td>User authentication</td>
    </tr>
    <tr>
        <td>/api/auth/register</td>
        <td>POST</td>
        <td>User registration</td>
    </tr>
    <tr>
        <td>/api/session</td>
        <td>GET</td>
        <td>Retrieve all sessions</td>
    </tr>
    <tr>
        <td>/api/session</td>
        <td>POST</td>
        <td>Create a new session</td>
    </tr>
    <tr>
        <td>/api/session/{id}</td>
        <td>DELETE</td>
        <td>Delete a session by ID</td>
    </tr>
    <tr>
        <td>/api/session/{id}</td>
        <td>GET</td>
        <td>Retrieve a session by ID</td>
    </tr>
    <tr>
        <td>/api/session/{id}</td>
        <td>PUT</td>
        <td>Update a session by ID</td>
    </tr>
    <tr>
        <td>/api/session/{id}/participate/{userId}</td>
        <td>DELETE</td>
        <td>Remove user participation</td>
    </tr>
    <tr>
        <td>/api/session/{id}/participate/{userId}</td>
        <td>POST</td>
        <td>Add user participation</td>
    </tr>
    <tr>
        <td>/api/teacher</td>
        <td>GET</td>
        <td>Retrieve all teachers</td>
    </tr>
    <tr>
        <td>/api/teacher/{id}</td>
        <td>GET</td>
        <td>Retrieve a teacher by ID</td>
    </tr>
    <tr>
        <td>/api/user/{id}</td>
        <td>DELETE</td>
        <td>Delete a user by ID</td>
    </tr>
    <tr>
        <td>/api/user/{id}</td>
        <td>GET</td>
        <td>Retrieve a user by ID</td>
    </tr>
  </tbody>
</table>
</details>

<details>
  <summary>🔗 Link to the original Repository</summary>
  <a href="https://github.com/OpenClassrooms-Student-Center/Testez-une-application-full-stack">
    Link to the original code
  </a>
</details>
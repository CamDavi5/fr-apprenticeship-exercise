Written by Cameron Davis, 5/22/2022

Install Requirements: (Written for Windows 10)
VS Code: https://code.visualstudio.com/ 
NodeJS: https://nodejs.org/en/download/ [Recommend the LTS (stable) version]
MySQL: https://dev.mysql.com/downloads/windows/installer/5.7.html 
MySQL Workbench: https://dev.mysql.com/downloads/windows/installer/8.0.html 

Project Summary:
The core of this assignment should account for the three requirements listed in the coding exercise: add transactions for a specific payer and date, spend points using the rules above and return a list of { "payer": , "points": } for each call, and return all payer point balances. With error testing it spends the oldest points first and prevents the payer's points from going negative.

The code was written using a boilerplate of ReactJS, ExpressJS, and other modules such as webpack and babel. This was provided by my Innovate Birmingham instructors Josh Hurn, Garrett Harris, and Haylee Hunter. The files of note that were written for this assignment are in the following folders:
- client
    - App.jsx
- server
    - server.js
    - db
        - fetch.js
        - index.js
    - routes
        - fetch.js
        - index.js

Full Installation Guide:

MySQL Setup:

1) Install MySQL along with the default settings and extensions.
    a) Please make note of the root username and password as this will be used later. Ensure that the connection port will also be set to 3306 or you will have to manually change it in VS Code.
    b) The MySQL install should include a compatible version of MySQL Workbench. If MySQL Workbench does not open after you have finished installation, use the above link and download it manually.
2) In MySQL Workbench, click on your instance, probably named “Local instance MySQL57”, and then login with the root user information.
3) Find the cylinder stack icon labeled “create a new schema in the selected server.” For this assignment, name it “fetchuser.” Click Apply, and then click Apply again.
4) Click on the File tab and select “Open SQL Script…” and choose the “FetchExerciseSetup” file. You can find the file in the "mysql-scripts" folder inside "fetch-apprencticeship."
5) Click the leftmost lightning bolt icon to execute the SQL script and set up the table as well as the default values.

Visual Studio Code Setup:

6) Install Visual Studio Code along with the default settings and extensions.

NodeJS Setup:

7) Install NodeJS along with the default settings and extensions.

Running The Program:

8) Open up the Command Prompt window and navigate to the “fetch-apprenticeship” folder.
    a) Ex) cd <directory path/fetch-apprenticeship>
9) Type “npm i” in the command window and press Enter. All of the necessary modules for the assignment should be downloaded to the “fetch-apprenticeship” folder.
10) Open Visual Studio Code and select the File tab, then “Open Folder.” Select the folder named “fetch-apprenticeship.”
11) In the file explorer go to server -> db -> index.js. There you will see a connection variable with an object of MySQL parameters. You will need to change the user and password values to the same username and password you created during the MySQL setup. You must also change the port and database values if you decided to customize these. Save the file using the File tab or CTRL+S.
    a) NOTE: While using the root user is fine for this assignment, in large-scale applications this would be a large security vulnerability. Do not use the root user for applications you wish to make widely accessible and instead create other user profiles with restrictions.
12) Go back to the Command Prompt window and type in “npm run dev” and press Enter.
13) It is likely that the program will result in an error that relates to importing React. This is intended and is our way of letting babel recognize the syntax we are using. Press CTRL+C to prompt the program to stop, then press Y.
14) Type “npm run dev” once again into the command window and press enter. This time the program should succeed in running and should end with “Server listening on port: 3000.”
15) Choose a web browser (Chrome recommended) and then navigate to “localhost:3000” in the URL bar.
16) If a web page is loaded that has “Cameron Davis's Fetch Coding Exercise” at the top, congratulations, the code should be working as intended and you can play around with the various options!

Additional Steps:

17) When you make payments or new transactions they will reflect in the MySQL database. You can easily see this by using the left navigator and navigating through the dropdowns: fetchuser -> TABLES -> camdavis. Then click the rightmost icon next to “camdavis” - this should have a table pop-up.
18) If you wish to return the program to default you will need to manually remove the rows. In the table pop-up, click on the row you want to remove and then click the icon labeled “delete selected rows.” You can drag your mouse to select multiple rows. Once you have returned to the original five entries (id 1-5), click Apply at the bottom, and then click Apply again.

Retrospective:

While I learned a lot in my Full-Stack certification cohort, back-end development was something we lightly touched on. Needless to say this was a bit more difficult than I was expecting. I do believe I have created a working product that meets the exercise’s requirements. I did a good bit of error handling as well for the input fields that would prevent any actual errors that could crash the code or result in a bad response from MySQL. Code was commented to the best of my ability so hopefully the code is readable. The weakest aspect of the project was the front-end design of the webpage, though that was not necessarily a requirement.

GitHub Repository: https://github.com/CamDavi5/fr-apprenticeship-exercise
**If you use this code please use it for educational purposes only. I do not endorse copying this code for the Fetch Coding Exercise, and if you are using it as a reference I HIGHLY recommend you read through the documentation and code comments to properly understand the logic.**

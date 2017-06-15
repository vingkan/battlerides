# battlerides
Overview:
Chatbot GvG game called ‘Battle Rides’.
In ‘Battle Rides’ users play as Uber Drivers competing to complete the most trips and make the most cash. Drivers are split into two teams and can sabotage enemy trips to gain more points. The team with the most points at the end of the game wins!
 
 
Rules:
Players have to submit commands to chatbot within turn time frame.
Each player has control over one driver.
First driver to reach rider automatically picks up that rider.
If user does not submit command, driver does not move.
Riders are automatically dropped off the first time they reach their destination.
Drivers can only move one unit each turn.
Drivers can sacrifice their next turn to cause a traffic disruption.
Multiple Riders can spawn on same location.
Multiple Drivers can occupy  same location
 
Game Logic:
 
Initialize:
The graph representation of the map is presented to everyone.
Players can see the initial location of themselves and teammates only.
Rules, valid commands and descriptions are sent to the players.
Players have a set time to prepare for the first turn to start. InitTime
Players have a set time to enter commands before each turn. TurnTime
Each Rounds has a 5 minute timer. RoundTime
 
 
On each turn:
The Game can:
Spawn a new rider at a random location.
Drivers can:
Move one unit length in a valid direction.
Sacrifice their next turn to cause a traffic disruption 1 unit length in all adjacent roads.

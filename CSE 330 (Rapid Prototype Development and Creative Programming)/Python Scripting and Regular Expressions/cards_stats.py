import sys, os, re

#player class with name, hits, and at bats
class Player:
	def __init__(self, name, hits, atBats):
		self.name = name
		self.hits = hits
		self.atBats = atBats
		self.battingAverage = 0

	# return 'player: battingAverage'
	def format_player(self):
		return self.name +  ": " + "%.3f" % self.battingAverage

regex = re.compile(r"^([^= ]\S+\s\S+).{8}(\d).{12}(\d)", re.M)

#make sure input filename is passed as command line argument
if len(sys.argv) < 2:
	sys.exit("Usage: %s filename" % sys.argv[0])

filename = sys.argv[1]

if not os.path.exists(filename):
	sys.exit("Error: File '%s' not found" % sys.argv[1])

#full file text is in file_contents
file_contents = ""
with open(filename) as f:
    file_contents = f.read()

# list of tuples (name, atBats, hits) from each game
player_stats = regex.findall(file_contents)

# contains player names as key and Player object as value
player_dict = {}

for tup in player_stats:
	#check that player is not already in dict
	if tup[0] not in player_dict:
		new_player = Player(tup[0], float(tup[2]), float(tup[1]))
		player_dict[tup[0]] = new_player
	else:
		old_player = player_dict[tup[0]]
		old_player.atBats += float(tup[1])
		old_player.hits += float(tup[2])

# has all player objects
player_list = player_dict.values()
for player in player_list:
	batting_average_unrounded = player.hits / player.atBats
	player.battingAverage = round(batting_average_unrounded, 3)

sorted_players = sorted(player_list, key=lambda player: player.battingAverage, reverse=True)
for player in sorted_players:
	print player.format_player()


#test stuff

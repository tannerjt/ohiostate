import urllib, urllib2, sqlite3
from bs4 import BeautifulSoup

conn = sqlite3.connect('./data/roster.db')
c = conn.cursor()

# Get all players
c.execute('SELECT num, link FROM players')

# Function to retrieve image and update db
def getImage(idx, player):
	response = urllib2.urlopen(str(player[1]))
	content = response.read()
	soup = BeautifulSoup(content)
	player_image = soup.find('img', {'id' : 'player-photo'})
	image_src = player_image.get('src')
	new_src = "./img/" + str(idx) + ".jpeg"
	urllib.urlretrieve(image_src, new_src)
	c.execute('UPDATE players SET img = "{}" WHERE num = "{}"'.format(new_src, player[0]))

for idx, player in enumerate(c.fetchall()):
	getImage(idx, player)

conn.commit()
conn.close()
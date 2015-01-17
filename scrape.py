import urllib, urllib2, sqlite3
from bs4 import BeautifulSoup
import json

baseUrl = "http://www.ohiostatebuckeyes.com"

def geocodeHometown(playerNum, hometown):
	address = urllib.quote_plus(hometown)
	url="https://maps.googleapis.com/maps/api/geocode/json?address=%s" % address
	geocode_response = urllib2.urlopen(url)
	jsongeocode = geocode_response.read()
	d_json = json.loads(jsongeocode)
	lat = d_json['results'][0]['geometry']['location']['lat']
	lng = d_json['results'][0]['geometry']['location']['lng']
	print(lat, lng)
	c.execute('UPDATE players set lat = "{}",lng = "{}"  WHERE num = "{}"'.format(lat, lng, playerNum))

def updateDB(index, field, playerNum):
	if index == 0:
		c.execute("INSERT INTO players (num) values ('" + field.getText() + "');")
	elif index == 2:
		link = baseUrl + field.find('a').attrs['href']
		playerName = field.getText()
		statement = 'UPDATE players SET name = "{}", link = "{}" WHERE num="{}"'.format(playerName, link, playerNum)
		c.execute(statement)
	elif index == 3:
		c.execute('UPDATE players set pos = "{}" WHERE num = "{}"'.format(field.getText(), playerNum))
	elif index == 5:
		c.execute('UPDATE players set ht = "{}" WHERE num = "{}"'.format(field.getText(), playerNum))
	elif index == 6:
		c.execute('UPDATE players set wt = "{}" WHERE num = "{}"'.format(field.getText(), playerNum))
	elif index == 8:
		c.execute('UPDATE players set yr = "{}" WHERE num = "{}"'.format(field.getText(), playerNum))
	elif index == 9:
		c.execute('UPDATE players set hometown = "{}" WHERE num = "{}"'.format(field.getText(), playerNum))
		geocodeHometown(playerNum, field.getText())
	else:
		return

# Connect to database
conn = sqlite3.connect('./data/roster.db')

# Create table (if it doesnt exist)
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS players 
	(num, name, link, pos, ht, wt, yr, hometown, lat, lng)''')

# Get html from roster home
response = urllib2.urlopen(baseUrl + "/sports/m-footbl/mtt/osu-m-footbl-mtt.html")
content = response.read()
soup = BeautifulSoup(content)

# Get roster list
roster_table = soup.find("table", {"id" : "sortable_roster"})
roster_players = roster_table.findChildren('tr')[1:]

# Loop through list
for row in roster_players:
	fields = row.findChildren('td')
	num = fields[0].getText()
	for i, field in enumerate(fields):
		updateDB(i, field, num)

# Close connection
conn.commit()
conn.close()

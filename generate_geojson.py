import sqlite3, json, copy

# GeoJSON Template
feature_class = {
	"type" : "FeatureCollection",
	"features" : []
}
feature = {
	"type" : "Feature",
	"geometry" : {
		"type" : "Point",
		"coordinates" : []
	},
	"properties" : {

	}
}

# connect to database
conn = sqlite3.connect("./data/roster.db")
c = conn.cursor()

# query fields
c.execute("PRAGMA table_info(players)")
fields = [f[1] for f in c.fetchall()]

# query and iterate all players
def updateGeoJson(player):
	f_copy = copy.deepcopy(feature)
	# insert geometry
	f_copy['geometry']['coordinates'].append(float(player[fields.index('lng')]))
	f_copy['geometry']['coordinates'].append(float(player[fields.index('lat')]))
	# insert properties
	for f in fields:
		f_copy['properties'][str(f)] = str(player[fields.index(str(f))])
	feature_class['features'].append(f_copy)

c.execute("SELECT * FROM players")
for player in c.fetchall():
	updateGeoJson(player)

# Create geojson file
geojson_f = open("./data/players.geojson", 'w')
geojson_f.write(json.dumps(feature_class))
geojson_f.close()

# close connection
conn.close()



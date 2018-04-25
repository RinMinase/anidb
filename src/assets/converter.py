import csv, json, datetime

my_data = []
num_rows = 0

with open("test.csv") as csv_file:
	reader = csv.reader(csv_file)
	for row in reader:

		durationHr = int(row[16]) * 3600
		durationMin = int(row[17]) * 60
		durationSec = int(row[18])
		duration = int(durationHr + durationMin + durationSec)

		if row[13] != "0000-00-00":
			u_date = int(datetime.datetime.strptime(row[13], '%Y-%m-%d').strftime("%s"))
		else:
			u_date = ""

		if row:
			my_data.append({
				"watchStatus": int(row[1]),
				"quality": row[2],
				"title": row[3],
				"episodes": int(row[4]),
				"ovas": int(row[5]),
				"specials": int(row[6]),
				"filesize": int(row[7]),
				"seasonNumber": int(row[8]),
				"firstSeasonTitle": row[9],
				"prequel": row[10],
				"sequel": row[11],
				"offquel": row[12],
				"dateFinished": u_date,
				"releaseSeason": row[14],
				"releaseYear": row[15],
				"duration": duration,
				"encoder": row[19],
				"variants": row[20],
				"remarks": row[21],
				"inhdd": int(row[22]),
				"rating": {
					"audio": int(row[23]),
					"enjoyment": int(row[24]),
					"graphics": int(row[25]),
					"plot": int(row[26])
				}
			})

			num_rows += 1

with open("out.json", "w") as out_file:
	json.dump(my_data, out_file, indent=2)

	print("Finished converting")
	print("Rows: " + str(num_rows)) #should be 306

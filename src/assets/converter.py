import csv, json, datetime

my_data = []
num_rows = 0

with open("test.csv") as csv_file:
	reader = csv.reader(csv_file)
	for row in reader:

		if row[2] == "":
			dl_prio = -1
		else:
			dl_prio = int(row[2])

		if int(row[1]) != 0:

			if row:
				my_data.append({
					"watchStatus": int(row[1]),
					"downloadPriority": dl_prio,
					"title": row[4],
					"releaseSeason": row[15],
					"releaseYear": row[16],
					"remarks": row[22],
					"inhdd": int(row[23])
				})

		else:

			durationHr = int(row[17]) * 3600
			durationMin = int(row[18]) * 60
			durationSec = int(row[19])
			duration = int(durationHr + durationMin + durationSec)

			if row[14] != "0000-00-00":
				u_date = int(datetime.datetime.strptime(row[14], '%m/%d/%Y').strftime("%s"))
			else:
				u_date = ""

			if row:
				my_data.append({
					"watchStatus": int(row[1]),
					"downloadPriority": dl_prio,
					"quality": row[3],
					"title": row[4],
					"episodes": int(row[5]),
					"ovas": int(row[6]),
					"specials": int(row[7]),
					"filesize": int(row[8]),
					"seasonNumber": int(row[9]),
					"firstSeasonTitle": row[10],
					"prequel": row[11],
					"sequel": row[12],
					"offquel": row[13],
					"dateFinished": u_date,
					"releaseSeason": row[15],
					"releaseYear": row[16],
					"duration": duration,
					"encoder": row[20],
					"variants": row[21],
					"remarks": row[22],
					"inhdd": int(row[23]),
					"rating": {
						"audio": int(row[24]),
						"enjoyment": int(row[25]),
						"graphics": int(row[26]),
						"plot": int(row[27])
					}
				})

		num_rows += 1

with open("out.json", "w") as out_file:
	json.dump(my_data, out_file, indent=2)

	print("Finished converting")
	print("Rows: " + str(num_rows)) #should be 757

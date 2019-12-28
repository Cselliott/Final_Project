#
# Change to the Final_Project\wordcount_forecasting folder
# Execute the command:  spark-submit wordcount.py
#

from __future__ import print_function

from pyspark.sql import SparkSession
from operator import add
import sys
import os
import csv

sys.stdout.reconfigure(encoding='utf-8')

# for root, dirs, files in os.walk("../cleaned/"):
#     for input_file in files:
#         file = input_file.split("meeting")
#         timestamp = file[0].split("FOMC")
#         print(timestamp[1])
# exit()


if __name__ == "__main__":

    # with open("results/pyspark.csv", encoding='utf-8', mode='w') as outfile:
    #     mywriter = csv.writer(
    #         outfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

    #     mywriter.write(["timestamp", "keyword", "count"])

    spark = SparkSession\
        .builder\
        .appName("PythonWordCount")\
        .getOrCreate()

    myFile = open('wordcount.csv', 'w')
    with myFile:
        myFields = ["timestamp", "keyword", "count"]
        writer = csv.DictWriter(myFile, fieldnames=myFields)
        writer.writeheader()

        for root, dirs, files in os.walk("../cleaned/"):
            for input_file in files:
                file = input_file.split("meeting")
                timestamp = file[0].split("FOMC")
                print(timestamp[1])

                # exit()

                # print("cleaned/" + input_file)

                lines = spark.read.option('encoding', 'utf-8').text(
                    "../cleaned/" + input_file).rdd.map(lambda r: r[0])

                counts = lines.flatMap(lambda x: x.split(' ')) \
                    .map(lambda x: (x, 1)) \
                    .reduceByKey(add)

                output = counts.collect()

                keyWords = ["recession", "unemployment",
                            "inflation", "interest"]

                print("\n")
                print("**********************")

                for (word, count) in sorted(output):
                    if word in keyWords:
                        #print("%s: %i" % (word, count))
                        writer.writerow(
                            {'timestamp': timestamp[1], 'keyword': word, 'count': count})

                print("**********************\n")

                # exit()

    spark.stop()

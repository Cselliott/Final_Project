# import necessary libraries
from flask import Flask, render_template

# create instance of Flask app
app = Flask(__name__)


# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/webscrapping")
def webscrapping():
    return render_template("01_web_scraping.html")


@app.route("/wordcount")
def wordcount():
    return render_template("wordcount.html")


@app.route("/sentiment")
def sentiment():
    return render_template("Tweepy Sentiment Analysis on Keyword.html")


@app.route("/bigram")
def bigram():
    return render_template("Twitter Analysis with Bigram and Wordcloud.html")

@app.route("/forecasting")
def forecasting():
    return render_template("forecasting.html")


if __name__ == "__main__":
    app.run(debug=True)

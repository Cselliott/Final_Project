# import necessary libraries
from flask import Flask, render_template

# create instance of Flask app
app = Flask(__name__)


# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/webscraping")
def webscraping():
    return render_template("01_web_scraping.html")


@app.route("/webscraping_code")
def webscraping_code():
    return render_template("webscraping_code.html")


@app.route("/wordcount")
def wordcount():
    return render_template("wordcount.html")


@app.route("/wordcount_code")
def wordcount_code():
    return render_template("wordcount_code.html")


@app.route("/tokenization_code")
def tokenization_code():
    return render_template("tokenization_code.html")


@app.route("/wordcloud_code")
def wordcloud_code():
    return render_template("wordcloud_code.html")


@app.route("/sentiment")
def sentiment():
    return render_template("Tweepy Sentiment Analysis on Keyword.html")


@app.route("/sentiment_code")
def sentiment_code():
    return render_template("sentiment_code.html")


@app.route("/bigram")
def bigram():
    return render_template("Twitter Analysis with Bigram and Wordcloud.html")


@app.route("/bigram_code")
def bigram_code():
    return render_template("bigram_code.html")


@app.route("/forecasting")
def forecasting():
    return render_template("forecasting.html")

@app.route("/forecasting_code")
def forecasting_code():
    return render_template("forecasting.html")    


if __name__ == "__main__":
    app.run(debug=True)

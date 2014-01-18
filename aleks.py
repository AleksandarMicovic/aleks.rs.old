#!/usr/bin/python
# -*- coding: utf-8 -*-

from flask import Flask, render_template, url_for, g
from flask_flatpages import FlatPages
from werkzeug.contrib.atom import AtomFeed
from flask_frozen import Freezer
import sys

DEBUG = True
FLATPAGES_AUTO_RELOAD = DEBUG
FLATPAGES_EXTENSION = '.md'
FLATPAGES_MARKDOWN_EXTENSIONS = ['codehilite(guess_lang=False)', 'headerid', 'tables']

app = Flask(__name__)
app.config.from_object(__name__)
pages = FlatPages(app)
freezer = Freezer(app)


@app.route("/")
def index():
    posts = [page for page in pages if 'content' == page.meta['type']]
    newest = sorted(posts, key=lambda a: a.meta['date'], reverse=True)[:15]
    return render_template("index.html", pages=newest)

@app.route("/archive/")
def archive():
    blog_posts = [page for page in pages
                  if page.meta['type'] in ['content', 'misc']]
    posts = sorted(blog_posts, key=lambda a: a.meta['date'], reverse=True)
    return render_template("archive.html", pages=posts)

@app.route("/tag/<string:tag>/")
def tag(tag):
    tagged = [page for page in pages if tag in page.meta.get('tags', [])]
    return render_template("tag.html", pages=tagged, tag=tag)

@app.route("/<path:path>/")
def page(path):
    page = pages.get_or_404(path)
    return render_template("page.html", page=page)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "build":
        freezer.freeze()
    else:
        freezer.run(debug=True)

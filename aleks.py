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
FLATPAGES_MARKDOWN_EXTENSIONS = ['codehilite(guess_lang=False)', 'headerid']

app = Flask(__name__)
app.config.from_object(__name__)
pages = FlatPages(app)
freezer = Freezer(app)

# Routing

@app.route("/")
def index():
    posts = [page for page in pages if 'blog' == page.meta['type']]
    newest = sorted(posts, key=lambda a: a.meta['date'], reverse=True)[:1][0]
    return render_template("index.html", post=newest)

@app.route("/archive/")
def archive():
    blog_posts = [page for page in pages if 'blog' == page.meta['type']]
    posts = sorted(blog_posts, key=lambda a: a.meta['date'], reverse=True)
    return render_template("archive.html", pages=posts)

@app.route("/tag/<string:tag>/")
def tag(tag):
    tagged = [page for page in pages if tag in page.meta.get('tags', [])]
    return render_template("tag.html", pages=tagged, tag=tag)

@app.route("/lists/<string:item>/")
def collection(item):
    open_file = open('db/' + item, 'r')
    content = open_file.read().decode('utf-8')
    open_file.close()

    items = [line.split('|') for line in content.split('\n')]

    return render_template("lists/books.html", items=items)

@app.route("/<path:path>/")
def page(path):
    page = pages.get_or_404(path)
    return render_template("page.html", page=page)

@app.route('/recent.atom')
def recent_feed():
    url = "aleks.rs"
    feed = AtomFeed(u"aleks.rs — Recent Articles", feed_url=url, url=url)
    all_pages = [page for page in pages]
    sorted_pages = sorted(all_pages, key=lambda a: a.meta['date'], reverse=True)[:5]

    for page in sorted_pages:
        feed.add(unicode(page.meta.get('title')),
                 unicode(page.html),
                 content_type='html',
                 author=page.meta.get('author'),
                 url=url_for('page', path=page.path),
                 updated=page.meta.get('updated'),
                 published=page.meta.get('date'))
    return feed.get_response()

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "build":
        freezer.freeze()
    else:
        freezer.run(debug=True)

#!/usr/bin/python
# -*- coding: utf-8 -*-

from flask import Flask, render_template, url_for, g
from flask_flatpages import FlatPages
from werkzeug.contrib.atom import AtomFeed
from flask_frozen import Freezer
import sys
import sqlite3

DEBUG = True
FLATPAGES_AUTO_RELOAD = DEBUG
FLATPAGES_EXTENSION = '.md'
FLATPAGES_MARKDOWN_EXTENSIONS = ['codehilite(guess_lang=False)', 'headerid']

app = Flask(__name__)
app.config.from_object(__name__)
pages = FlatPages(app)
freezer = Freezer(app)

# Helpers

def query_db(query, args=(), one=False):
    cur = g.db.execute(query, args)
    rv = [dict((cur.description[idx][0], value)
               for idx, value in enumerate(row)) for row in cur.fetchall()]
    return (rv[0] if rv else None) if one else rv

# Routing

@app.route("/")
def index():
    posts = [page for page in pages if 'blog' == page.meta['type']]
    sorted_posts = sorted(posts, key=lambda a: a.meta['date'], reverse=True)[:3]
    return render_template("index.html", pages=sorted_posts)

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
    # Normally, this is super dumb, but since I own the local DB and it itself
    # holds many tables I plan on rendering on my site, using only one function
    # to render multiple tables is elegant. Doubly so, since this is only run 
    # once to generate the static page. So far, I only have books.

    g.db = sqlite3.connect('db/db')
    items = query_db('select * from ' + item)
    g.db.close()
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
